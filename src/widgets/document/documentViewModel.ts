import * as ko from "knockout";
import * as template from "./document.html";
import * as Utils from "@paperbits/common/core/utils";
import { LayoutModel } from "@paperbits/common/widgets/models/layoutModel";
import { LayoutModelBinder } from "@paperbits/common/widgets/layoutModelBinder";
import { IWidgetModel } from "@paperbits/common/editing/IWidgetModel";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { Component } from "../../decorators/component";
import { LayoutViewModelBinder } from "../layout/layoutViewModelBinder";
import { LayoutViewModel } from "../layout/layoutViewModel";


@Component({
    selector: "paperbits-doc",
    template: template,
    injectable: "docWidget"
})
export class DocumentViewModel {
    private readonly layoutModelBinder: LayoutModelBinder;
    private readonly layoutViewModelBinder: LayoutViewModelBinder;
    private readonly routeHandler: IRouteHandler;
    private readonly viewManager: IViewManager;
    private readonly disposeBag: Utils.IFunctionBag = Utils.createFunctionBag();

    public readonly layoutModel: KnockoutObservable<LayoutViewModel>;
    public readonly working: KnockoutObservable<boolean>;

    public disableTracking: KnockoutObservable<boolean>;

    constructor(layoutModelBinder: LayoutModelBinder, layoutViewModelBinder: LayoutViewModelBinder, routeHandler: IRouteHandler, viewManager: IViewManager) {
        // initialization...
        this.layoutModelBinder = layoutModelBinder;
        this.layoutViewModelBinder = layoutViewModelBinder;
        this.routeHandler = routeHandler;
        this.viewManager = viewManager;

        // rebinding...
        this.refreshContent = this.refreshContent.bind(this);
        this.onRouteChange = this.onRouteChange.bind(this);

        // setting up...
        this.routeHandler.addRouteChangeListener(this.onRouteChange);

        //this.layoutModel = ko.observable<IWidgetModel>();
        this.layoutModel = ko.observable<LayoutViewModel>();
        this.working = ko.observable(true);
        this.disableTracking = ko.observable(false);

        this.refreshContent();
    }

    private async refreshContent(): Promise<void> {
        this.working(true);
        this.layoutModel(null);

        let layoutMode = this.viewManager.getCurrentJourney() == "Layouts";
        let layoutModel = await this.layoutModelBinder.getCurrentLayoutModel();
        let readonly = !layoutMode;
        let layoutViewModel = this.layoutViewModelBinder.modelToViewModel(layoutModel, readonly);

        this.layoutModel(layoutViewModel);

        this.working(false);
        this.disableTracking(!layoutMode)
    }

    private async onRouteChange(): Promise<void> {
        await this.refreshContent();
    }

    public dispose(): void {
        this.routeHandler.removeRouteChangeListener(this.onRouteChange);
    }
}
