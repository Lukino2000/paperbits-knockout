import * as ko from "knockout";
import * as template from "./navbarTemplate.html";
import { NavbarItemViewModel } from "./../navbar/navbarItemViewModel";
import { NavbarModel } from "@paperbits/common/widgets/models/navbarModel";
import { NavbarItemModel } from "@paperbits/common/widgets/models/navbarItemModel";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { Component } from "../../decorators/component";


@Component({
    selector: "navbar",
    template: template,
    injectable: "navbar"
})
export class NavbarViewModel {
    private readonly routeHandler: IRouteHandler;

    public root: KnockoutObservable<NavbarItemViewModel>;
    public alignRight: KnockoutObservable<boolean>;

    constructor(routeHandler: IRouteHandler) {
        this.routeHandler = routeHandler;
        this.root = ko.observable<NavbarItemViewModel>();
        this.alignRight = ko.observable<boolean>(false);
    }

    public attachToModel(navbarModel: NavbarModel): void {
        let url = this.routeHandler.getCurrentUrl();
        let root = this.navItemModelToNavbarItemViewModel(navbarModel.root);

        this.root(root);
        this.alignRight(navbarModel.align === "right");
    }

    private navItemModelToNavbarItemViewModel(navbarItemModel: NavbarItemModel): NavbarItemViewModel {
        let label = navbarItemModel.label;
        let navbarItemViewModel = new NavbarItemViewModel(this.routeHandler, label);

        if (navbarItemModel.nodes.length > 0) {
            var tasks = [];

            let results = navbarItemModel.nodes.map(childNode => this.navItemModelToNavbarItemViewModel(childNode));

            results.forEach(child => {
                navbarItemViewModel.nodes.push(child);
            });
        }
        else {
            navbarItemViewModel.url(navbarItemModel.url);
            navbarItemViewModel.isActive(navbarItemModel.isActive);
        }

        return navbarItemViewModel;
    }
}