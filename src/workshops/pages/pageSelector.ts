import * as ko from "knockout";
import template from "./pageSelector.html";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { PageItem, AnchorItem } from "./pageItem";
import { PageSelection } from '@paperbits/common/pages/pageSelection';
import { PageContract } from '@paperbits/common/pages/pageContract';
import { IPermalink } from '@paperbits/common/permalinks/IPermalink';
import { IPermalinkService } from '@paperbits/common/permalinks/IPermalinkService';
import { IPageService } from '@paperbits/common/pages/IPageService';
import { Component } from "../../decorators/component";


@Component({
    selector: "page-selector",
    template: template,
    injectable: "pageSelector"
})
export class PageSelector implements IResourceSelector<PageSelection> {
    private readonly pageService: IPageService;
    private readonly permalinkService: IPermalinkService;

    public readonly searchPattern: KnockoutObservable<string>;
    public readonly pages: KnockoutObservableArray<PageItem>;
    public readonly working: KnockoutObservable<boolean>;

    public selectedPage: KnockoutObservable<PageItem>;
    public onResourceSelected: (selection: PageSelection) => void;

    constructor(pageService: IPageService, permalinkService: IPermalinkService, onSelect: (page: PageSelection) => void) {
        this.pageService = pageService;
        this.permalinkService = permalinkService;

        this.selectPage = this.selectPage.bind(this);
        this.selectAnchor = this.selectAnchor.bind(this);
        this.onResourceSelected = onSelect;

        this.pages = ko.observableArray<PageItem>();
        this.selectedPage = ko.observable<PageItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchPages);
        this.working = ko.observable(true);

        // setting up...
        this.pages = ko.observableArray<PageItem>();
        this.selectedPage = ko.observable<PageItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchPages);
        this.working = ko.observable(true);

        this.searchPages();
    }

    public async searchPages(searchPattern: string = ""): Promise<void> {
        this.working(true);

        let pages = await this.pageService.searchPages(searchPattern);
        let pageItems = pages.map(page => new PageItem(page));
        this.pages(pageItems);
        this.working(false);
    }

    public async selectPage(page: PageItem, anchorKey?: string): Promise<void> {
        this.selectedPage(page);

        if (this.onResourceSelected) {
            this.onResourceSelected({ title: page.title(), permalinkKey: page.permalinkKey });
        }
    }

    public async selectAnchor(anchor: AnchorItem): Promise<void> {
        if (this.onResourceSelected) {
            this.onResourceSelected({ title: anchor.title, permalinkKey: anchor.permalinkKey });
        }
    }
}