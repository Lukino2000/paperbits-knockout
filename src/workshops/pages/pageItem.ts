import * as ko from "knockout";
import { IPage } from "@paperbits/common/pages/IPage";

export class PageItem {
    contentKey?: string;
    permalinkKey?: string;

    public key: string;
    public permalinkUrl: KnockoutObservable<string>;
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public keywords: KnockoutObservable<string>;
    public hasFocus: KnockoutObservable<boolean>;

    constructor(page: IPage) {
        this.contentKey = page.contentKey;
        this.permalinkKey = page.permalinkKey;

        this.key = page.key;
        this.permalinkUrl = ko.observable<string>();
        this.title = ko.observable<string>(page.title);
        this.description = ko.observable<string>(page.description);
        this.keywords = ko.observable<string>(page.keywords);
        this.hasFocus = ko.observable<boolean>(false);
    }

    toPage(): IPage {
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