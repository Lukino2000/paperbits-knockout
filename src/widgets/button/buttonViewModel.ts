import * as ko from "knockout";
import * as template from "./button.html";
import { ButtonModel } from "@paperbits/common/widgets/models/buttonModel";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";
import { Component } from "../../decorators/component";


@Component({
    selector: "paperbits-button",
    template: template,
    injectable: "button"
})
export class ButtonViewModel {
    public label: KnockoutObservable<string>;
    public css: KnockoutObservable<Object>;
    public hyperlink: KnockoutObservable<HyperlinkModel>;

    constructor() {
        this.label = ko.observable<string>("Button");
        this.css = ko.observable<Object>();
        this.hyperlink = ko.observable<HyperlinkModel>();
    }
}