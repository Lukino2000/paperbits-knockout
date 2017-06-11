import * as ko from "knockout";
import { ContentConfig } from "@paperbits/common/editing/contentNode";
import { IBlogPost } from "@paperbits/common/blogs/IBlogPost";
import { IBlogService } from "@paperbits/common/blogs/IBlogService";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { BlogPostItem } from "../../workshops/blogs/blogPostItem";
import { IFileService } from "@paperbits/common/files/IFileService";

const DeleteKeyCode = 46; // TODO: Move to separate file;

export class BlogWorkshop {
    private readonly blogService: IBlogService;
    private readonly fileService: IFileService;
    private readonly permalinkService: IPermalinkService;
    private readonly routeHandler: IRouteHandler;
    private readonly viewManager: IViewManager;
    private template: ContentConfig;


    public readonly searchPattern: KnockoutObservable<string>;
    public readonly blogPosts: KnockoutObservableArray<BlogPostItem>;
    public readonly working: KnockoutObservable<boolean>;
    public readonly selectedBlogPost: KnockoutObservable<BlogPostItem>;

    constructor(blogService: IBlogService, fileService: IFileService, permalinkService: IPermalinkService, routeHandler: IRouteHandler, viewManager: IViewManager) {
        // initialization...
        this.blogService = blogService;
        this.fileService = fileService;
        this.permalinkService = permalinkService;
        this.routeHandler = routeHandler;
        this.viewManager = viewManager;

        // rebinding...
        this.searchBlogPosts = this.searchBlogPosts.bind(this);
        this.addBlogPost = this.addBlogPost.bind(this);
        this.selectBlogPost = this.selectBlogPost.bind(this);
        this.keydown = this.keydown.bind(this);

        // setting up...
        this.working = ko.observable(true);
        this.blogPosts = ko.observableArray<BlogPostItem>();
        this.selectedBlogPost = ko.observable<BlogPostItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchBlogPosts);
        this.searchBlogPosts("");
        this.init();
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
                                                            "text": "New blog post"
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
            "type": "blogPost"
        }
    }

    public async searchBlogPosts(searchPattern: string): Promise<void> {
        this.working(true);

        let blogposts = await this.blogService.search(searchPattern);
        let blogpostItems = blogposts.map(blogPost => new BlogPostItem(blogPost));

        this.blogPosts(blogpostItems);

        this.working(false);
    }

    public selectBlogPost(blogpost: BlogPostItem): void {
        this.selectedBlogPost(blogpost);
        this.viewManager.openWorkshop("blog-post-details-workshop", blogpost);
    }

    public async addBlogPost(): Promise<void> {
        this.working(true);

        let blogpost = await this.blogService.createBlogPost("New blog post", "", "");
        let createPermalinkPromise = this.permalinkService.createPermalink("/blog/new", blogpost.key);
        let createContentPromise = this.fileService.createFile(this.template);

        let results = await Promise.all<any>([createPermalinkPromise, createContentPromise]);
        let permalink = results[0];
        let content = results[1];

        blogpost.permalinkKey = permalink.key;
        blogpost.contentKey = content.key;

        await this.blogService.updateBlogPost(blogpost);

        let blogpostItem = new BlogPostItem(blogpost);

        this.blogPosts.push(blogpostItem);
        this.selectBlogPost(blogpostItem);
        this.working(false);
    }

    public async deleteSelectedBlogPost(): Promise<void> {
        //TODO: Show confirmation dialog according to mockup
        await this.blogService.deleteBlogPost(this.selectedBlogPost().toBlogPost());

        this.routeHandler.navigateTo("/");
        this.viewManager.closeWorkshop("blog-post-details-workshop");
        this.viewManager.openWorkshop("blogs");
    }

    public keydown(item: BlogPostItem, event: KeyboardEvent): void {
        if (event.keyCode === DeleteKeyCode) {
            this.deleteSelectedBlogPost();
        }
    }
}