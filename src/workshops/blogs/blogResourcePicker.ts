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

    public canHandleHyperlink(hyperlink: HyperlinkModel): boolean {
        return hyperlink.type === "post";
    }

    public getHyperlinkFromLinkable(blogPost: IBlogPost): HyperlinkModel {
        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = blogPost.title;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.permalinkKey = blogPost.permalinkKey;
        hyperlinkModel.type = "post";

        return hyperlinkModel;
    }

    public async getHyperlinkFromPermalink(permalink: IPermalink, target: string): Promise<HyperlinkModel> {
        const blogPost = await this.blogService.getBlogPostByKey(permalink.targetKey);

        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = blogPost.title;
        hyperlinkModel.target = target;
        hyperlinkModel.permalinkKey = permalink.key;
        hyperlinkModel.type = "post";

        return hyperlinkModel;
    }

    public getHyperlinkFromResource(blogPost: IBlogPost): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = blogPost.title;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.permalinkKey = blogPost.permalinkKey;
        hyperlinkModel.type = "post";

        return hyperlinkModel;
    }
}