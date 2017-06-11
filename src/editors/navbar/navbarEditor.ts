import * as ko from "knockout";
import { NavbarModel } from "@paperbits/common/widgets/models/navbarModel";
import { IWidgetEditor } from "@paperbits/common/widgets/IWidgetEditor";

export class NavbarEditor implements IWidgetEditor {
    private navbarModel: NavbarModel;
    private applyChangesCallback?: () => void;

    public align: KnockoutObservable<string>;

    constructor() {
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
}