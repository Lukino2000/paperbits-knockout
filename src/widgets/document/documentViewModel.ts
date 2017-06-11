import * as ko from "knockout";
import * as Utils from "@paperbits/common/core/utils";
import { LayoutModel } from "@paperbits/common/widgets/models/layoutModel";
import { LayoutModelBinder } from "@paperbits/common/widgets/layoutModelBinder";
import { IWidgetModel } from "@paperbits/common/editing/IWidgetModel";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IViewManager } from "@paperbits/common/ui/IViewManager";


export class DocumentViewModel {
    private readonly layoutModelBinder: LayoutModelBinder;
    private readonly routeHandler: IRouteHandler;
    private readonly viewManager: IViewManager;
    private readonly disposeBag: Utils.IFunctionBag = Utils.createFunctionBag();

    public readonly layoutModel: KnockoutObservable<IWidgetModel>;
    public readonly working: KnockoutObservable<boolean>;

    public disableTracking: KnockoutObservable<boolean>;

    constructor(layoutModelBinder: LayoutModelBinder, routeHandler: IRouteHandler, viewManager: IViewManager) {
        // initialization...
        this.layoutModelBinder = layoutModelBinder;
        this.routeHandler = routeHandler;
        this.viewManager = viewManager;

        // rebinding...
        this.refreshContent = this.refreshContent.bind(this);
        this.onRouteChange = this.onRouteChange.bind(this);

        // setting up...
        this.routeHandler.addRouteChangeListener(this.onRouteChange);
        
        this.layoutModel = ko.observable<IWidgetModel>();
        this.working = ko.observable(true);
        this.disableTracking = ko.observable(false);

        this.refreshContent();
    }

    private async refreshContent(): Promise<void> {
        this.working(true);
        this.layoutModel(null);

        let layoutMode = this.viewManager.getCurrentJourney() == "Layouts";
        let layoutWidgetModel = await this.layoutModelBinder.getCurrentLayout(layoutMode);

        this.layoutModel(layoutWidgetModel);

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
