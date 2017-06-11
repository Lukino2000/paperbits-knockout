import { IBlogPost } from "@paperbits/common/blogs/IBlogPost";
import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IBlogService } from "@paperbits/common/blogs/IBlogService";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { BlogPostItem } from "../../workshops/blogs/blogPostItem";

export class BlogPostDetailsWorkshop {
    private readonly blogService: IBlogService;
    private readonly permalinkService: IPermalinkService;
    private readonly routeHandler: IRouteHandler;
    private readonly viewManager: IViewManager;
    private blogPostPermalink: IPermalink;

    public readonly blogPostItem: BlogPostItem;

    constructor(blogService: IBlogService, permalinkService: IPermalinkService, routeHandler: IRouteHandler, blogPostItem: BlogPostItem, viewManager: IViewManager) {
        // initialization...
        this.blogService = blogService;
        this.permalinkService = permalinkService;
        this.routeHandler = routeHandler;
        this.viewManager = viewManager;
        this.blogPostItem = blogPostItem;

        // rebinding...
        //this.onFaviconUploaded = this.onFaviconUploaded.bind(this);
        this.deleteBlogPost = this.deleteBlogPost.bind(this);
        this.updateMetadata = this.updateMetadata.bind(this);
        this.updatePermalink = this.updatePermalink.bind(this);

        this.init();
    }

    private async init(): Promise<void> {
        let permalink = await this.permalinkService.getPermalinkByKey(this.blogPostItem.permalinkKey);

        this.blogPostPermalink = permalink;
        this.blogPostItem.permalinkUrl(permalink.uri);
        this.routeHandler.navigateTo(permalink.uri);


        this.blogPostItem.title.subscribe(this.updateMetadata);
        this.blogPostItem.description.subscribe(this.updateMetadata);
        this.blogPostItem.keywords.subscribe(this.updateMetadata);
        this.blogPostItem.permalinkUrl.subscribe(this.updatePermalink);
    }

    private async updateMetadata(): Promise<void> {
        await this.blogService.updateBlogPost(this.blogPostItem.toBlogPost());
    }

    private async updatePermalink(): Promise<void> {
        this.blogPostPermalink.uri = this.blogPostItem.permalinkUrl();
        await this.permalinkService.updatePermalink(this.blogPostPermalink);
        this.routeHandler.navigateTo(this.blogPostPermalink.uri, false);
    }

    public async deleteBlogPost(): Promise<void> {
        //TODO: Show confirmation dialog according to mockup
        await this.blogService.deleteBlogPost(this.blogPostItem.toBlogPost());

        this.routeHandler.navigateTo("/");
        this.viewManager.closeWorkshop("blog-post-details-workshop");
        this.viewManager.openWorkshop("blogs");
    }
}