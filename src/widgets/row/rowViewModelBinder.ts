import { RowModel } from "@paperbits/common/widgets/row/rowModel";
import { RowViewModel } from "./rowViewModel";
import { IntentionMapService } from "@paperbits/slate/intentionMapService";
import { ColumnViewModelBinder } from "../column/columnViewModelBinder";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { DragSession } from "@paperbits/common/ui/draggables/dragManager";
import { ColumnModel } from "@paperbits/common/widgets/column/columnModel";


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

        const binding = {
            displayName: "Row",
            readonly: readonly,
            model: model,
            applyChanges: () => {
                this.modelToViewModel(model, readonly, viewModel);
            },
            onDragOver: (dragSession: DragSession): boolean => {
                return dragSession.type === "column" || dragSession.type === "widget";
            },
            onDragDrop: (dragSession: DragSession): void => {
                switch (dragSession.type) {
                    case "column":
                        model.columns.splice(dragSession.insertIndex, 0, <ColumnModel>dragSession.sourceModel);
                        break;

                    case "widget":
                        const columnToInsert = new ColumnModel();
                        columnToInsert.sizeMd = 3;
                        columnToInsert.widgets.push(dragSession.sourceModel);
                        model.columns.splice(dragSession.insertIndex, 0, columnToInsert);
                        break;
                }
                binding.applyChanges();
            }
        }

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: RowModel): boolean {
        return model instanceof RowModel;
    }
}