import * as ko from "knockout";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";

export class NavbarItemViewModel {
    private readonly routeHandler: IRouteHandler;

    public label: KnockoutObservable<string>;
    public url: KnockoutObservable<string>;
    public isActive: KnockoutObservable<boolean>;
    public nodes: KnockoutObservableArray<NavbarItemViewModel>;

    constructor(routeHandler: IRouteHandler, label: string, url?: string) {
        this.routeHandler = routeHandler;
        this.label = ko.observable<string>(label);
        this.url = ko.observable<string>(url);
        this.isActive = ko.observable<boolean>();
        this.nodes = ko.observableArray<NavbarItemViewModel>();
    }

    public setActive(selectedItem: NavbarItemViewModel) {
        if(selectedItem.url()) {
            this.routeHandler.navigateTo(selectedItem.url());
        }
    }
}
