import * as ko from "knockout";
import template from "./testimonialsEditor.html";
import { Component } from "../../decorators/component";
import { IWidgetEditor } from "@paperbits/common/widgets/IWidgetEditor";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { TestimonialsModel } from "../../widgets/testimonials/testimonialsModel";


@Component({
    selector: "testimonials-editor",
    template: template,
    injectable: "testimonialsEditor"
})
export class TestimonialsEditor implements IWidgetEditor {
    private section: TestimonialsModel;
    private applyChangesCallback: () => void;

    constructor(
        private readonly viewManager: IViewManager
    ) {
        this.setWidgetModel = this.setWidgetModel.bind(this);
    }

    public setWidgetModel(section: TestimonialsModel, applyChangesCallback?: () => void): void {
    }

    public closeEditor(): void {
        this.viewManager.closeWidgetEditor();
    }
}
