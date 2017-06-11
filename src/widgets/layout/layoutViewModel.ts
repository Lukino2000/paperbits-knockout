import * as ko from "knockout";
import { LayoutModel } from "@paperbits/common/widgets/models/layoutModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { IWidgetModel } from "@paperbits/common/editing/IWidgetModel";


export class LayoutViewModel implements IViewModelBinder {
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public uriTemplate: KnockoutObservable<string>;
    public widgets: KnockoutObservableArray<IWidgetModel>;

    constructor() {
        this.widgets = ko.observableArray<IWidgetModel>();
        this.title = ko.observable<string>();
        this.description = ko.observable<string>();
        this.uriTemplate = ko.observable<string>();
    }

    public attachToModel(widgetModel: IWidgetModel): void {
        let model = <LayoutModel>widgetModel.model;
        this.title(model.title);
        this.description(model.description);
        this.uriTemplate(model.uriTemplate);

        this.widgets(widgetModel.children);
    }
}