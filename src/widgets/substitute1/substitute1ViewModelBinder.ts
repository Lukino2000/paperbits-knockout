import { Substitute1ViewModel } from "./substitute1ViewModel";
import { Substitute1Model } from "./substitute1Model";

export class Substitute1ViewModelBinder {
    public modelToViewModel(model: Substitute1Model): Substitute1ViewModel {
        return new Substitute1ViewModel();

        // viewModel["widgetBinding"] = {
        //     model: model,
        //     editor: "paperbits-substitute1-editor",
        //     applyChanges: () => {
        //         this.modelToViewModel(model, readonly, viewModel);
        //     }
        // }

        // return viewModel;
    }

    public canHandleModel(model: Substitute1Model): boolean {
        return model instanceof Substitute1Model;
    }
}
