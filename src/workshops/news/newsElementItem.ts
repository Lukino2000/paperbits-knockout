import * as ko from "knockout";
import { INewsArticle } from '@paperbits/common/news/INewsElement';

export class NewsArticleItem {
    contentKey?: string;
    permalinkKey?: string;

    public key: string;
    public permalinkUrl: KnockoutObservable<string>;
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public keywords: KnockoutObservable<string>;
    public hasFocus: KnockoutObservable<boolean>;

    constructor(newsElement: INewsArticle) {
        this.contentKey = newsElement.contentKey;
        this.permalinkKey = newsElement.permalinkKey;

        this.key = newsElement.key;
        this.permalinkUrl = ko.observable<string>();
        this.title = ko.observable<string>(newsElement.title);
        this.description = ko.observable<string>(newsElement.description);
        this.keywords = ko.observable<string>(newsElement.keywords);
        this.hasFocus = ko.observable<boolean>(false);
    }

    toNewsElement(): INewsArticle {
        return {
            key: this.key,
            title: this.title(),
            description: this.description(),
            keywords: this.keywords(),
            contentKey: this.contentKey,
            permalinkKey: this.permalinkKey
        }
    }
}