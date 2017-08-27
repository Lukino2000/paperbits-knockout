import { RowModel } from "@paperbits/common/widgets/row/rowModel";
import { RowViewModel } from "./rowViewModel";
import { IntentionMapService } from "@paperbits/slate/intentionMapService";
import { ColumnViewModelBinder } from "../column/columnViewModelBinder";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";


export class RowViewModelBinder implements IViewModelBinder {
    private readonly columnViewModelBinder: ColumnViewModelBinder;
    private readonly intentionMapService: IntentionMapService;

    constructor(columnViewModelBinder: ColumnViewModelBinder, intentionMapService: IntentionMapService) {
        this.columnViewModelBinder = columnViewModelBinder;
    }

    public modelToViewModel(model: RowModel, readonly: boolean, viewModel?: RowViewModel): RowViewModel {
        if (!viewModel) {
            viewModel = new RowViewModel();
        }

        let columnViewModels = model.columns.map(columnModel => {
            let columnViewModel = this.columnViewModelBinder.modelToViewModel(columnModel, readonly);
            return columnViewModel;
        })

        viewModel.columns(columnViewModels);

        viewModel.alignSm(model.alignSm);
        viewModel.alignMd(model.alignMd);
        viewModel.alignLg(model.alignLg);

        viewModel.justifySm(model.justifySm);
        viewModel.justifyMd(model.justifyMd);
        viewModel.justifyLg(model.justifyLg);

        viewModel["widgetBinding"] = {
            displayName: "Row",
            readonly: readonly,
            model: model,
            applyChanges: () => {
                this.modelToViewModel(model, readonly, viewModel);
            }
        }

        return viewModel;
    }

    public canHandleModel(model: RowModel): boolean {
        return model instanceof RowModel;
    }
}