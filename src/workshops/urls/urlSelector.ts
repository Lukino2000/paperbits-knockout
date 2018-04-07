import * as ko from "knockout";
import template from "./urlSelector.html";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { UrlItem } from "./urlItem";
import { UrlSelection } from '@paperbits/common/urls/urlSelection';
import { UrlContract } from '@paperbits/common/urls/urlContract';
import { IPermalink } from '@paperbits/common/permalinks/IPermalink';
import { IPermalinkService } from '@paperbits/common/permalinks/IPermalinkService';
import { IUrlService } from '@paperbits/common/urls/IUrlService';
import { Component } from "../../decorators/component";


@Component({
    selector: "url-selector",
    template: template,
    injectable: "urlSelector"
})
export class UrlSelector implements IResourceSelector<UrlSelection> {
    private readonly urlService: IUrlService;
    private readonly permalinkService: IPermalinkService;

    public readonly searchPattern: KnockoutObservable<string>;
    public readonly urls: KnockoutObservableArray<UrlItem>;
    public readonly uri: KnockoutObservable<string>;
    public readonly working: KnockoutObservable<boolean>;

    public selectedUrl: KnockoutObservable<UrlItem>;
    public onResourceSelected: (selection: UrlSelection) => void;

    constructor(urlService: IUrlService, permalinkService: IPermalinkService, onSelect: (url: UrlSelection) => void) {
        this.urlService = urlService;
        this.permalinkService = permalinkService;

        this.selectUrl = this.selectUrl.bind(this);
        this.createUrl = this.createUrl.bind(this);
        this.onResourceSelected = onSelect;

        this.uri = ko.observable<string>();
        this.urls = ko.observableArray<UrlItem>();
        this.selectedUrl = ko.observable<UrlItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchUrls);
        this.working = ko.observable(true);

        // setting up...
        this.urls = ko.observableArray<UrlItem>();
        this.selectedUrl = ko.observable<UrlItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchUrls);
        this.working = ko.observable(true);

        this.searchUrls();
    }

    public async searchUrls(searchPattern: string = ""): Promise<void> {
        this.working(true);

        const urls = await this.urlService.search(searchPattern);
        const urlItems = urls.map(url => new UrlItem(url));

        this.urls(urlItems);
        this.working(false);
    }

    public async selectUrl(urlItem: UrlItem, anchorKey?: string): Promise<void> {
        this.selectedUrl(urlItem);

        if (this.onResourceSelected) {
            this.onResourceSelected({ title: urlItem.title(), permalinkKey: urlItem.permalinkKey });
        }
    }

    public async createUrl(): Promise<void> {
        const newUri = this.uri();

        const url = await this.urlService.createUrl(newUri, "");
        const permalink = await this.permalinkService.createPermalink(newUri, url.key);

        url.permalinkKey = permalink.key;

        await this.urlService.updateUrl(url);

        this.uri("");
        await this.searchUrls();
    }
}