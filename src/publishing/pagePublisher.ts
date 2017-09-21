import * as ko from "knockout";
import { IPublisher } from "./IPublisher";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IBlobStorage } from "@paperbits/common/persistence/IBlobStorage";
import { IPageService } from "@paperbits/common/pages/IPageService";
import { ISiteService } from "@paperbits/common/sites/ISiteService";
import { ISiteSettings } from "@paperbits/common/sites/ISiteSettings";
import { IPage } from "@paperbits/common/pages/IPage";
import * as Utils from "@paperbits/common/core/utils";
import { LayoutViewModel } from "../widgets/layout/layoutViewModel";
import { LayoutModelBinder } from "@paperbits/common/widgets/layout/layoutModelBinder";
import { LayoutViewModelBinder } from "../widgets/layout/layoutViewModelBinder";


export class PagePublisher implements IPublisher {
    private readonly routeHandler: IRouteHandler;
    private readonly permalinkService: IPermalinkService;
    private readonly outputBlobStorage: IBlobStorage;
    private readonly pageService: IPageService;
    private readonly siteService: ISiteService;
    private readonly siteSettings: ISiteSettings;
    private readonly layoutModelBinder: LayoutModelBinder;
    private readonly layoutViewModelBinder: LayoutViewModelBinder;

    constructor(routeHandler: IRouteHandler, pageService: IPageService, permalinkService: IPermalinkService, siteService: ISiteService, outputBlobStorage: IBlobStorage, layoutModelBinder: LayoutModelBinder, layoutViewModelBinder: LayoutViewModelBinder) {
        this.routeHandler = routeHandler;
        this.pageService = pageService;
        this.permalinkService = permalinkService;
        this.siteService = siteService;
        this.outputBlobStorage = outputBlobStorage;
        this.layoutModelBinder = layoutModelBinder;
        this.layoutViewModelBinder = layoutViewModelBinder;

        this.publish = this.publish.bind(this);
        this.renderPage = this.renderPage.bind(this);
    }

    private async renderPage(page: IPage): Promise<{ name, bytes }> {
        console.log(`Publishing page ${page.title}...`);

        const documentModel = {
            siteSettings: null,
            pageModel: page,
            pageContentModel: {},
            layoutContentModel: {},
            permalink: null
        }

        const siteSettingsPromise = new Promise<void>(async (resolve, reject) => {
            let settings = await this.siteService.getSiteSettings();
            documentModel.siteSettings = settings;
            resolve();
        });

        let resourceUri: string;
        let htmlContent: string;

        let buildContentPromise = new Promise<void>(async (resolve, reject) => {
            const permalink = await this.permalinkService.getPermalinkByKey(page.permalinkKey);

            documentModel.permalink = permalink;
            resourceUri = permalink.uri;

            this.routeHandler.navigateTo(resourceUri);

            const layoutModel = await this.layoutModelBinder.getLayoutModel(resourceUri);
            const viewModel = await this.layoutViewModelBinder.modelToViewModel(layoutModel, true);

            const element = document.createElement("div");
            element.innerHTML = `
            <paperbits-intercom></paperbits-intercom>
            <!-- ko if: widgets().length > 0 -->
            <!-- ko foreach: { data: widgets, as: 'widget'  } -->
            <!-- ko widget: widget --><!-- /ko -->
            <!-- /ko -->
            <!-- /ko -->
            <!-- ko if: widgets().length === 0 -->
            Add page or section
            <!-- /ko -->`
            
            ko.applyBindings(viewModel, element);

            setTimeout(() => {
                const layoutElement = document.documentElement.querySelector("paperbits-document");
                layoutElement.innerHTML = element.innerHTML;
                htmlContent = document.documentElement.outerHTML;
                resolve();
            }, 10);
        });

        await Promise.all([siteSettingsPromise, buildContentPromise]);

        let contentBytes = Utils.stringToUnit8Array(htmlContent);

        if (!resourceUri || resourceUri === "/") {
            resourceUri = "/index.html";
        }
        else {
            // if filename has no extension we publish it to a dedicated folder with index.html
            if (!resourceUri.substr((~-resourceUri.lastIndexOf(".") >>> 0) + 2)) {
                resourceUri = `/${resourceUri}/index.html`;
            }
        }

        return { name: resourceUri, bytes: contentBytes };
    }

    public async publish(): Promise<void> {
        let pages = await this.pageService.search("");
        let results = [];

        for (let i = 0; i < pages.length; i++) {
            let page = await this.renderPage(pages[i]);

            results.push(this.outputBlobStorage.uploadBlob(page.name, page.bytes));
        }

        await Promise.all(results);
    }
}


