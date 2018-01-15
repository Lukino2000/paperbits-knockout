import * as ko from "knockout";
import template from "./navbarEditor.html";
import { NavbarModel } from "@paperbits/common/widgets/navbar/navbarModel";
import { IWidgetEditor } from "@paperbits/common/widgets/IWidgetEditor";
import { Component } from "../../decorators/component";
import { IViewManager } from "@paperbits/common/ui/IViewManager";


@Component({
    selector: "navbar-editor",
    template: template,
    injectable: "navbarEditor"
})
export class NavbarEditor implements IWidgetEditor {
    private navbarModel: NavbarModel;
    private applyChangesCallback?: () => void;

    public align: KnockoutObservable<string>;

    constructor(private viewManager: IViewManager) {
        this.align = ko.observable<string>();
        this.align.subscribe(this.onChange.bind(this));
    }

    public setWidgetModel(navbarModel: NavbarModel, applyChangesCallback?: () => void): void {
        this.navbarModel = navbarModel;

        if (navbarModel.align) {
            this.align(navbarModel.align);
        }
        else {
            this.align("left");
        }

        this.applyChangesCallback = applyChangesCallback;
    }

    private onChange(): void {
        if (!this.applyChangesCallback) {
            return;
        }

        this.navbarModel.align = this.align();
        this.applyChangesCallback();
    }

    public closeEditor(): void {
        this.viewManager.closeWidgetEditor();
    }
}