import { Substitute6ViewModel } from "./substitute6ViewModel";
import { Substitute6Model } from "./substitute6Model";

export class Substitute6ViewModelBinder {
    public modelToViewModel(model: Substitute6Model): Substitute6ViewModel {
        return new Substitute6ViewModel();

        // viewModel["widgetBinding"] = {
        //     model: model,
        //     editor: "paperbits-substitute6-editor",
        //     applyChanges: () => {
        //         this.modelToViewModel(model, readonly, viewModel);
        //     }
        // }

        // return viewModel;
    }

    public canHandleModel(model: Substitute6Model): boolean {
        return model instanceof Substitute6Model;
    }
}
