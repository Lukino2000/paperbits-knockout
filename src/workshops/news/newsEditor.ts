import * as ko from "knockout";
import { ContentConfig } from "@paperbits/common/editing/contentNode";
import { INewsArticle } from "@paperbits/common/news/INewsElement";
import { INewsService } from "@paperbits/common/news/INewsService";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { NewsArticleItem } from "../../workshops/news/newsElementItem";
import { IFileService } from "@paperbits/common/files/IFileService";

export class NewsEditor {
    private readonly newsService: INewsService;
    private readonly fileService: IFileService;
    private readonly permalinkService: IPermalinkService;
    private readonly routeHandler: IRouteHandler;
    private readonly viewManager: IViewManager;
    private template: ContentConfig;

    public readonly searchPattern: KnockoutObservable<string>;
    public readonly newsElements: KnockoutObservableArray<NewsArticleItem>;
    public readonly working: KnockoutObservable<boolean>;

    constructor(newsService: INewsService, fileService: IFileService, permalinkService: IPermalinkService, routeHandler: IRouteHandler, viewManager: IViewManager) {
        // initialization...
        this.newsService = newsService;
        this.fileService = fileService;
        this.permalinkService = permalinkService;
        this.routeHandler = routeHandler;
        this.viewManager = viewManager;

        // rebinding...
        this.searchNewsElements = this.searchNewsElements.bind(this);
        this.addNewsElement = this.addNewsElement.bind(this);
        this.selectNewsElement = this.selectNewsElement.bind(this);

        // setting up...
        this.working = ko.observable(true);
        this.newsElements = ko.observableArray<NewsArticleItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchNewsElements);
        this.searchNewsElements("");
        this.init();
    }

    public async init(): Promise<void> {
        this.template = {
            "kind": "block",
            "nodes": [
                {
                    "kind": "block",
                    "nodes": [
                        {
                            "align": {
                                "md": "center"
                            },
                            "kind": "block",
                            "nodes": [
                                {
                                    "kind": "block",
                                    "nodes": [
                                        {
                                            "kind": "widget",
                                            "nodes": [
                                                {
                                                    "kind": "block",
                                                    "nodes": [
                                                        {
                                                            "kind": "text",
                                                            "text": "News article"
                                                        }
                                                    ],
                                                    "type": "paragraph"
                                                }
                                            ],
                                            "type": "text"
                                        }
                                    ],
                                    "size": {
                                        "md": 12
                                    },
                                    "type": "layout-column"
                                }
                            ],
                            "type": "layout-row"
                        }
                    ],
                    "type": "layout-section"
                }
            ],
            "type": "newsElement"
        }
    }

    public async searchNewsElements(searchPattern: string): Promise<void> {
        this.working(true);

        let newsElements = await this.newsService.search(searchPattern);
        let newsElementItems = newsElements.map(newsElement => new NewsArticleItem(newsElement));

        this.newsElements(newsElementItems);

        this.working(false);
    }

    public selectNewsElement(newsItem: NewsArticleItem): void {
        this.viewManager.openWorkshop("news-element-details-editor", newsItem);
    }

    public async addNewsElement(): Promise<void> {
        this.working(true);

        let newsElement = await this.newsService.createNewsElement("News article", "", "");
        let createPermalinkPromise = this.permalinkService.createPermalink("/news/new", newsElement.key);
        let createContentPromise = this.fileService.createFile(this.template);

        let results = await Promise.all<any>([createPermalinkPromise, createContentPromise]);
        let permalink = results[0];
        let content = results[1];

        newsElement.permalinkKey = permalink.key;
        newsElement.contentKey = content.key;

        await this.newsService.updateNewsElement(newsElement);

        this.routeHandler.navigateTo(permalink.uri);

        let newsElementItem = new NewsArticleItem(newsElement);

        this.newsElements.push(newsElementItem);
        this.selectNewsElement(newsElementItem);
        this.working(false);
    }
}