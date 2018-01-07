import * as ko from "knockout";
import template from "./pageDetails.html";
import { PageContract } from "@paperbits/common/pages/pageContract";
import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IPageService } from "@paperbits/common/pages/IPageService";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { PageItem } from "../../workshops/pages/pageItem";
import { Component } from "../../decorators/component";


@Component({
    selector: "page-details-workshop",
    template: template,
    injectable: "pageDetailsWorkshop"
})
export class PageDetailsWorkshop {
    private pagePermalink: IPermalink;

    constructor(
        private readonly pageService: IPageService,
        private readonly permalinkService: IPermalinkService,
        private readonly routeHandler: IRouteHandler,
        private readonly pageItem: PageItem,
        private readonly viewManager: IViewManager) {

        // initialization...
        this.pageService = pageService;
        this.permalinkService = permalinkService;
        this.routeHandler = routeHandler;
        this.viewManager = viewManager;
        this.pageItem = pageItem;

        // rebinding...
        this.deletePage = this.deletePage.bind(this);
        this.updatePage = this.updatePage.bind(this);
        this.updatePermlaink = this.updatePermlaink.bind(this);

        this.pageItem.title
            .extend({ required: true, onlyValid: true })
            .subscribe(this.updatePage);

        this.pageItem.title
            .extend({ required: true });

        this.pageItem.description
            .subscribe(this.updatePage);

        this.pageItem.keywords
            .subscribe(this.updatePage);

        this.pageItem.permalinkUrl
            .extend({ uniquePermalink: this.pageItem.permalinkKey, onlyValid: true })
            .subscribe(this.updatePermlaink);

        this.init();
    }

    private async init(): Promise<void> {
        const permalink = await this.permalinkService.getPermalinkByKey(this.pageItem.permalinkKey);

        this.pagePermalink = permalink;
        this.pageItem.permalinkUrl(permalink.uri);
        this.routeHandler.navigateTo(permalink.uri);
    }

    private async updatePage(): Promise<void> {
        await this.pageService.updatePage(this.pageItem.toPage());
        this.viewManager.setTitle(null, this.pageItem.toPage());
    }

    private async updatePermlaink(): Promise<void> {
        this.pagePermalink.uri = this.pageItem.permalinkUrl();
        await this.permalinkService.updatePermalink(this.pagePermalink);
    }

    public async deletePage(): Promise<void> {
        //TODO: Show confirmation dialog according to mockup
        await this.pageService.deletePage(this.pageItem.toPage());

        this.routeHandler.navigateTo("/");
    }
}