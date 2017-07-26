import { ColumnModel } from "@paperbits/common/widgets/models/columnModel";
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

        columnViewModel["attachedWidgetModel"] = {
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