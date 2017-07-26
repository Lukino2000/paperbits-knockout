import { NavbarModel } from "@paperbits/common/widgets/models/navbarModel";
import { NavbarViewModel } from "./navbarViewModel";
import { NavbarItemViewModel } from "./navbarItemViewModel";
import { NavbarItemModel } from "@paperbits/common/widgets/models/navbarItemModel";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";


export class NavbarViewModelBinder implements IViewModelBinder {
    private readonly routeHandler: IRouteHandler;

    constructor(routeHandler: IRouteHandler) {
        this.routeHandler = routeHandler;
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

    public modelToViewModel(model: NavbarModel, readonly: boolean, viewModel?: NavbarViewModel): NavbarViewModel {
        if (!viewModel) {
            viewModel = new NavbarViewModel();
        }

        let url = this.routeHandler.getCurrentUrl();
        let root = this.navItemModelToNavbarItemViewModel(model.root);

        viewModel.root(root);
        viewModel.alignRight(model.align === "right");

        viewModel["attachedWidgetModel"] = {
            readonly: readonly,
            model: model,
            editor: "paperbits-button-editor",
            applyChanges: () => {
                this.modelToViewModel(model, readonly, viewModel);
            }
        }

        return viewModel;
    }

    public canHandleModel(model: NavbarModel): boolean {
        return model instanceof NavbarModel;
    }
}