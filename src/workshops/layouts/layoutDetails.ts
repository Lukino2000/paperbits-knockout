import * as ko from "knockout";
import template from "./layoutDetails.html";
import { IRouteHandler } from '@paperbits/common/routing/IRouteHandler';
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { ILayoutService } from "@paperbits/common/layouts/ILayoutService";
import { LayoutItem } from "./layoutItem";
import { Component } from "../../decorators/component";


@Component({
    selector: "layout-details-workshop",
    template: template,
    injectable: "layoutDetails"
})
export class LayoutDetails {
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
        this.updateLayout = this.updateLayout.bind(this);

        this.layoutItem.title
            .extend({ required: true })
            .subscribe(this.updateLayout);

        this.layoutItem.uriTemplate
            .extend({ uniqueLayoutUri: layoutItem.key })
            .subscribe(this.updateLayout);

        this.layoutItem.description
            .subscribe(this.updateLayout);

        this.init();
    }

    private async init(): Promise<void> {
        const uri = this.layoutItem.uriTemplate();
        this.isNotDefault = (uri !== "/");
        this.routeHandler.navigateTo(uri);
    }

    private async updateLayout(): Promise<void> {
        if (this.layoutItem.title.isValid()) {
            await this.layoutService.updateLayout(this.layoutItem.toLayout());
        }
    }

    public async deleteLayout(): Promise<void> {
        //TODO: Show confirmation dialog according to mockup
        await this.layoutService.deleteLayout(this.layoutItem.toLayout());

        this.routeHandler.navigateTo("/");
    }
}