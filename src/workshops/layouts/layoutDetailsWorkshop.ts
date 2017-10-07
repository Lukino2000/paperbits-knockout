import * as ko from "knockout";
import template from "./layoutDetailsWorkshop.html";
import { IRouteHandler } from '@paperbits/common/routing/IRouteHandler';
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { ILayoutService } from "@paperbits/common/layouts/ILayoutService";
import { LayoutItem } from "./layoutItem";
import { Component } from "../../decorators/component";


@Component({
    selector: "layout-details-workshop",
    template: template,
    injectable: "layoutDetailsWorkshop"
})
export class LayoutDetailsWorkshop {
    private readonly layoutService: ILayoutService;
    private readonly routeHandler: IRouteHandler;
    private readonly viewManager: IViewManager;

    public readonly layoutItem: LayoutItem;
    public isNotDefault: boolean;

    constructor(layoutService: ILayoutService, routeHandler: IRouteHandler, layoutItem: LayoutItem, viewManager: IViewManager) {
        // initialization...
        this.layoutService = layoutService;
        this.routeHandler = routeHandler;
        this.viewManager = viewManager;
        this.layoutItem = layoutItem;

        // rebinding...
        //this.onFaviconUploaded = this.onFaviconUploaded.bind(this);
        this.deleteLayout = this.deleteLayout.bind(this);
        this.updateMetadata = this.updateMetadata.bind(this);
        this.updateUriTemplate = this.updateUriTemplate.bind(this);

        this.init();
    }

    private async init(): Promise<void> {
        this.layoutItem.title.subscribe(this.updateMetadata);
        this.layoutItem.description.subscribe(this.updateMetadata);
        this.layoutItem.uriTemplate.subscribe(this.updateUriTemplate);
        let uri = this.layoutItem.uriTemplate();
        this.isNotDefault = (uri !== "/");
        this.routeHandler.navigateTo(uri, true, true);
    }

    private async updateMetadata(): Promise<void> {
        await this.layoutService.updateLayout(this.layoutItem.toLayout());
    }

    private async updateUriTemplate(): Promise<void> {
        await this.layoutService.updateLayout(this.layoutItem.toLayout());
        this.routeHandler.navigateTo(this.layoutItem.uriTemplate(), false);
    }

    public async deleteLayout(): Promise<void> {
        //TODO: Show confirmation dialog according to mockup
        await this.layoutService.deleteLayout(this.layoutItem.toLayout());

        this.routeHandler.navigateTo("/");
        this.viewManager.closeWorkshop("layout-details-workshop");
        this.viewManager.openWorkshop("layouts");
    }
}