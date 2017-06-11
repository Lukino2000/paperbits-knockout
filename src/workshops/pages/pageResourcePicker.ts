import { IPage } from "@paperbits/common/pages/IPage";
import { IPageService } from "@paperbits/common/pages/IPageService";
import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { IHyperlinkProvider } from "@paperbits/common/ui/IHyperlinkProvider";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";
import { PagePermalinkResolver } from "@paperbits/common/pages/pagePermalinkResolver";

export class PageResourcePicker implements IHyperlinkProvider {
    private readonly pageService: IPageService;
    private readonly pagePermalinkResolver: PagePermalinkResolver;

    public readonly name: string = "Pages";
    public readonly componentName = "page-selector";

    constructor(pageService: IPageService, pagePermalinkResolver: PagePermalinkResolver) {
        this.pageService = pageService;
        this.pagePermalinkResolver = pagePermalinkResolver;
    }

    public canHandleResource(resource: string): boolean {
        return resource.startsWith("pages/");
    }

    public getHyperlinkFromLinkable(page: IPage): HyperlinkModel {
        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = page.title;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.permalinkKey = page.permalinkKey;

        return hyperlinkModel;
    }

    public async getHyperlinkFromPermalink(permalink: IPermalink, target: string): Promise<HyperlinkModel> {
        // return await this.pagePermalinkResolver.getHyperlinkFromConfig();

        let page = await this.pageService.getPageByKey(permalink.targetKey);

        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = page.title;
        hyperlinkModel.target = target;
        hyperlinkModel.permalinkKey = permalink.key;

        return hyperlinkModel;
    }

    public getHyperlinkFromResource(page: IPage): HyperlinkModel {
        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = page.title;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.permalinkKey = page.permalinkKey;

        return hyperlinkModel;
    }
}