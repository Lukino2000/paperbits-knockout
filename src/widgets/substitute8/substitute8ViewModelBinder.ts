import { Substitute8ViewModel } from "./substitute8ViewModel";
import { Substitute8Model } from "./substitute8Model";

export class Substitute8ViewModelBinder {
    public modelToViewModel(model: Substitute8Model): Substitute8ViewModel {
        return new Substitute8ViewModel();

        // viewModel["widgetBinding"] = {
        //     model: model,
        //     editor: "paperbits-substitute8-editor",
        //     applyChanges: () => {
        //         this.modelToViewModel(model, readonly, viewModel);
        //     }
        // }

        // return viewModel;
    }

    public canHandleModel(model: Substitute8Model): boolean {
        return model instanceof Substitute8Model;
    }
}
