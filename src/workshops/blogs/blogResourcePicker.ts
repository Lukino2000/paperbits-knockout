import { IBlogPost } from "@paperbits/common/blogs/IBlogPost";
import { IBlogService } from "@paperbits/common/blogs/IBlogService";
import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { IHyperlinkProvider } from "@paperbits/common/ui/IHyperlinkProvider";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";
import { BlogPermalinkResolver } from "@paperbits/common/blogs/blogPermalinkResolver";

export class BlogResourcePicker implements IHyperlinkProvider {
    private readonly blogService: IBlogService;
    private readonly blogPermalinkResolver: BlogPermalinkResolver;

    public readonly name: string = "Blog posts";
    public readonly componentName = "blog-selector";

    constructor(blogService: IBlogService, blogPermalinkResolver: BlogPermalinkResolver) {
        this.blogService = blogService;
        this.blogPermalinkResolver = blogPermalinkResolver;
    }

    public canHandleResource(resource: string): boolean {
        return resource.startsWith("posts/");
    }

    public getHyperlinkFromLinkable(blogPost: IBlogPost): HyperlinkModel {
        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = blogPost.title;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.permalinkKey = blogPost.permalinkKey;

        return hyperlinkModel;
    }

    public async getHyperlinkFromPermalink(permalink: IPermalink, target: string): Promise<HyperlinkModel> {
        // return await this.blogPostPermalinkResolver.getHyperlinkFromConfig();

        let blogPost = await this.blogService.getBlogPostByKey(permalink.targetKey);

        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = blogPost.title;
        hyperlinkModel.target = target;
        hyperlinkModel.permalinkKey = permalink.key;

        return hyperlinkModel;
    }

    public getHyperlinkFromResource(blogPost: IBlogPost): HyperlinkModel {
        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = blogPost.title;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.permalinkKey = blogPost.permalinkKey;

        return hyperlinkModel;
    }
}