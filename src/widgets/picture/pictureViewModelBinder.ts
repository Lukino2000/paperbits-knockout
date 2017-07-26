import { PictureModel } from "@paperbits/common/widgets/models/pictureModel";
import { PictureViewModel } from "./pictureViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";

export class PictureViewModelBinder implements IViewModelBinder {
    public modelToViewModel(model: PictureModel, readonly: boolean, viewModel?: PictureViewModel): PictureViewModel {
        if (!viewModel) {
            viewModel = new PictureViewModel();
        }

        viewModel.caption(model.caption);
        viewModel.layout(model.layout);
        viewModel.animation(model.animation);
        viewModel.sourceUrl(model.sourceUrl);

        viewModel["attachedWidgetModel"] = {
            readonly: readonly,
            model: model,
            editor: "paperbits-picture-editor",
            applyChanges: () => {
                this.modelToViewModel(model, readonly, viewModel);
            }
        }

        return viewModel;
    }

    public canHandleModel(model: PictureModel): boolean {
        return model instanceof PictureModel;
    }
}