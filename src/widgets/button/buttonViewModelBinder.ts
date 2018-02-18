import { ButtonModel } from "@paperbits/common/widgets/button/buttonModel";
import { ButtonViewModel } from "./buttonViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";


export class ButtonViewModelBinder implements IViewModelBinder<ButtonModel, ButtonViewModel>  {
    public modelToViewModel(model: ButtonModel, readonly: boolean, viewModel?: ButtonViewModel): ButtonViewModel {
        if (!viewModel) {
            viewModel = new ButtonViewModel();
        }

        viewModel.label(model.label);
        viewModel.hyperlink(model.hyperlink);

        let classes = [];

        switch (model.style) {
            case "default":
                classes.push("btn-default");
                break;

            case "primary":
                classes.push("btn-primary");
                break;

            case "inverted":
                classes.push("btn-inverted");
                break;
        }

        switch (model.size) {
            case "default":
                break;

            case "medium":
                classes.push("btn-medium");
                break;

            case "large":
                classes.push("btn-large");
                break;
        }

        viewModel.css(classes.join(" "));

        viewModel["widgetBinding"] = {
            displayName: "Button",
            model: model,
            editor: "paperbits-button-editor",
            applyChanges: () => {
                this.modelToViewModel(model, readonly, viewModel);
            }
        }

        return viewModel;
    }

    public canHandleModel(model: ButtonModel): boolean {
        return model instanceof ButtonModel;
    }
}