import * as _ from "lodash";
import * as $ from "jquery/dist/jquery";
import * as ko from "knockout";
import template from "./viewManager.html";
import "@paperbits/common/core/extensions";
import { IHighlightConfig } from "@paperbits/common/ui/IHighlightConfig";
import { metaDataSetter } from "@paperbits/common/meta/metaDataSetter";
import { IBag } from "@paperbits/common/core/IBag";
import { IContextualEditor } from "@paperbits/common/ui/IContextualEditor";
import { IEditorSession } from "@paperbits/common/ui/IEditorSession";
import { ProgressPromise } from "@paperbits/common/core/progressPromise";
import { IMediaService } from "@paperbits/common/media/IMediaService";
import { IEventManager } from "@paperbits/common/events/IEventManager";
import { GlobalEventHandler } from "@paperbits/common/events/globalEventHandler";
import { IViewManager, ViewManagerMode } from "@paperbits/common/ui/IViewManager";
import { IComponent } from "@paperbits/common/ui/IComponent";
import { ProgressIndicator } from "../ui/progressIndicator";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { Component } from "../decorators/component";
import { DragSession } from "@paperbits/common/ui/draggables/dragManager";
import { ISplitterConfig } from "../bindingHandlers/bindingHandlers.splitter";
import { IMedia } from "@paperbits/common/media/IMedia";
import { ISiteService } from "@paperbits/common/sites/ISiteService";


@Component({
    selector: "view-manager",
    template: template,
    injectable: "viewManager"
})
export class ViewManager implements IViewManager {
    private readonly eventManager: IEventManager;
    private readonly globalEventHandler: GlobalEventHandler;
    private readonly routeHandler: IRouteHandler;
    private readonly mediaService: IMediaService;
    private readonly siteService: ISiteService;
    private contextualEditorsBag: IBag<IContextualEditor> = {};

    public journey: KnockoutObservableArray<IComponent>;
    public journeyName: KnockoutObservable<string>;
    public itemSelectorName: KnockoutObservable<string>;
    public progressIndicators: KnockoutObservableArray<ProgressIndicator>;
    public primaryToolboxVisible: KnockoutObservable<boolean>;
    public widgetEditor: KnockoutObservable<IEditorSession>;
    public contextualEditors: KnockoutObservableArray<IContextualEditor>;
    public highlightedElement: KnockoutObservable<IHighlightConfig>;
    public splitterElement: KnockoutObservable<ISplitterConfig>;
    public selectedElement: KnockoutObservable<IHighlightConfig>;
    public selectedElementContextualEditor: KnockoutObservable<IContextualEditor>;
    public viewport: KnockoutObservable<string>;
    public shutter: KnockoutObservable<boolean>;
    public dragSession: KnockoutObservable<DragSession>;

    public mode: ViewManagerMode;

    constructor(eventManager: IEventManager, globalEventHandler: GlobalEventHandler, routeHandler: IRouteHandler, mediaService: IMediaService, siteService: ISiteService) {
        this.eventManager = eventManager;
        this.globalEventHandler = globalEventHandler;
        this.routeHandler = routeHandler;
        this.mediaService = mediaService;
        this.siteService = siteService;

        // rebinding...
        this.addProgressIndicator = this.addProgressIndicator.bind(this);
        this.addPromiseProgressIndicator = this.addPromiseProgressIndicator.bind(this);
        this.openWorkshop = this.openWorkshop.bind(this);
        this.scheduleIndicatorRemoval = this.scheduleIndicatorRemoval.bind(this);
        this.updateJourneyComponent = this.updateJourneyComponent.bind(this);
        this.clearJourney = this.clearJourney.bind(this);
        this.setWidgetEditor = this.setWidgetEditor.bind(this);
        this.foldEverything = this.foldEverything.bind(this);
        this.unfoldEverything = this.unfoldEverything.bind(this);
        this.closeWidgetEditor = this.closeWidgetEditor.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);

        // setting up...
        this.mode = ViewManagerMode.edit;
        this.progressIndicators = ko.observableArray<ProgressIndicator>();
        this.journey = ko.observableArray<IComponent>();
        this.journeyName = ko.observable<string>();
        this.itemSelectorName = ko.observable<string>(null);
        this.widgetEditor = ko.observable<IEditorSession>();
        this.contextualEditors = ko.observableArray<IContextualEditor>([]);
        this.highlightedElement = ko.observable<IHighlightConfig>();
        this.splitterElement = ko.observable<ISplitterConfig>();
        this.selectedElement = ko.observable<IHighlightConfig>();
        this.selectedElementContextualEditor = ko.observable<IContextualEditor>();
        this.viewport = ko.observable<string>("xl");
        this.shutter = ko.observable<boolean>(true);
        this.dragSession = ko.observable();

        this.primaryToolboxVisible = ko.observable<boolean>(true);

        this.globalEventHandler.addDragEnterListener(this.foldEverything);
        this.globalEventHandler.addDragDropListener(this.onDragEnd);
        this.globalEventHandler.addDragEndListener(this.onDragEnd);
        this.globalEventHandler.addDragLeaveScreenListener(this.unfoldEverything);


        this.eventManager.addEventListener("virtualDragEnd", this.onDragEnd);

        this.routeHandler.addRouteChangeListener(this.onRouteChange.bind(this));
        globalEventHandler.appendDocument(document);

        eventManager.addEventListener("onEscape", this.closeWidgetEditor);
        this.loadFavIcon();
    }

    private onRouteChange(): void {
        this.clearContextualEditors();
    }

    public async loadFavIcon(): Promise<void> {
        let settings = await this.siteService.getSiteSettings();

        if (settings && settings.site.faviconPermalinkKey) {
            let iconFile = await this.mediaService.getMediaByPermalink(settings.site.faviconPermalinkKey);
            
            if (iconFile && iconFile.downloadUrl) {
                metaDataSetter.setFavIcon(iconFile.downloadUrl);
            }
        }
    }

    public getCurrentJourney(): string {
        return this.journeyName();
    }

    public addProgressIndicator(title: string, content: string): ProgressIndicator {
        var indicator = new ProgressIndicator(title, content);
        this.progressIndicators.push(indicator);

        return indicator;
    }

    public notifySuccess(title: string, content: string): void {
        var indicator = new ProgressIndicator(title, content, 100);
        this.progressIndicators.push(indicator);
        this.scheduleIndicatorRemoval(indicator);
    }

    public addPromiseProgressIndicator<T>(promise: Promise<T>, title: string, content: string): void {
        var indicator = new ProgressIndicator(title, content);

        this.progressIndicators.push(indicator);

        if (promise["progress"]) {
            promise["progress"](indicator.progress);
        }

        promise.then(() => {
            indicator.complete(true);
        });

        promise.then(() => {
            this.scheduleIndicatorRemoval(indicator);
        });
    }

    public newJourney(journeyName: string, componentName: string, parameters?: any): void {
        this.clearJourney();
        this.journeyName(journeyName);
        this.openWorkshop(componentName, parameters);
        this.widgetEditor(null);
    }

    public updateJourneyComponent(component: IComponent): void {
        var result = this.journey();

        var existingComponent = result.first(c => { return c.name === component.name; });

        if (existingComponent) {
            result = result.splice(0, result.indexOf(existingComponent));
        }
        result.push(component);

        this.journey(result);
    }

    public clearJourney(): void {
        this.journeyName("");
        this.journey([]);
    }

    public foldWorkshops(): void {
        this.journey([]);
        this.primaryToolboxVisible(false);
    }

    public unfoldWorkshop(): void {
        this.primaryToolboxVisible(true);
    }

    public foldEverything(): void {
        this.foldWorkshops();
        this.mode = ViewManagerMode.fold;
        this.clearContextualEditors();
    }

    public unfoldEverything(): void {
        this.primaryToolboxVisible(true);
        this.mode = ViewManagerMode.edit;
    }

    public openWorkshop(componentName: string, parameters?: any): void {
        this.clearContextualEditors();

        var component: IComponent = {
            name: componentName,
            params: parameters
        };
        this.updateJourneyComponent(component);

        this.mode = ViewManagerMode.configure;
    }

    public closeWorkshop(componentName: string): void {
        var result = this.journey();

        var existingComponent = result.first(c => { return c.name === componentName; });

        if (existingComponent) {
            result = result.splice(0, result.indexOf(existingComponent));
        }

        this.journey(result);

        this.mode = ViewManagerMode.edit;
    }

    public scheduleIndicatorRemoval(indicator: ProgressIndicator): void {
        indicator.progress(100);

        setTimeout(() => {
            this.progressIndicators(_.without(this.progressIndicators(), indicator));
        }, 4000);
    }

    public openUploadDialog(): Promise<Array<File>> {
        //TODO: Make normal uploader component of it. No jquery should be here.
        var $genericUploader = $(`<input type="file" multiple />`);
        var genericUploader: any = $genericUploader[0];

        $genericUploader.click();

        return new Promise<Array<File>>((resolve, reject) => {
            $genericUploader.change(() => {
                resolve(genericUploader.files);
            });
        });
    }

    public setWidgetEditor(editorSession: IEditorSession): void {
        if (this.widgetEditor() == editorSession) {
            return;
        }

        this.clearContextualEditors();
        this.closeWidgetEditor();
        this.widgetEditor(editorSession);
        this.mode = ViewManagerMode.configure;

        this.foldWorkshops();
    }

    public getWidgetEditorSession(): IEditorSession {
        return this.widgetEditor();
    }

    public closeWidgetEditor(): void {
        this.widgetEditor(null);
        this.eventManager.dispatchEvent("onWidgetEditorClose");
        this.clearContextualEditors();
        this.clearJourney();

        this.mode = ViewManagerMode.edit;
        this.unfoldWorkshop();
    }

    public setContextualEditor(editorName: string, contextualEditor: IContextualEditor): void {
        this.contextualEditorsBag[editorName] = contextualEditor;

        const editors = Object.keys(this.contextualEditorsBag).map(key => this.contextualEditorsBag[key]);

        this.contextualEditors(editors);
    }

    public removeContextualEditor(editorName: string): void {
        if (!this.contextualEditorsBag[editorName]) {
            return;
        }

        delete this.contextualEditorsBag[editorName];

        let editors = Object.keys(this.contextualEditorsBag).map(key => this.contextualEditorsBag[key]);

        this.contextualEditors(editors);
    }

    public clearContextualEditors(): void {
        this.contextualEditorsBag = {};
        this.contextualEditors([]);
        this.highlightedElement(null);
        this.setSplitter(null);
        this.selectedElement(null);
    }

    public setHighlight(config: IHighlightConfig): void {
        this.highlightedElement(null);
        this.setSplitter(null);
        this.highlightedElement(config);
    }

    public setSplitter(config: ISplitterConfig): void {
        this.splitterElement(null);
        this.splitterElement(config);
    }

    public setSelectedElement(config: IHighlightConfig, ce: IContextualEditor): void {
        this.clearContextualEditors();
        this.selectedElement(null);
        this.selectedElement(config);
        this.selectedElementContextualEditor(ce);

        if (this.mode != ViewManagerMode.configure) {
            this.mode = ViewManagerMode.select;
        }

        this.clearJourney();
    }

    public getSelectedElement(): IHighlightConfig {
        return this.selectedElement();
    }

    public setViewport(viewport: string): void {
        this.clearContextualEditors();
        this.viewport(viewport);
    }

    public getViewport(): string {
        return this.viewport();
    }

    public switchToEditing(): void {
        this.clearContextualEditors();
        this.closeWidgetEditor();
        this.mode = ViewManagerMode.edit;
    }

    public setShutter(): void {
        this.shutter(true);
    }

    public removeShutter(): void {
        this.shutter(false);
    }





    public beginDrag(session: DragSession): void {
        this.clearContextualEditors();
        this.closeWidgetEditor();
        this.dragSession(session);
        this.foldEverything();
    }

    public getDragSession(): DragSession {
        return this.dragSession();
    }

    public onDragEnd(): void {
        this.unfoldEverything();
    }
}


