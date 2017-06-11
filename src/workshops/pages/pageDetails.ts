import { IPage } from "@paperbits/common/pages/IPage";
import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IPageService } from "@paperbits/common/pages/IPageService";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { PageItem } from "../../workshops/pages/pageItem";

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
        //this.onFaviconUploaded = this.onFaviconUploaded.bind(this);
        this.deletePage = this.deletePage.bind(this);
        this.updateMetadata = this.updateMetadata.bind(this);
        this.updatePermalink = this.updatePermalink.bind(this);

        this.init();
    }

    private async init(): Promise<void> {
        let permalink = await this.permalinkService.getPermalinkByKey(this.pageItem.permalinkKey);

        this.pagePermalink = permalink;
        this.pageItem.permalinkUrl(permalink.uri);
        this.routeHandler.navigateTo(permalink.uri, true, true);

        this.pageItem.title.subscribe(this.updateMetadata);
        this.pageItem.description.subscribe(this.updateMetadata);
        this.pageItem.keywords.subscribe(this.updateMetadata);
        this.pageItem.permalinkUrl.subscribe(this.updatePermalink);
    }

    private async updateMetadata(): Promise<void> {
        await this.pageService.updatePage(this.pageItem.toPage());
    }

    private async updatePermalink(): Promise<void> {
        this.pagePermalink.uri = this.pageItem.permalinkUrl();
        await this.permalinkService.updatePermalink(this.pagePermalink);
        this.routeHandler.navigateTo(this.pagePermalink.uri, false);
    }

    public async deletePage(): Promise<void> {
        //TODO: Show confirmation dialog according to mockup
        await this.pageService.deletePage(this.pageItem.toPage());

        this.routeHandler.navigateTo("/");
        this.viewManager.closeWorkshop("page-details-workshop");
        this.viewManager.openWorkshop("pages");
    }
}