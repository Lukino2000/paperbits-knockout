import * as ko from "knockout";
import template from "./textblockEditor.html";
import { IWidgetEditor } from "@paperbits/common/widgets/IWidgetEditor";
import { IEventManager } from '@paperbits/common/events';
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { TextblockViewModel } from "../../widgets/textblock/textblockViewModel";
import { Component } from "../../decorators/component";


@Component({
    selector: "paperbits-text-editor",
    template: template,
    injectable: "textblockEditor"
})
export class TextblockEditor implements IWidgetEditor {
    private readonly eventManager: IEventManager;
    private readonly viewManager: IViewManager;

    public pluginNames: KnockoutObservableArray<string>;

    constructor(eventManager: IEventManager, viewManager: IViewManager) {
        this.viewManager = viewManager;
        this.eventManager = eventManager;

        // rebinding...
        this.setWidgetModel = this.setWidgetModel.bind(this);

        // setting up...
        this.pluginNames = ko.observableArray<string>();
        this.pluginNames.push("formatting");
        this.pluginNames.push("hyperlink-editor");
    }

    public setWidgetModel(model: TextblockViewModel): void {
        this.eventManager.dispatchEvent("enableHtmlEditor", model.htmlEditor);
    }
}