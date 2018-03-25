import * as ko from "knockout";
import template from "./blogSelector.html";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { BlogPostItem } from "./blogPostItem";
import { BlogPostContract } from '@paperbits/common/blogs/BlogPostContract';
import { IPermalink } from '@paperbits/common/permalinks/IPermalink';
import { IPermalinkService } from '@paperbits/common/permalinks/IPermalinkService';
import { IBlogService } from '@paperbits/common/blogs/IBlogService';
import { Component } from "../../decorators/component";
import { AnchorItem } from "../pages/pageItem";
import { PermalinkSelection } from "@paperbits/common/permalinks/permalinkSelection";


@Component({
    selector: "blog-selector",
    template: template,
    injectable: "blogSelector"
})
export class BlogSelector implements IResourceSelector<PermalinkSelection> {
    private readonly blogService: IBlogService;
    private readonly permalinkService: IPermalinkService;

    public readonly searchPattern: KnockoutObservable<string>;
    public readonly posts: KnockoutObservableArray<BlogPostItem>;
    public readonly working: KnockoutObservable<boolean>;

    public selectedPost: KnockoutObservable<BlogPostItem>;
    public onResourceSelected: (blog: PermalinkSelection) => void;

    constructor(blogService: IBlogService, permalinkService: IPermalinkService, onSelect: (selection: PermalinkSelection) => void) {
        this.blogService = blogService;
        this.permalinkService = permalinkService;

        this.selectPost = this.selectPost.bind(this);
        this.onResourceSelected = onSelect;

        this.posts = ko.observableArray<BlogPostItem>();
        this.selectedPost = ko.observable<BlogPostItem>();
        this.selectAnchor = this.selectAnchor.bind(this);
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchPosts);
        this.working = ko.observable(true);

        // setting up...
        this.posts = ko.observableArray<BlogPostItem>();
        this.selectedPost = ko.observable<BlogPostItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchPosts);
        this.working = ko.observable(true);

        this.searchPosts();
    }

    public async searchPosts(searchPattern: string = ""): Promise<void> {
        this.working(true);

        let blogs = await this.blogService.search(searchPattern);
        let blogItems = blogs.map(blog => new BlogPostItem(blog));
        this.posts(blogItems);
        this.working(false);
    }

    public selectPost(blog: BlogPostItem): void {
        this.selectedPost(blog);

        if (this.onResourceSelected) {
            this.onResourceSelected({ title: blog.title(), permalinkKey: blog.permalinkKey });
        }
    }

    public selectAnchor(anchor: AnchorItem): void {
        if (this.onResourceSelected) {
            this.onResourceSelected({ title: anchor.title, permalinkKey: anchor.permalinkKey });
        }
    }
}