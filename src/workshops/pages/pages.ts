import * as ko from "knockout";
import * as template from "./pages.html";
import { Contract } from "@paperbits/common/editing/contentNode";
import { IPage } from "@paperbits/common/pages/IPage";
import { IPageService } from "@paperbits/common/pages/IPageService";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { PageItem } from "../../workshops/pages/pageItem";
import { IFileService } from "@paperbits/common/files/IFileService";
import { Component } from "../../decorators/component";

const DeleteKeyCode = 46; // TODO: Move to separate file;


@Component({
    selector: "pages",
    template: template,
    injectable: "pagesWorkshop"
})
export class PagesWorkshop {
    private readonly pageService: IPageService;
    private readonly fileService: IFileService;
    private readonly permalinkService: IPermalinkService;
    private readonly routeHandler: IRouteHandler;
    private readonly viewManager: IViewManager;
    private template: Contract;
    private searchTimeout: any;

    public readonly searchPattern: KnockoutObservable<string>;
    public readonly pages: KnockoutObservableArray<PageItem>;
    public readonly working: KnockoutObservable<boolean>;

    public selectedPage: KnockoutObservable<PageItem>;

    constructor(pageService: IPageService, fileService: IFileService, permalinkService: IPermalinkService, routeHandler: IRouteHandler, viewManager: IViewManager) {
        // initialization...
        this.pageService = pageService;
        this.fileService = fileService;
        this.permalinkService = permalinkService;
        this.routeHandler = routeHandler;
        this.viewManager = viewManager;

        // rebinding...
        this.searchPages = this.searchPages.bind(this);
        this.addPage = this.addPage.bind(this);
        this.selectPage = this.selectPage.bind(this);
        this.keydown = this.keydown.bind(this);

        // setting up...
        this.pages = ko.observableArray<PageItem>();
        this.selectedPage = ko.observable<PageItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchPages);
        this.working = ko.observable(true);
        

        this.init();
        this.searchPages();
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
                                                            "text": "New page"
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
            "type": "page"
        }
    }

    private async launchSearch(searchPattern: string = ""): Promise<void> {
        this.working(true);
        let pages = await this.pageService.search(searchPattern);
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

    public selectPage(page: PageItem): void {
        this.selectedPage(page);
        this.viewManager.openWorkshop("page-details-workshop", page);
    }

    public async addPage(): Promise<void> {
        this.working(true);
        let page = await this.pageService.createPage("New page", "", "");
        let createPermalinkPromise = this.permalinkService.createPermalink("/new", page.key);
        let createContentPromise = this.fileService.createFile(this.template);

        let results = await Promise.all<any>([createPermalinkPromise, createContentPromise]);
        let permalink = results[0];
        let content = results[1];

        page.permalinkKey = permalink.key;
        page.contentKey = content.key;

        await this.pageService.updatePage(page);

        this.routeHandler.navigateTo(permalink.uri);

        let pageItem = new PageItem(page);

        this.pages.push(pageItem);
        this.selectPage(pageItem);
        this.working(false);
    }

    public async deleteSelectedPage(): Promise<void> {
        //TODO: Show confirmation dialog according to mockup
        await this.pageService.deletePage(this.selectedPage().toPage());

        this.routeHandler.navigateTo("/");
        this.viewManager.closeWorkshop("page-details-workshop");
        this.viewManager.openWorkshop("pages");
    }

    public keydown(item: PageItem, event: KeyboardEvent): void {
        if (event.keyCode === DeleteKeyCode) {
            this.deleteSelectedPage();
        }
    }
}