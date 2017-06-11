import * as ko from "knockout";
import { ColumnModel } from "@paperbits/common/widgets/models/columnModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { IWidgetModel } from "@paperbits/common/editing/IWidgetModel";


export class ColumnViewModel implements IViewModelBinder {
    public widgets: KnockoutObservableArray<IWidgetModel>;
    public css: KnockoutComputed<string>;
    public sizeSm: KnockoutObservable<number>;
    public sizeMd: KnockoutObservable<number>;
    public sizeLg: KnockoutObservable<number>;
    public alignmentSm: KnockoutObservable<string>;
    public alignmentMd: KnockoutObservable<string>;
    public alignmentLg: KnockoutObservable<string>;
    public align: KnockoutObservable<string>;

    constructor() {
        this.widgets = ko.observableArray<IWidgetModel>();
        this.sizeSm = ko.observable<number>();
        this.sizeMd = ko.observable<number>();
        this.sizeLg = ko.observable<number>();

        this.alignmentSm = ko.observable<string>();
        this.alignmentMd = ko.observable<string>();
        this.alignmentLg = ko.observable<string>();
        this.align = ko.observable<string>();

        this.css = ko.computed(() => {
            let classes = [];

            if (this.sizeSm()) {
                classes.push("col-sm-" + this.sizeSm());
            }

            if (this.sizeMd()) {
                classes.push("col-md-" + this.sizeMd());
            }

            if (this.sizeLg()) {
                classes.push("col-lg-" + this.sizeLg());
            }

            if (this.alignmentSm()) {
                classes.push(this.getClass(this.alignmentSm(), "xs"));
            }

            if (this.alignmentMd()) {
                classes.push(this.getClass(this.alignmentMd(), "md"));
            }

            /* 
                TODO: There are more breakpoints then form factors, so we need to comeup with something here.
            */
            classes.push(this.getClass("middle center", "sm"));

            if (this.alignmentLg()) {
                classes.push(this.getClass(this.alignmentLg(), "xl"));
                classes.push(this.getClass(this.alignmentLg(), "lg"));
            }

            return classes.join(" ");
        });
    }

    private getClass(alignmentString: string, targetSize: string): string {
        let alignment = alignmentString.split(" ");
        let vertical = alignment[0];
        let horizontal = alignment[1];

        switch (vertical) {
            case "top":
                vertical = "start";
                break;
            case "middle":
                vertical = "center";
                break;
            case "bottom":
                vertical = "end";
                break;
            case "around":
                vertical = "around";
                break;
            case "between":
                vertical = "between";
                break;
            default:
                throw `Unknown vertical metric "${vertical}".`;
        }

        switch (horizontal) {
            case "start":
                horizontal = "start";
                break;
            case "center":
                horizontal = "center";
                break;
            case "end":
                horizontal = "end";
                break;
            case "around":
                horizontal = "around";
                break;
            case "between":
                horizontal = "between";
                break;
            default:
                throw `Unknown horizontal metric "${horizontal}."`;
        }

        return `align-content-${targetSize}-${vertical} justify-content-${targetSize}-${horizontal}`;
    }

    public attachToModel(widgetModel: IWidgetModel) {
        let model = <ColumnModel>widgetModel.model;
        this.sizeSm(model.sizeSm);
        this.sizeMd(model.sizeMd);
        this.sizeLg(model.sizeLg);

        if (model.alignmentSm) {
            this.alignmentSm(model.alignmentSm);
        }
        else {
            this.alignmentSm("middle center");
        }

        if (model.alignmentMd) {
            this.alignmentMd(model.alignmentMd);
        }
        else {
            this.alignmentMd("middle center");
        }

        if (model.alignmentLg) {
            this.alignmentLg(model.alignmentLg);
        }
        else {
            this.alignmentLg("middle center");
        }

        this.widgets(widgetModel.children);
    }
}