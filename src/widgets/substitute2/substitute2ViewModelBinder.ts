import { Substitute2ViewModel } from "./substitute2ViewModel";
import { Substitute2Model } from "./substitute2Model";

export class Substitute2ViewModelBinder {
    public modelToViewModel(model: Substitute2Model): Substitute2ViewModel {
        return new Substitute2ViewModel();

        // viewModel["widgetBinding"] = {
        //     model: model,
        //     editor: "paperbits-substitute2-editor",
        //     applyChanges: () => {
        //         this.modelToViewModel(model, readonly, viewModel);
        //     }
        // }

        // return viewModel;
    }

    public canHandleModel(model: Substitute2Model): boolean {
        return model instanceof Substitute2Model;
    }
}
