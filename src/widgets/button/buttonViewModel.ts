import * as ko from "knockout";
import { ButtonModel } from "@paperbits/common/widgets/models/buttonModel";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";


export class ButtonViewModel {
    public label: KnockoutObservable<string>;
    public css: KnockoutObservable<Object>;
    public hyperlink: KnockoutObservable<HyperlinkModel>;

    constructor() {
        this.label = ko.observable<string>("Button");
        this.css = ko.observable<Object>();
        this.hyperlink = ko.observable<HyperlinkModel>();
    }

    public attachToModel(model: ButtonModel) {
        this.label(model.label);
        this.hyperlink(model.hyperlink);

        let classes = [];

        switch (model.style) {
            case "default":
                classes.push("btn-default");
                break;

            case "primary":
                classes.push("btn-primary");
                break;

            case "inverted":
                classes.push("btn-inverted");
                break;
        }

        switch (model.size) {
            case "default":
                break;

            case "medium":
                classes.push("btn-medium");
                break;

            case "large":
                classes.push("btn-large");
                break;
        }

        this.css(classes.join(" "));
    }
}