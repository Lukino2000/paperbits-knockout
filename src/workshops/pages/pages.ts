﻿import * as ko from "knockout";
import template from "./pages.html";
import { PageContract } from "@paperbits/common/pages/pageContract";
import { IPageService } from "@paperbits/common/pages/IPageService";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { PageItem } from "../../workshops/pages/pageItem";
import { IFileService } from "@paperbits/common/files/IFileService";
import { Keys } from "@paperbits/common/keyboard";
import { IBlockService } from "@paperbits/common/blocks/IBlockService";
import { Component } from "../../decorators/component";

const templateBlockKey = "blocks/8730d297-af39-8166-83b6-9439addca789";

@Component({
    selector: "pages",
    template: template,
    injectable: "pagesWorkshop"
})
export class PagesWorkshop {
    private searchTimeout: any;

    public readonly searchPattern: KnockoutObservable<string>;
    public readonly pages: KnockoutObservableArray<PageItem>;
    public readonly working: KnockoutObservable<boolean>;

    public selectedPage: KnockoutObservable<PageItem>;

    constructor(
        private readonly pageService: IPageService,
        private readonly fileService: IFileService,
        private readonly permalinkService: IPermalinkService,
        private readonly routeHandler: IRouteHandler,
        private readonly blockService: IBlockService,
        private readonly viewManager: IViewManager
    ) {
        // rebinding...
        this.searchPages = this.searchPages.bind(this);
        this.addPage = this.addPage.bind(this);
        this.selectPage = this.selectPage.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        // setting up...
        this.pages = ko.observableArray<PageItem>();
        this.selectedPage = ko.observable<PageItem>();
        this.searchPattern = ko.observable<string>("");
        this.searchPattern.subscribe(this.searchPages);
        this.working = ko.observable(true);

        this.searchPages();
    }

    private async launchSearch(searchPattern: string = ""): Promise<void> {
        this.working(true);
        let pages = await this.pageService.searchPages(searchPattern);
        let pageItems = pages.map(page => new PageItem(page));

        this.pages(pageItems);
        this.working(false);
    }

    public async searchPages(searchPattern: string = ""): Promise<void> {
        clearTimeout(this.searchTimeout);

        this.searchTimeout = setTimeout(() => {
            this.launchSearch(searchPattern);
        }, 600);
    }

    public selectPage(pageItem: PageItem): void {
        this.selectedPage(pageItem);
        this.viewManager.setTitle(null, pageItem.toPage());
        this.viewManager.openViewAsWorkshop("Page", "page-details-workshop", {
            pageItem: pageItem,
            onDeleteCallback: () => {
                this.searchPages();
            }
        });
    }

    public async addPage(): Promise<void> {
        this.working(true);

        const page = await this.pageService.createPage("New page", "", "");
        const createPermalinkPromise = this.permalinkService.createPermalink("/new", page.key);
        const contentTemplate = await this.blockService.getBlockByKey(templateBlockKey);

        const template = {
            "object": "block",
            "nodes": [contentTemplate.content],
            "type": "page"
        }

        const createContentPromise = this.fileService.createFile(template);
        const results = await Promise.all<any>([createPermalinkPromise, createContentPromise]);
        const permalink = results[0];
        const content = results[1];

        page.permalinkKey = permalink.key;
        page.contentKey = content.key;

        await this.pageService.updatePage(page);

        this.routeHandler.navigateTo(permalink.uri);

        const pageItem = new PageItem(page);

        this.pages.push(pageItem);
        this.selectPage(pageItem);
        this.working(false);
    }

    public async deleteSelectedPage(): Promise<void> {
        //TODO: Show confirmation dialog according to mockup
        this.viewManager.closeWorkshop("page-details-workshop");

        await this.pageService.deletePage(this.selectedPage().toPage());
        await this.searchPages();

        this.routeHandler.navigateTo("/");
    }

    public onKeyDown(item: PageItem, event: KeyboardEvent): void {
        if (event.keyCode === Keys.Delete) {
            this.deleteSelectedPage();
        }
    }
}