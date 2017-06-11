import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IHyperlinkProvider } from "@paperbits/common/ui/IHyperlinkProvider";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";

export class UrlResourcePicker implements IHyperlinkProvider {
    private readonly permalinkService: IPermalinkService;

    public readonly name = "Web URL";
    public readonly componentName = "url-selector";

    constructor(permalinkService: IPermalinkService) {
        this.permalinkService = permalinkService;
    }

    public canHandleResource(resource: string): boolean {
        return true;
    }

    public getHyperlinkFromResource(url: string): HyperlinkModel {
        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = "External link";
        hyperlinkModel.href = url;
        hyperlinkModel.target = "_blank";

        return hyperlinkModel;
    }

    public getHyperlinkFromUrl?(url: string, target: string = "_blank"): HyperlinkModel {
        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = "External link";
        hyperlinkModel.target = target;
        hyperlinkModel.href = url;

        return hyperlinkModel;
    }

    public getResourceFromHyperlink(hyperlink: HyperlinkModel): string {
        return hyperlink.href;
    }
}