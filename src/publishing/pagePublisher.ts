import * as ko from "knockout";
import { IPublisher } from "./IPublisher";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IBlobStorage } from "@paperbits/common/persistence/IBlobStorage";
import { IPageService } from "@paperbits/common/pages/IPageService";
import { ISiteService } from "@paperbits/common/sites/ISiteService";
import { IPage } from "@paperbits/common/pages/IPage";
import * as Utils from "@paperbits/common/core/utils";
import { LayoutViewModel } from "../widgets/layout/layoutViewModel";
import { LayoutModelBinder } from "@paperbits/common/widgets/layout/layoutModelBinder";
import { LayoutViewModelBinder } from "../widgets/layout/layoutViewModelBinder";
import { metaDataSetter } from "@paperbits/common/meta/metaDataSetter";
import { IMediaService } from "@paperbits/common/media/IMediaService";
import { ISiteSettings, ISettings } from "../../../paperbits-common/src/sites/ISettings";
import { IMedia } from "../../../paperbits-common/src/media/IMedia";
import { resolve } from "path";

export class PagePublisher implements IPublisher {
    private readonly routeHandler: IRouteHandler;
    private readonly permalinkService: IPermalinkService;
    private readonly outputBlobStorage: IBlobStorage;
    private readonly pageService: IPageService;
    private readonly siteService: ISiteService;
    private readonly layoutModelBinder: LayoutModelBinder;
    private readonly layoutViewModelBinder: LayoutViewModelBinder;
    private readonly mediaService: IMediaService;

    constructor(routeHandler: IRouteHandler, pageService: IPageService, permalinkService: IPermalinkService, siteService: ISiteService, outputBlobStorage: IBlobStorage, layoutModelBinder: LayoutModelBinder, layoutViewModelBinder: LayoutViewModelBinder, mediaService: IMediaService) {
        this.routeHandler = routeHandler;
        this.pageService = pageService;
        this.permalinkService = permalinkService;
        this.siteService = siteService;
        this.outputBlobStorage = outputBlobStorage;
        this.layoutModelBinder = layoutModelBinder;
        this.layoutViewModelBinder = layoutViewModelBinder;
        this.mediaService = mediaService;

        this.publish = this.publish.bind(this);
        this.renderPage = this.renderPage.bind(this);
        this.setSiteSettings = this.setSiteSettings.bind(this);
    }

    private async renderPage(page: IPage, settings: ISettings, iconFile: IMedia): Promise<{ name, bytes }> {
        console.log(`Publishing page ${page.title}...`);

        const documentModel = {
            siteSettings: null,
            pageModel: page,
            pageContentModel: {},
            layoutContentModel: {},
            permalink: null
        };       

        let resourceUri: string;
        let htmlContent: string;

        let buildContentPromise = new Promise<void>(async (resolve, reject) => {
            const permalink = await this.permalinkService.getPermalinkByKey(page.permalinkKey);
            
            documentModel.permalink = permalink;
            resourceUri = permalink.uri;

            this.routeHandler.navigateTo(resourceUri);

            const layoutModel = await this.layoutModelBinder.getLayoutModel(resourceUri, true);
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

                this.setSiteSettings(settings, iconFile, page);

                htmlContent = document.documentElement.outerHTML;
                resolve();
            }, 10);
        });

        await buildContentPromise;

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

        const settings = await this.siteService.getSiteSettings();
        let iconFile;
        if (settings && settings.site.faviconPermalinkKey) {
            iconFile = await this.mediaService.getMediaByPermalink(settings.site.faviconPermalinkKey);
        }

        for (let i = 0; i < pages.length; i++) {
            let page = await this.renderPage(pages[i], settings, iconFile);

            results.push(this.outputBlobStorage.uploadBlob(page.name, page.bytes));
        }

        await Promise.all(results);
    }
    
    public setSiteSettings(settings: ISettings, iconFile: IMedia, page: IPage) {
        if (settings && page) {
            if (settings.site.faviconPermalinkKey) {
                if (iconFile && iconFile.downloadUrl) {
                    metaDataSetter.setFavIcon(iconFile.downloadUrl);
                }
            }
            if (settings.site.title) {
                document.title = page.title ? `${settings.site.title} | ${page.title}` : settings.site.title;
            }
            if (settings.site.description) {
                metaDataSetter.setDescription(page.description || settings.site.description);
            }
            if (settings.site.keywords) {
                metaDataSetter.setKeywords([settings.site.keywords, page.keywords].join(", "));
            }
            if (settings.site.author) {
                metaDataSetter.setAuthor(settings.site.author);
            }
        }
    }
}


