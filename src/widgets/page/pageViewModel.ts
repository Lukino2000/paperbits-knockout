import * as ko from "knockout";
import * as template from "./page.html";
import { IWidgetModel } from "@paperbits/common/editing/IWidgetModel";
import { PageModel } from "@paperbits/common/widgets/models/pageModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { Component } from "../../decorators/component";


@Component({
    selector: "paperbits-page",
    template: template,
    injectable: "pageWidget"
})
export class PageViewModel implements IViewModelBinder {
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public keywords: KnockoutObservable<string>;
    public sections: KnockoutObservableArray<IWidgetModel>;

    constructor() {
        this.title = ko.observable<string>();
        this.description = ko.observable<string>();
        this.keywords = ko.observable<string>();
        this.sections = ko.observableArray<IWidgetModel>();
    }

    public attachToModel(widgetModel: IWidgetModel) {
        let model = <PageModel>widgetModel.model;
        this.title(model.title);
        this.description(model.description);
        this.keywords(model.keywords);

        this.sections(widgetModel.children);
    }
}
