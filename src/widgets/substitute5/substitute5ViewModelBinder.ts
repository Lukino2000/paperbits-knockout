import { Substitute5ViewModel } from "./substitute5ViewModel";
import { Substitute5Model } from "./substitute5Model";

export class Substitute5ViewModelBinder {
    public modelToViewModel(model: Substitute5Model): Substitute5ViewModel {
        return new Substitute5ViewModel();

        // viewModel["widgetBinding"] = {
        //     model: model,
        //     editor: "paperbits-substitute5-editor",
        //     applyChanges: () => {
        //         this.modelToViewModel(model, readonly, viewModel);
        //     }
        // }

        // return viewModel;
    }

    public canHandleModel(model: Substitute5Model): boolean {
        return model instanceof Substitute5Model;
    }
}
