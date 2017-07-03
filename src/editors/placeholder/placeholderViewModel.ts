import * as ko from "knockout";
import * as template from "./placeholder.html";
import { IWidgetModel } from "@paperbits/common/editing/IWidgetModel";
import { PageModel } from "@paperbits/common/widgets/models/pageModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { Component } from "../../decorators/component";


@Component({
    selector: "paperbits-placeholder",
    template: template,
    injectable: "placeholderWidget",
})
export class PlaceholderViewModel implements IViewModelBinder {
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;

    constructor() {
        this.title = ko.observable<string>();
        this.description = ko.observable<string>();
    }

    public attachToModel(widgetModel: IWidgetModel) { }
}
