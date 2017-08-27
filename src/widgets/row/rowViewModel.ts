import * as ko from "knockout";
import * as template from "./row.html";
import { Component } from "../../decorators/component";
import { ColumnViewModel } from "../column/columnViewModel";


@Component({
    selector: "layout-row",
    template: template
})
export class RowViewModel {
    public columns: KnockoutObservableArray<ColumnViewModel>;
    public css: KnockoutComputed<string>;
    public alignSm: KnockoutObservable<string>;
    public alignMd: KnockoutObservable<string>;
    public alignLg: KnockoutObservable<string>;
    public justifySm: KnockoutObservable<string>;
    public justifyMd: KnockoutObservable<string>;
    public justifyLg: KnockoutObservable<string>;

    constructor() {
        this.columns = ko.observableArray<ColumnViewModel>();
        this.alignSm = ko.observable<string>();
        this.alignMd = ko.observable<string>();
        this.alignLg = ko.observable<string>();
        this.justifySm = ko.observable<string>();
        this.justifyMd = ko.observable<string>();
        this.justifyLg = ko.observable<string>();

        this.css = ko.computed(() => {
            let css = "";

            if (this.alignSm()) {
                css += " " + this.alignSm() + "-sm";
            }
            if (this.alignMd()) {
                css += " " + this.alignMd() + "-md";
            }
            if (this.alignLg()) {
                css += " " + this.alignLg() + "-lg";
            }
            if (this.justifySm()) {
                css += " " + this.justifySm() + "-sm";
            }
            if (this.justifyMd()) {
                css += " " + this.justifyMd() + "-md";
            }
            if (this.justifyLg()) {
                css += " " + this.justifyLg() + "-lg";
            }

            return css;
        });
    }
}
