import * as ko from "knockout";
import template from "./hyperlinkSelector.html";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IHyperlinkProvider } from "@paperbits/common/ui/IHyperlinkProvider";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";
import { IHyperlink } from "@paperbits/common/permalinks/IHyperlink";
import { Component } from "../../decorators/component";


@Component({
    selector: "hyperlink-selector",
    template: template,
    injectable: "hyperlinkSelector"
})
export class HyperlinkSelector {
    public readonly selectedResourcePicker: KnockoutObservable<IHyperlinkProvider>;

    constructor(
        private readonly permalinkService: IPermalinkService,
        private readonly resourcePickers: IHyperlinkProvider[],
        private readonly hyperlink: KnockoutObservable<HyperlinkModel>,
        private readonly onHyperlinkChange: (hyperlink: HyperlinkModel) => void) {

        this.permalinkService = permalinkService;
        this.resourcePickers = resourcePickers;
        this.onHyperlinkChange = onHyperlinkChange;

        // rebinding...
        this.updateHyperlinkState = this.updateHyperlinkState.bind(this);
        this.onResourceSelected = this.onResourceSelected.bind(this);
        this.onResourcePickerChange = this.onResourcePickerChange.bind(this);

        // setting up...
        this.hyperlink = ko.observable<HyperlinkModel>(ko.unwrap(hyperlink));
        this.selectedResourcePicker = ko.observable<IHyperlinkProvider>(null);
        this.updateHyperlinkState(hyperlink());
        this.selectedResourcePicker.subscribe(this.onResourcePickerChange);
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
            const permalink = await this.permalinkService.getPermalinkByKey(hyperlink.permalinkKey);
            resourcePicker = this.resourcePickers.find(x => x.canHandleHyperlink(permalink));
        }

        if (!resourcePicker) {
            resourcePicker = this.resourcePickers[this.resourcePickers.length - 1];
        }

        this.hyperlink(hyperlink);
        this.selectedResourcePicker(resourcePicker);
    }
}