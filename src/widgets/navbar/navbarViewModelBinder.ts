import { NavbarModel } from "@paperbits/common/widgets/navbar/navbarModel";
import { NavbarViewModel } from "./navbarViewModel";
import { NavbarItemViewModel } from "./navbarItemViewModel";
import { NavbarItemModel } from "@paperbits/common/widgets/navbar/navbarItemModel";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { IEventManager } from "@paperbits/common/events/IEventManager";
import { NavigationEvents } from "@paperbits/common/navigation/navigationEvents";
import { NavbarModelBinder } from "@paperbits/common/widgets/navbar/navbarModelBinder";


export class NavbarViewModelBinder implements IViewModelBinder {
    private readonly routeHandler: IRouteHandler;
    private readonly eventManager: IEventManager;
    private readonly navbarModelBinder: NavbarModelBinder;

    constructor(routeHandler: IRouteHandler, eventManager: IEventManager, navbarModelBinder: NavbarModelBinder) {
        this.routeHandler = routeHandler;
        this.eventManager = eventManager;
        this.navbarModelBinder = navbarModelBinder;
    }

    private navbarItemModelToNavbarItemViewModel(navbarItemModel: NavbarItemModel): NavbarItemViewModel {
        let label = navbarItemModel.label;
        let navbarItemViewModel = new NavbarItemViewModel(this.routeHandler, label);

        if (navbarItemModel.nodes.length > 0) {
            var tasks = [];

            let results = navbarItemModel.nodes.map(childNode => this.navbarItemModelToNavbarItemViewModel(childNode));

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

    public modelToViewModel(model: NavbarModel, readonly: boolean, viewModel?: NavbarViewModel): NavbarViewModel {
        if (!viewModel) {
            viewModel = new NavbarViewModel();
        }

        let url = this.routeHandler.getCurrentUrl();
        let root = this.navbarItemModelToNavbarItemViewModel(model.root);

        viewModel.root(root);
        viewModel.alignRight(model.align === "right");

        const applyChanges = () => {
            this.modelToViewModel(model, readonly, viewModel);
        }

        viewModel["widgetBinding"] = {
            readonly: readonly,
            model: model,
            applyChanges: applyChanges
        }

        this.eventManager.addEventListener(NavigationEvents.onNavigationItemUpdate, async (updatedRootContract) => {
            // TODO: Think about how to unsubscribe from this event.
            const updatedRootModel = await this.navbarModelBinder.navigationItemToNavbarItemModel(updatedRootContract, this.routeHandler.getCurrentUrl());
            viewModel.root(this.navbarItemModelToNavbarItemViewModel(updatedRootModel));
        });

        return viewModel;
    }

    public canHandleModel(model: NavbarModel): boolean {
        return model instanceof NavbarModel;
    }
}