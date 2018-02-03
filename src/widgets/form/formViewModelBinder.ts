import { FormModel } from "@paperbits/common/widgets/form/formModel";
import { FormViewModel } from "./formViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";


export class FormViewModelBinder implements IViewModelBinder {
    public modelToViewModel(model: FormModel, readonly: boolean, viewModel?: FormViewModel): FormViewModel {
        if (!viewModel) {
            viewModel = new FormViewModel();
        }

        viewModel["widgetBinding"] = {
            displayName: "Form",
            model: model,
            applyChanges: () => {
                this.modelToViewModel(model, readonly, viewModel);
            }
        }

        return viewModel;
    }

    public canHandleModel(model: FormModel): boolean {
        return model instanceof FormModel;
    }
}