import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { ContentTableModel } from "@paperbits/common/widgets/content-table/contentTableModel";
import { ContentTableViewModel } from "./contentTableViewModel";

export class ContentTableViewModelBinder implements IViewModelBinder<ContentTableModel, ContentTableViewModel> {
    public modelToViewModel(model: ContentTableModel, readonly: boolean, viewModel?: ContentTableViewModel): ContentTableViewModel {
        if (!viewModel) {
            viewModel = new ContentTableViewModel();
        }

        viewModel.title(model.title);
        viewModel.targetPermalinkKey(model.targetPermalinkKey);
        viewModel.anchors(model.items);

        viewModel["widgetBinding"] = {
            displayName: "Table of contents",
            readonly: readonly,
            model: model,
            applyChanges: () => {
                this.modelToViewModel(model, readonly, viewModel);
            }
        }

        return viewModel;
    }

    public canHandleModel(model: ContentTableModel): boolean {
        return model instanceof ContentTableModel;
    }
}