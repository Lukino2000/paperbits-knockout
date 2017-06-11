import * as ko from "knockout";
import { TextblockModel } from "@paperbits/common/widgets/models/textblockModel";
import { IWidgetModel } from "@paperbits/common/editing/IWidgetModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { IHtmlEditor } from '@paperbits/common/editing/IHtmlEditor';


export class TextblockViewModel implements IViewModelBinder {
    public readonly htmlEditor;
    public readonly state: KnockoutObservable<Object>;

    public readonly: KnockoutObservable<boolean>;

    constructor(htmlEditor) {
        this.htmlEditor = htmlEditor;
        this.state = ko.observable();
        this.readonly = ko.observable(false);
    }

    public attachToModel(widgetModel: IWidgetModel) {
        let model = <TextblockModel>widgetModel.model;

        model.htmlEditor = this.htmlEditor;

        this.state(model.state);
        this.readonly(!!widgetModel.readonly);
    }
}
