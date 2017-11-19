import * as ko from "knockout";
import template from "./pageDetails.html";
import { IPage } from "@paperbits/common/pages/IPage";
import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IPageService } from "@paperbits/common/pages/IPageService";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { PageItem } from "../../workshops/pages/pageItem";
import { Component } from "../../decorators/component";
import { Validators } from "../../validation/validators";

@Component({
    selector: "page-details-workshop",
    template: template,
    injectable: "pageDetailsWorkshop"
})
export class PageDetailsWorkshop {
    private readonly pageService: IPageService;
    private readonly permalinkService: IPermalinkService;
    private readonly routeHandler: IRouteHandler;
    private readonly viewManager: IViewManager;
    private pagePermalink: IPermalink;

    public readonly pageItem: PageItem;

    constructor(pageService: IPageService, permalinkService: IPermalinkService, routeHandler: IRouteHandler, pageItem: PageItem, viewManager: IViewManager) {
        // initialization...
        this.pageService = pageService;
        this.permalinkService = permalinkService;
        this.routeHandler = routeHandler;
        this.viewManager = viewManager;
        this.pageItem = pageItem;

        // rebinding...
        this.deletePage = this.deletePage.bind(this);
        this.updateMetadata = this.updateMetadata.bind(this);

        Validators.initPermalinkValidation();

        this.pageItem.title.extend({ required: true }).subscribe(this.updateMetadata);

        this.pageItem.description.subscribe(this.updateMetadata);

        this.pageItem.keywords.subscribe(this.updateMetadata);

        //this.pageItem.permalinkUrl.extend({ uniquePermalink: true }).subscribe(this.updatePermalink);


        this.init();
    }

    private async init(): Promise<void> {
        const permalink = await this.permalinkService.getPermalinkByKey(this.pageItem.permalinkKey);

        this.pagePermalink = permalink;
        this.pageItem.permalinkUrl(permalink.uri);
        this.routeHandler.navigateTo(permalink.uri);

        Validators.setPermalinkValidatorWithUpdate(this.pageItem.permalinkUrl, this.pagePermalink, this.permalinkService);
    }

    private async updateMetadata(): Promise<void> {
        if (this.pageItem.title.isValid() && this.pageItem.permalinkUrl.isValid()) {
            await this.pageService.updatePage(this.pageItem.toPage());
        }
    }

    public async deletePage(): Promise<void> {
        //TODO: Show confirmation dialog according to mockup
        await this.pageService.deletePage(this.pageItem.toPage());

        this.routeHandler.navigateTo("/");
        this.viewManager.closeWorkshop("page-details-workshop");
        this.viewManager.openWorkshop("pages");
    }
}