import { Substitute3ViewModel } from "./substitute3ViewModel";
import { Substitute3Model } from "./substitute3Model";

export class Substitute3ViewModelBinder {
    public modelToViewModel(model: Substitute3Model): Substitute3ViewModel {
        return new Substitute3ViewModel();

        // viewModel["widgetBinding"] = {
        //     model: model,
        //     editor: "paperbits-substitute3-editor",
        //     applyChanges: () => {
        //         this.modelToViewModel(model, readonly, viewModel);
        //     }
        // }

        // return viewModel;
    }

    public canHandleModel(model: Substitute3Model): boolean {
        return model instanceof Substitute3Model;
    }
}
