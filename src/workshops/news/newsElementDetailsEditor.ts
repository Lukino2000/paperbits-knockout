import { INewsArticle } from "@paperbits/common/news/INewsElement";
import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { INewsService } from "@paperbits/common/news/INewsService";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { NewsArticleItem } from "../../workshops/news/newsElementItem";

export class NewsElementDetailsEditor {
    private readonly newsService: INewsService;
    private readonly permalinkService: IPermalinkService;
    private readonly routeHandler: IRouteHandler;
    private readonly viewManager: IViewManager;
    private newsElementPermalink: IPermalink;

    public readonly newsElementItem: NewsArticleItem;

    constructor(newsService: INewsService, permalinkService: IPermalinkService, routeHandler: IRouteHandler, newsElementItem: NewsArticleItem, viewManager: IViewManager) {
        // initialization...
        this.newsService = newsService;
        this.permalinkService = permalinkService;
        this.routeHandler = routeHandler;
        this.viewManager = viewManager;
        this.newsElementItem = newsElementItem;

        // rebinding...
        //this.onFaviconUploaded = this.onFaviconUploaded.bind(this);
        this.deleteNewsElement = this.deleteNewsElement.bind(this);
        this.updateMetadata = this.updateMetadata.bind(this);
        this.updatePermalink = this.updatePermalink.bind(this);

        this.init();
    }

    private async init(): Promise<void> {
        let permalink = await this.permalinkService.getPermalinkByKey(this.newsElementItem.permalinkKey);

        this.newsElementPermalink = permalink;
        this.newsElementItem.permalinkUrl(permalink.uri);
        this.routeHandler.navigateTo(permalink.uri);

        this.newsElementItem.title.subscribe(this.updateMetadata);
        this.newsElementItem.description.subscribe(this.updateMetadata);
        this.newsElementItem.keywords.subscribe(this.updateMetadata);
        this.newsElementItem.permalinkUrl.subscribe(this.updatePermalink);
    }

    private async updateMetadata(): Promise<void> {
        await this.newsService.updateNewsElement(this.newsElementItem.toNewsElement());
    }

    private async updatePermalink(): Promise<void> {
        this.newsElementPermalink.uri = this.newsElementItem.permalinkUrl();
        await this.permalinkService.updatePermalink(this.newsElementPermalink);
        this.routeHandler.navigateTo(this.newsElementPermalink.uri, false);
    }

    public async deleteNewsElement(): Promise<void> {
        //TODO: Show confirmation dialog according to mockup
        await this.newsService.deleteNewsElement(this.newsElementItem.toNewsElement());

        this.routeHandler.navigateTo("/");
        this.viewManager.closeWorkshop("news-element-details-editor");
        this.viewManager.openWorkshop("news");
    }
}