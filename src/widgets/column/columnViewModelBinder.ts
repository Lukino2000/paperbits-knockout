import { ColumnModel } from "@paperbits/common/widgets/column/columnModel";
import { ColumnViewModel } from "./columnViewModel";
import { ViewModelBinderSelector } from "../viewModelBinderSelector";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";


export class ColumnViewModelBinder implements IViewModelBinder {
    private readonly viewModelBinderSelector: ViewModelBinderSelector;

    constructor(viewModelBinderSelector: ViewModelBinderSelector) {
        this.viewModelBinderSelector = viewModelBinderSelector;
    }

    public modelToViewModel(model: ColumnModel, readonly: boolean, columnViewModel?: ColumnViewModel): ColumnViewModel {
        if (!columnViewModel) {
            columnViewModel = new ColumnViewModel();
        }

        let widgetViewModels = model.widgets
            .map(widgetModel => {
                let widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);

                if (!widgetViewModelBinder) {
                    return null;
                }

                let widgetViewModel = widgetViewModelBinder.modelToViewModel(widgetModel, readonly);

                return widgetViewModel;
            })
            .filter(x => x != null);

        columnViewModel.widgets(widgetViewModels);
        columnViewModel.sizeSm(model.sizeSm);
        columnViewModel.sizeMd(model.sizeMd);
        columnViewModel.sizeLg(model.sizeLg);
        columnViewModel.sizeXl(model.sizeXl);

        if (model.alignmentXs) {
            columnViewModel.alignmentXs(model.alignmentXs);
        }
        else {
            columnViewModel.alignmentXs("middle center");
        }

        if (model.alignmentSm) {
            columnViewModel.alignmentSm(model.alignmentSm);
        }
        else {
            columnViewModel.alignmentSm("middle center");
        }

        if (model.alignmentMd) {
            columnViewModel.alignmentMd(model.alignmentMd);
        }
        else {
            columnViewModel.alignmentMd("middle center");
        }

        if (model.alignmentLg) {
            columnViewModel.alignmentLg(model.alignmentLg);
        }
        else {
            columnViewModel.alignmentLg("middle center");
        }

        if (model.alignmentXl) {
            columnViewModel.alignmentXl(model.alignmentXl);
        }
        else {
            columnViewModel.alignmentXl("middle center");
        }

        columnViewModel.orderXs(model.orderXs);
        columnViewModel.orderSm(model.orderSm);
        columnViewModel.orderMd(model.orderMd);
        columnViewModel.orderLg(model.orderLg);
        columnViewModel.orderXl(model.orderXl);

        columnViewModel["widgetBinding"] = {
            displayName: "Column",
            readonly: readonly,
            model: model,
            editor: "layout-column-editor",
            applyChanges: () => {
                this.modelToViewModel(model, readonly, columnViewModel);
            }
        }

        return columnViewModel;
    }

    public canHandleModel(model: ColumnModel): boolean {
        return model instanceof ColumnModel;
    }
}