import { TestimonialsViewModel } from "./testimonialsViewModel";
import { TestimonialsModel } from "./testimonialsModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";


export class TestimonialsViewModelBinder implements IViewModelBinder<TestimonialsModel, TestimonialsViewModel>  {
    public modelToViewModel(model: TestimonialsModel, readonly: boolean, viewModel?: TestimonialsViewModel): TestimonialsViewModel {
        if (!viewModel) {
            viewModel = new TestimonialsViewModel();
        }

        viewModel["widgetBinding"] = {
            displayName: "Testimonials",
            model: model,
            editor: "testimonials-editor",
            applyChanges: () => {
                this.modelToViewModel(model, readonly, viewModel);
            }
        }

        return viewModel
    }

    public canHandleModel(model: TestimonialsModel): boolean {
        return model instanceof TestimonialsModel;
    }
}
