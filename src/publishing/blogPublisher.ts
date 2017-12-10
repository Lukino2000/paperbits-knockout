import * as ko from "knockout";
import { PageModelBinder } from "@paperbits/common/widgets/page/pageModelBinder";
import { IBlogService } from "@paperbits/common/blogs/IBlogService";
import { LayoutModelBinder } from "@paperbits/common/widgets/layout/layoutModelBinder";
import { IPublisher } from "./IPublisher";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IBlobStorage } from "@paperbits/common/persistence/IBlobStorage";
import { ISiteService } from "@paperbits/common/sites/ISiteService";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IBlogPost } from "@paperbits/common/blogs/IBlogPost";
import * as Utils from "@paperbits/common/core/utils";
import { LayoutViewModelBinder } from "../widgets/layout/layoutViewModelBinder";


export class BlogPublisher implements IPublisher {
    private readonly blogPostModelBinder: PageModelBinder;
    private readonly routeHandler: IRouteHandler;
    private readonly permalinkService: IPermalinkService;
    private readonly outputBlobStorage: IBlobStorage;
    private readonly blogPostService: IBlogService;
    private readonly siteService: ISiteService;
    private readonly layoutModelBinder: LayoutModelBinder;
    private readonly layoutViewModelBinder: LayoutViewModelBinder;

    constructor(pageModelBinder: PageModelBinder, routeHandler: IRouteHandler, blogService: IBlogService, permalinkService: IPermalinkService, siteService: ISiteService, outputBlobStorage: IBlobStorage, layoutModelBinder: LayoutModelBinder, layoutViewModelBinder: LayoutViewModelBinder) {
        this.blogPostModelBinder = pageModelBinder;
        this.routeHandler = routeHandler;
        this.blogPostService = blogService;
        this.permalinkService = permalinkService;
        this.siteService = siteService;
        this.outputBlobStorage = outputBlobStorage;
        this.layoutModelBinder = layoutModelBinder;
        this.layoutViewModelBinder = layoutViewModelBinder;

        this.publish = this.publish.bind(this);
        this.renderBlogPost = this.renderBlogPost.bind(this);
    }

    private async renderBlogPost(post: IBlogPost): Promise<{ name, bytes }> {
        console.log(`Publishing blog post ${post.title}...`);

        let documentModel = {
            siteSettings: null,
            pageModel: post,
            pageContentModel: {},
            layoutContentModel: {},
            permalink: null
        }

        let siteSettingsPromise = new Promise(async (resolve, reject) => {
            let settings = await this.siteService.getSiteSettings();
            documentModel.siteSettings = settings;
            resolve();
        });

        let resourceUri: string;
        let htmlContent: string;

        let buildContentPromise = new Promise(async (resolve, reject) => {
            let permalink = await this.permalinkService.getPermalinkByKey(post.permalinkKey);
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
                htmlContent = document.documentElement.outerHTML;
                resolve();
            }, 10);
        });

        await Promise.all([siteSettingsPromise, buildContentPromise]);

        let contentBytes = Utils.stringToUnit8Array(htmlContent);

        if (!resourceUri || resourceUri === "/blog") {
            resourceUri = "/blog/index.html";
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
        let blogPosts = await this.blogPostService.search("");
        let results = [];
        for (let i = 0; i < blogPosts.length; i++) {
            let page = await this.renderBlogPost(blogPosts[i]);
            results.push(this.outputBlobStorage.uploadBlob(page.name, page.bytes));
        }
        await Promise.all(results);
    }
}
