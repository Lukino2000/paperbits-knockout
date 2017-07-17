import * as ko from "knockout";
import * as template from "./row.html";
import { RowModel } from "@paperbits/common/widgets/models/rowModel";
import { IWidgetModel } from "@paperbits/common/editing/IWidgetModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { Component } from "../../decorators/component";


@Component({
    selector: "layout-row",
    template: template,
    injectable: "row"
})
export class RowViewModel implements IViewModelBinder {
    public columns: KnockoutObservableArray<IWidgetModel>;
    public css: KnockoutComputed<string>;
    public alignSm: KnockoutObservable<string>;
    public alignMd: KnockoutObservable<string>;
    public alignLg: KnockoutObservable<string>;
    public justifySm: KnockoutObservable<string>;
    public justifyMd: KnockoutObservable<string>;
    public justifyLg: KnockoutObservable<string>;

    constructor() {
        this.columns = ko.observableArray<IWidgetModel>();
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

    public attachToModel(widgetModel: IWidgetModel) {
        let model = <RowModel>widgetModel.model;
        this.alignSm(model.alignSm);
        this.alignMd(model.alignMd);
        this.alignLg(model.alignLg);

        this.justifySm(model.justifySm);
        this.justifyMd(model.justifyMd);
        this.justifyLg(model.justifyLg);

        this.columns(widgetModel.children);
    }
}
