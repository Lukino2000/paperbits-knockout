import * as ko from "knockout";
import { IWidgetEditor } from '@paperbits/common/widgets/IWidgetEditor';
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { ButtonModel } from "@paperbits/common/widgets/models/buttonModel";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";

export class ButtonEditor implements IWidgetEditor {
    private buttonModel: ButtonModel;
    private applyChangesCallback: () => void;

    public readonly label: KnockoutObservable<string>;
    public readonly style: KnockoutObservable<string>;
    public readonly size: KnockoutObservable<string>;
    public readonly hyperlink: KnockoutObservable<HyperlinkModel>;
    public readonly hyperlinkTitle: KnockoutObservable<string>;

    constructor() {
        this.onChange = this.onChange.bind(this);
        this.onHyperlinkChange = this.onHyperlinkChange.bind(this);

        this.label = ko.observable<string>();
        this.label.subscribe(this.onChange);

        this.style = ko.observable<string>();
        this.style.subscribe(this.onChange);

        this.size = ko.observable<string>();
        this.size.subscribe(this.onChange);

        this.hyperlink = ko.observable<HyperlinkModel>();
        this.hyperlink.subscribe(this.onChange);

        this.hyperlinkTitle = ko.observable<string>();
    }

    public onHyperlinkChange(hyperlink: HyperlinkModel): void {
        if (hyperlink) {
            this.hyperlinkTitle(hyperlink.title);
            this.hyperlink(hyperlink);
        }
        else {
            this.hyperlinkTitle("Add a link...");
        }
    }

    private onChange(): void {
        if (!this.applyChangesCallback) {
            return;
        }

        this.buttonModel.label = this.label();
        this.buttonModel.style = this.style();
        this.buttonModel.size = this.size();
        this.buttonModel.hyperlink = this.hyperlink();

        this.applyChangesCallback();
    }

    public setWidgetModel(buttonModel: ButtonModel, applyChangesCallback?: () => void): void {
        this.buttonModel = buttonModel;

        this.label(buttonModel.label);
        this.style(buttonModel.style);
        this.size(buttonModel.size);
        this.hyperlink(buttonModel.hyperlink);
        this.onHyperlinkChange(buttonModel.hyperlink);

        this.applyChangesCallback = applyChangesCallback;
    }
}