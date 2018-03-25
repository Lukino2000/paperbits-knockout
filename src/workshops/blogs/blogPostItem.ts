import * as ko from "knockout";
import { BlogPostContract } from '@paperbits/common/blogs/BlogPostContract';
import { AnchorItem } from "../pages/pageItem";

export class BlogPostItem {
    contentKey?: string;
    permalinkKey?: string;

    public key: string;
    public permalinkUrl: KnockoutObservable<string>;
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public keywords: KnockoutObservable<string>;
    public hasFocus: KnockoutObservable<boolean>;
    public anchors: AnchorItem[];

    constructor(blogPost: BlogPostContract) {
        this.contentKey = blogPost.contentKey;
        this.permalinkKey = blogPost.permalinkKey;

        this.key = blogPost.key;
        this.permalinkUrl = ko.observable<string>();
        this.title = ko.observable<string>(blogPost.title);
        this.description = ko.observable<string>(blogPost.description);
        this.keywords = ko.observable<string>(blogPost.keywords);
        this.hasFocus = ko.observable<boolean>(false);
        this.anchors = [];

        if (blogPost.anchors) {
            Object.keys(blogPost.anchors).forEach(key => {
                const anchorItem = new AnchorItem();
                anchorItem.title = `${blogPost.title} > ${blogPost.anchors[key]}`;
                anchorItem.shortTitle = blogPost.anchors[key];
                anchorItem.permalinkKey = key.replaceAll("|", "/");
                this.anchors.push(anchorItem);
            })
        }
    }

    toBlogPost(): BlogPostContract {
        return {
            key: this.key,
            title: this.title(),
            description: this.description(),
            keywords: this.keywords(),
            contentKey: this.contentKey,
            permalinkKey: this.permalinkKey
        }
    }
}