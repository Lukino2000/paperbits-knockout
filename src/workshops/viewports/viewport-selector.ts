import * as ko from "knockout";
import * as template from "./viewport-selector.html";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { Component } from "../../decorators/component";


@Component({
    selector: "viewport-selector",
    template: template,
    injectable: "viewportSelector"
})
export class ViewportSelector {
    private readonly viewManager: IViewManager;

    public viewport: KnockoutObservable<string>;

    constructor(viewManager: IViewManager) {
        this.viewManager = viewManager;
        this.viewport = ko.observable<string>("desktop");

        this.viewport(this.viewManager.getViewport());
    }

    public setDesktop(): void {
        this.viewport("desktop");
        this.viewManager.setViewport("desktop");
    }

    public setTablet(): void {
        this.viewport("tablet");
        this.viewManager.setViewport("tablet");
    }

    public setPhone(): void {
        this.viewport("phone");
        this.viewManager.setViewport("phone");
    }

    public zoomOut(): void {
        this.viewport("zoomout");
        this.viewManager.setViewport("zoomout");
    }
}