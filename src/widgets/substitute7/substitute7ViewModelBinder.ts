import { Substitute7ViewModel } from "./substitute7ViewModel";
import { Substitute7Model } from "./substitute7Model";

export class Substitute7ViewModelBinder {
    public modelToViewModel(model: Substitute7Model): Substitute7ViewModel {
        return new Substitute7ViewModel();

        // viewModel["widgetBinding"] = {
        //     model: model,
        //     editor: "paperbits-substitute7-editor",
        //     applyChanges: () => {
        //         this.modelToViewModel(model, readonly, viewModel);
        //     }
        // }

        // return viewModel;
    }

    public canHandleModel(model: Substitute7Model): boolean {
        return model instanceof Substitute7Model;
    }
}
