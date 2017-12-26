﻿import * as _ from "lodash";
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
import { IPageService } from "@paperbits/common/pages/IPageService";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IPage } from "@paperbits/common/pages/IPage";
import { ISettings } from "@paperbits/common/sites/ISettings";


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
    private readonly pageService: IPageService;
    private readonly permalinkService: IPermalinkService;
    private readonly siteService: ISiteService;
    private contextualEditorsBag: IBag<IContextualEditor> = {};

    private currentPage: IPage;

    public journey: KnockoutObservableArray<IEditorSession>;
    public journeyName: KnockoutComputed<string>;
    
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

    constructor(eventManager: IEventManager, globalEventHandler: GlobalEventHandler, routeHandler: IRouteHandler, 
                mediaService: IMediaService, pageService: IPageService, permalinkService: IPermalinkService, siteService: ISiteService) {
        this.eventManager = eventManager;
        this.globalEventHandler = globalEventHandler;
        this.routeHandler = routeHandler;
        this.mediaService = mediaService;
        this.pageService = pageService;
        this.permalinkService = permalinkService;
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
        this.mode = ViewManagerMode.selecting;
        this.progressIndicators = ko.observableArray<ProgressIndicator>();
        this.journey = ko.observableArray<IEditorSession>();
        this.journeyName = ko.pureComputed<string>(() => {
            if (this.journey().length === 0) {
                return null;
            }

            return this.journey()[0].heading;
        });
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
        this.setTitle();
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

    public async setTitle(settings?:ISettings, page?: IPage): Promise<void> {
        let siteTitle, pageTitle;
        if (settings && settings.site) {
            siteTitle = settings.site.title;
        } else {
            let settings = await this.siteService.getSiteSettings();
            if (settings && settings.site) {
                siteTitle = settings.site.title;
            }
        }
        if (!page) {
            page = await this.getCurrentPage();
            pageTitle = page.title;
        }

        let pageType;
        pageType = this.getPageType(page.key);        
        
        switch (pageType) {
            case "page":
                pageTitle = page.title;
                break;
            case "post":
                pageTitle = `Blog - ${page.title}`;
                break;
            case "news":
                pageTitle = `News - ${page.title}`;
                break;
        }

        document.title = [siteTitle, pageTitle].join(" | ");
    }

    private getPageType(pageKey: string) : string {
        let pageType = "page";
        if (pageKey.startsWith("posts")) {
            pageType = "post";
        }
        if (pageKey.startsWith("news")) {
            pageType = "news";
        }
        return pageType;
    }

    private async getCurrentPage() : Promise<IPage> {
        let url = this.routeHandler.getCurrentUrl();
        let permalink = await this.permalinkService.getPermalinkByUrl(url);
        let pageKey = permalink.targetKey;
        if (this.currentPage && this.currentPage.permalinkKey === pageKey) {
            return this.currentPage;
        }
        this.currentPage = await this.pageService.getPageByKey(pageKey);
        return this.currentPage;
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

    public updateJourneyComponent(editorSession: IEditorSession): void {
        let journey = this.journey();

        let existingComponent = journey.first(c => { return c.component.name === editorSession.component.name; });

        if (existingComponent) {
            journey = journey.splice(0, journey.indexOf(existingComponent));
        }
        journey.push(editorSession);

        this.journey(journey);
    }

    public clearJourney(): void {
        this.journey([]);
        this.widgetEditor(null);
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
        this.mode = ViewManagerMode.dragging;
        this.clearContextualEditors();
    }

    public unfoldEverything(): void {
        this.primaryToolboxVisible(true);
        this.mode = ViewManagerMode.selecting;
    }

    public openWorkshop(heading: string, componentName: string, parameters?: any): IEditorSession {
        this.clearContextualEditors();

        const session: IEditorSession = {
            heading: heading,
            component: {
                name: componentName,
                params: parameters
            }
        }

        this.updateJourneyComponent(session);

        this.mode = ViewManagerMode.configure;

        return session;
    }

    /**
     * Deletes specified editors and all editors after.
     * @param editorSession IEditorSession
     */
    public closeWorkshop(editor: IEditorSession | string): void {
        const journey = this.journey();
        let editorSession;

        if (typeof editor === "string") {
            editorSession = journey.find(x => x.component.name === editor);
        }
        else {
            editorSession = editor;
        }

        const indexOfClosingEditor = journey.indexOf(editorSession);

        journey.length = indexOfClosingEditor;

        this.journey(journey);
        this.mode = ViewManagerMode.selecting;
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

        this.mode = ViewManagerMode.selecting;
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
        this.closeWidgetEditor();
        this.selectedElement(null);
        this.selectedElement(config);
        this.selectedElementContextualEditor(ce);

        if (this.mode != ViewManagerMode.configure) {
            this.mode = ViewManagerMode.selected;
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
        this.mode = ViewManagerMode.selecting;
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


