import { NavbarModel } from "@paperbits/common/widgets/navbar/navbarModel";
import { NavbarViewModel } from "./navbarViewModel";
import { NavbarItemViewModel } from "./navbarItemViewModel";
import { NavbarItemModel } from "@paperbits/common/widgets/navbar/navbarItemModel";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { IEventManager } from "@paperbits/common/events/IEventManager";
import { NavigationEvents } from "@paperbits/common/navigation/navigationEvents";
import { NavbarModelBinder } from "@paperbits/common/widgets/navbar/navbarModelBinder";


export class NavbarViewModelBinder implements IViewModelBinder<NavbarModel, NavbarViewModel> {
    private readonly routeHandler: IRouteHandler;
    private readonly eventManager: IEventManager;
    private readonly navbarModelBinder: NavbarModelBinder;

    constructor(routeHandler: IRouteHandler, eventManager: IEventManager, navbarModelBinder: NavbarModelBinder) {
        this.routeHandler = routeHandler;
        this.eventManager = eventManager;
        this.navbarModelBinder = navbarModelBinder;
    }

    private navbarItemModelToNavbarItemViewModel(navbarItemModel: NavbarItemModel): NavbarItemViewModel {
        const label = navbarItemModel.label;
        const navbarItemViewModel = new NavbarItemViewModel(label);

        if (navbarItemModel.nodes.length > 0) {
            const tasks = [];
            const results = navbarItemModel.nodes.map(childNode => this.navbarItemModelToNavbarItemViewModel(childNode));

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

    public modelToViewModel(navbarModel: NavbarModel, readonly: boolean, viewModel?: NavbarViewModel): NavbarViewModel {
        if (!viewModel) {
            viewModel = new NavbarViewModel();
        }

        const navigationRoot = this.navbarItemModelToNavbarItemViewModel(navbarModel.root);

        viewModel.navigationRoot(navigationRoot);
        viewModel.pictureSourceUrl(navbarModel.pictureSourceUrl);

        const applyChanges = () => {
            this.modelToViewModel(navbarModel, readonly, viewModel);
        }

        viewModel["widgetBinding"] = {
            displayName: "Navigation bar",
            readonly: readonly,
            model: navbarModel,
            editor: "navbar-editor",
            applyChanges: applyChanges
        }

        this.eventManager.addEventListener(NavigationEvents.onNavigationItemUpdate, async (updatedRootContract) => {
            // TODO: Think about how to unsubscribe from this event.
            const updatedRootModel = await this.navbarModelBinder.navigationItemToNavbarItemModel(updatedRootContract, this.routeHandler.getCurrentUrl());
            viewModel.navigationRoot(this.navbarItemModelToNavbarItemViewModel(updatedRootModel));
        });

        return viewModel;
    }

    public canHandleModel(model: NavbarModel): boolean {
        return model instanceof NavbarModel;
    }
}