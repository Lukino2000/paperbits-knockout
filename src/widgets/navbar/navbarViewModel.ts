import * as ko from "knockout";
import { NavbarItemViewModel } from "./../navbar/navbarItemViewModel";
import { NavbarModel } from "@paperbits/common/widgets/models/navbarModel";
import { NavbarItemModel } from "@paperbits/common/widgets/models/navbarItemModel";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";

export class NavbarViewModel {
    private readonly routeHandler: IRouteHandler;
    
    public root: KnockoutObservable<NavbarItemViewModel>;
    public alignRight: KnockoutObservable<boolean>;

    constructor(routeHandler: IRouteHandler) {
        this.routeHandler = routeHandler;
        this.root = ko.observable<NavbarItemViewModel>();
        this.alignRight = ko.observable<boolean>(false);
    }

    public async attachToModel(navbarModel: NavbarModel): Promise<void> {        
        let url = this.routeHandler.getCurrentUrl();
        let root = await this.navItemModelToNavbarItemViewModel(navbarModel.root);

        this.root(root);
        this.alignRight(navbarModel.align === "right");
    }

    private async navItemModelToNavbarItemViewModel(navbarItemModel: NavbarItemModel): Promise<NavbarItemViewModel> {
        let label = navbarItemModel.label;
        let navbarItemViewModel = new NavbarItemViewModel(this.routeHandler, label);

        if (navbarItemModel.nodes.length > 0) {
            var tasks = [];

            navbarItemModel.nodes.forEach(childNode => {
                tasks.push(this.navItemModelToNavbarItemViewModel(childNode));
            });

            let results = await Promise.all(tasks);

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