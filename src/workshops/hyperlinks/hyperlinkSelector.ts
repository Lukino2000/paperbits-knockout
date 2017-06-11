import * as ko from "knockout";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IHyperlinkProvider } from "@paperbits/common/ui/IHyperlinkProvider";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";
import { IHyperlink } from "@paperbits/common/permalinks/IHyperlink";

export class HyperlinkSelector {
    private readonly permalinkService: IPermalinkService;

    public readonly resourcePickers: IHyperlinkProvider[];
    public readonly onHyperlinkChange: (hyperlink: HyperlinkModel) => void;
    public readonly hyperlink: KnockoutObservable<HyperlinkModel>;
    public readonly selectedResourcePicker: KnockoutObservable<IHyperlinkProvider>;

    constructor(permalinkService: IPermalinkService, resourcePickers: IHyperlinkProvider[], hyperlink: KnockoutObservable<HyperlinkModel>, onHyperlinkChange: (hyperlink: HyperlinkModel) => void) {
        this.permalinkService = permalinkService;
        this.resourcePickers = resourcePickers;
        this.onHyperlinkChange = onHyperlinkChange;

        this.updateHyperlinkState = this.updateHyperlinkState.bind(this);
        this.onResourceSelected = this.onResourceSelected.bind(this);

        this.hyperlink = ko.observable<HyperlinkModel>(ko.unwrap(hyperlink));
        this.selectedResourcePicker = ko.observable<IHyperlinkProvider>(null);

        this.updateHyperlinkState(hyperlink());
        hyperlink.subscribe(this.updateHyperlinkState);
    }

    private onResourcePickerChange(resourcePicker: IHyperlinkProvider): void {
        if (resourcePicker === null) {
            this.hyperlink(null);
            this.onHyperlinkChange(null);
        }
    }

    private onResourceSelected(hyperlink: HyperlinkModel): void {
        this.hyperlink(hyperlink);

        if (this.onHyperlinkChange) {
            this.onHyperlinkChange(hyperlink);
        }
    }

    private async updateHyperlinkState(hyperlink: HyperlinkModel): Promise<void> {
        if (!hyperlink) {
            this.selectedResourcePicker(null);
            this.hyperlink(null);
            return;
        }

        let resourcePicker: IHyperlinkProvider;

        if (hyperlink.permalinkKey) {
            /* TODO: Permalink is extracted second time here. May need to review this. */
            /* Potentially hyperlinkModel may contain type of the resource to easily identify current resource selector component */

            let permalink = await this.permalinkService.getPermalinkByKey(hyperlink.permalinkKey);
            resourcePicker = this.resourcePickers.find(x => x.canHandleResource(permalink.targetKey));
        }
        else if (hyperlink.href) {
            resourcePicker = this.resourcePickers.find(x => x.canHandleResource(hyperlink.href));
        }

        this.hyperlink(hyperlink);
        this.selectedResourcePicker(resourcePicker);
    }
}