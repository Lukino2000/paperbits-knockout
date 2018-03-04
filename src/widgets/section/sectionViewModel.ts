import * as ko from "knockout";
import template from "./section.html";
import { RowViewModel } from "./../row/rowViewModel";
import { Component } from "../../decorators/component";
import { BackgroundModel } from "@paperbits/common/widgets/background/backgroundModel";

@Component({
    selector: "layout-section",
    template: template
})
export class SectionViewModel {
    public rows: KnockoutObservableArray<RowViewModel>;
    public containerCss: KnockoutObservable<string>;
    public sectionCss: KnockoutObservable<string>;
    public snapTo: KnockoutObservable<string>;
    public background: KnockoutObservable<BackgroundModel>;

    constructor() {
        this.rows = ko.observableArray<RowViewModel>();
        this.containerCss = ko.observable<string>();
        this.sectionCss = ko.observable<string>();
        this.snapTo = ko.observable<string>();
        this.background = ko.observable<BackgroundModel>();
    }
}