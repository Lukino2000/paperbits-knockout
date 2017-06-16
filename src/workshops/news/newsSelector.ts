import * as ko from "knockout";
import * as template from "./newsSelector.html";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { NewsArticleItem } from "./newsElementItem";
import { INewsArticle } from '@paperbits/common/news/INewsElement';
import { IPermalink } from '@paperbits/common/permalinks/IPermalink';
import { IPermalinkService } from '@paperbits/common/permalinks/IPermalinkService';
import { INewsService } from '@paperbits/common/news/INewsService';
import { Component } from "../../decorators/component";


@Component({
    selector: "news-selector",
    template: template,
    injectable: "newsSelector"
})
export class NewsSelector implements IResourceSelector<INewsArticle> {
    private readonly newsService: INewsService;
    private readonly permalinkService: IPermalinkService;

    public readonly searchPattern: KnockoutObservable<string>;
    public readonly articles: KnockoutObservableArray<NewsArticleItem>;
    public readonly working: KnockoutObservable<boolean>;

    public selectedNews: KnockoutObservable<NewsArticleItem>;
    public onResourceSelected: (newsElement: INewsArticle) => void;

    constructor(newsService: INewsService, permalinkService: IPermalinkService, onSelect: (article: INewsArticle) => void) {
        this.newsService = newsService;
        this.permalinkService = permalinkService;

        this.selectArticle = this.selectArticle.bind(this);
        this.onResourceSelected = onSelect;

        this.articles = ko.observableArray<NewsArticleItem>();
        this.selectedNews = ko.observable<NewsArticleItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchNewss);
        this.working = ko.observable(true);

        // setting up...
        this.articles = ko.observableArray<NewsArticleItem>();
        this.selectedNews = ko.observable<NewsArticleItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchNewss);
        this.working = ko.observable(true);

        this.searchNewss();
    }

    public async searchNewss(searchPattern: string = ""): Promise<void> {
        this.working(true);

        let articles = await this.newsService.search(searchPattern);
        let articleItems = articles.map(article => new NewsArticleItem(article));
        this.articles(articleItems);
        this.working(false);
    }

    public async selectArticle(News: NewsArticleItem): Promise<void> {
        this.selectedNews(News);

        if (this.onResourceSelected) {
            this.onResourceSelected(News.toNewsElement());
        }
    }
}