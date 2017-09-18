import { IPage } from "@paperbits/common/pages/IPage";
import { IPageService } from "@paperbits/common/pages/IPageService";
import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { IHyperlinkProvider } from "@paperbits/common/ui/IHyperlinkProvider";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";
import { PagePermalinkResolver } from "@paperbits/common/pages/pagePermalinkResolver";
import { PageSelection } from "./pageSelector";

export class PageResourcePicker implements IHyperlinkProvider {
    private readonly pageService: IPageService;
    private readonly pagePermalinkResolver: PagePermalinkResolver;

    public readonly name: string = "Pages";
    public readonly componentName = "page-selector";

    constructor(pageService: IPageService, pagePermalinkResolver: PagePermalinkResolver) {
        this.pageService = pageService;
        this.pagePermalinkResolver = pagePermalinkResolver;
    }

    public canHandleHyperlink(hyperlink: HyperlinkModel): boolean {
        return hyperlink.type === "page" || hyperlink.type === "anchor"
    }

    public getHyperlinkFromLinkable(page: IPage): HyperlinkModel {
        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = page.title;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.permalinkKey = page.permalinkKey;
        hyperlinkModel.type = "page";

        return hyperlinkModel;
    }

    public async getHyperlinkFromPermalink(permalink: IPermalink, target: string): Promise<HyperlinkModel> {
        const page = await this.pageService.getPageByKey(permalink.targetKey);

        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = page.title;
        hyperlinkModel.target = target;
        hyperlinkModel.permalinkKey = permalink.key;
        hyperlinkModel.type = "page";

        return hyperlinkModel;
    }

    public getHyperlinkFromResource(pageSelection: PageSelection): HyperlinkModel {
        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = pageSelection.title;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.permalinkKey = pageSelection.permalinkKey;
        hyperlinkModel.type = "page";

        return hyperlinkModel;
    }
}