import { Substitute4ViewModel } from "./substitute4ViewModel";
import { Substitute4Model } from "./substitute4Model";

export class Substitute4ViewModelBinder {
    public modelToViewModel(model: Substitute4Model): Substitute4ViewModel {
        return new Substitute4ViewModel();

        // viewModel["widgetBinding"] = {
        //     model: model,
        //     editor: "paperbits-substitute4-editor",
        //     applyChanges: () => {
        //         this.modelToViewModel(model, readonly, viewModel);
        //     }
        // }

        // return viewModel;
    }

    public canHandleModel(model: Substitute4Model): boolean {
        return model instanceof Substitute4Model;
    }
}
