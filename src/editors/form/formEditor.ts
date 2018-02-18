import * as ko from "knockout";
import template from "./formEditor.html";
import { Component } from "../../decorators/component";
import { IWidgetEditor } from "@paperbits/common/widgets/IWidgetEditor";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { FormModel } from "@paperbits/common/widgets/form/formModel";


@Component({
    selector: "form-editor",
    template: template,
    injectable: "formEditor"
})
export class FormEditor implements IWidgetEditor {
    private section: FormModel;
    private applyChangesCallback: () => void;

    constructor(
        private readonly viewManager: IViewManager
    ) {
        this.setWidgetModel = this.setWidgetModel.bind(this);
    }

    public setWidgetModel(section: FormModel, applyChangesCallback?: () => void): void {
    }

    public closeEditor(): void {
        this.viewManager.closeWidgetEditor();
    }
}
