import * as ko from "knockout";
import * as template from "./layoutsWorkshop.html";
import { ContentConfig } from "@paperbits/common/editing/contentNode";
import { IRouteHandler } from '@paperbits/common/routing/IRouteHandler';
import { IPermalinkService } from '@paperbits/common/permalinks/IPermalinkService';
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { IFileService } from '@paperbits/common/files/IFileService';
import { ILayoutService } from "@paperbits/common/layouts/ILayoutService";
import { LayoutItem } from "./layoutItem";
import { Component } from "../../decorators/component";

const DeleteKeyCode = 46; // TODO: Move to separate file;


@Component({
    selector: "layouts",
    template: template,
    injectable: "layoutsWorkshop"
})
export class LayoutsWorkshop {
    private readonly layoutService: ILayoutService;
    private readonly fileService: IFileService;
    private readonly permalinkService: IPermalinkService;
    private readonly routeHandler: IRouteHandler;
    private readonly viewManager: IViewManager;
    private template: ContentConfig;

    public readonly searchPattern: KnockoutObservable<string>;
    public readonly layouts: KnockoutObservableArray<LayoutItem>;
    public readonly working: KnockoutObservable<boolean>;

    public selectedLayout: KnockoutObservable<LayoutItem>;

    constructor(layoutService: ILayoutService, fileService: IFileService, permalinkService: IPermalinkService, routeHandler: IRouteHandler, viewManager: IViewManager) {
        // initialization...
        this.layoutService = layoutService;
        this.fileService = fileService;
        this.permalinkService = permalinkService;
        this.routeHandler = routeHandler;
        this.viewManager = viewManager;

        // rebinding...
        this.searchLayouts = this.searchLayouts.bind(this);
        this.addLayout = this.addLayout.bind(this);
        this.selectLayout = this.selectLayout.bind(this);
        this.keydown = this.keydown.bind(this);

        // setting up...
        this.layouts = ko.observableArray<LayoutItem>();
        this.selectedLayout = ko.observable<LayoutItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchLayouts);
        this.working = ko.observable(true);

        this.init();
        this.searchLayouts();
    }

    public async init(): Promise<void> {
        this.template = {
            "kind" : "block",
            "nodes" : [ {
                "kind" : "block",
                "type" : "page"
            } ],
            "type" : "layout"
        }
    }

    public async searchLayouts(searchPattern: string = ""): Promise<void> {
        this.working(true);

        let layouts = await this.layoutService.search(searchPattern);
        let layoutItems = layouts.map(layout => new LayoutItem(layout));

        this.layouts(layoutItems);
        this.working(false);
    }

    public selectLayout(layout: LayoutItem): void {
        this.selectedLayout(layout);
        this.viewManager.openWorkshop("layout-details-workshop", layout);
    }

    public async addLayout(): Promise<void> {
        this.working(true);
        let layout = await this.layoutService.createLayout("New Layout", "", "");
        let content = await this.fileService.createFile(this.template);

        layout.contentKey = content.key;

        await this.layoutService.updateLayout(layout);

        let layoutItem = new LayoutItem(layout);

        this.layouts.push(layoutItem);
        this.selectLayout(layoutItem);

        this.routeHandler.navigateTo(layoutItem.uriTemplate());
        this.working(false);
    }

    public async deleteSelectedLayout(): Promise<void> {
        //TODO: Show confirmation dialog according to mockup
        await this.layoutService.deleteLayout(this.selectedLayout().toLayout());

        this.routeHandler.navigateTo("/");
        this.viewManager.closeWorkshop("layout-details-workshop");
        this.viewManager.openWorkshop("layouts");
    }

    public keydown(item: LayoutItem, event: KeyboardEvent): void {
        if (event.keyCode === DeleteKeyCode) {
            this.deleteSelectedLayout();
        }
    }
}