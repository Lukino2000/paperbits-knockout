import { INewsArticle } from "@paperbits/common/news/INewsElement";
import { INewsService } from "@paperbits/common/news/INewsService";
import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { IHyperlinkProvider } from "@paperbits/common/ui/IHyperlinkProvider";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";
import { NewsPermalinkResolver } from "@paperbits/common/news/newsPermalinkResolver";

export class NewsResourcePicker implements IHyperlinkProvider {
    private readonly newsService: INewsService;
    private readonly newsPermalinkResolver: NewsPermalinkResolver;

    public readonly name: string = "News";
    public readonly componentName = "news-selector";

    constructor(newsService: INewsService, newsPermalinkResolver: NewsPermalinkResolver) {
        this.newsService = newsService;
        this.newsPermalinkResolver = newsPermalinkResolver;
    }

    public canHandleResource(resource: string): boolean {
        return resource.startsWith("news/");
    }

    public getHyperlinkFromLinkable(newsElement: INewsArticle): HyperlinkModel {
        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = newsElement.title;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.permalinkKey = newsElement.permalinkKey;

        return hyperlinkModel;
    }

    public async getHyperlinkFromPermalink(permalink: IPermalink, target: string): Promise<HyperlinkModel> {
        // return await this.newsElementPermalinkResolver.getHyperlinkFromConfig();

        let newsElement = await this.newsService.getNewsElementByKey(permalink.targetKey);

        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = newsElement.title;
        hyperlinkModel.target = target;
        hyperlinkModel.permalinkKey = permalink.key;

        return hyperlinkModel;
    }

    public getHyperlinkFromResource(newsElement: INewsArticle): HyperlinkModel {
        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = newsElement.title;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.permalinkKey = newsElement.permalinkKey;

        return hyperlinkModel;
    }
}