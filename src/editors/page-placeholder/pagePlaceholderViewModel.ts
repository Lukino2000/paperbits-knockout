import * as ko from "knockout";
import { IWidgetModel } from "@paperbits/common/editing/IWidgetModel";
import { PageModel } from "@paperbits/common/widgets/models/pageModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";

export class PagePlaceholderViewModel implements IViewModelBinder {
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;

    constructor() {     
        this.title = ko.observable<string>();
        this.description = ko.observable<string>();
    }

    public attachToModel(widgetModel: IWidgetModel) {}
}
