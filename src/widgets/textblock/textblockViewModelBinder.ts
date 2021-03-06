import { TextblockModel } from "@paperbits/common/widgets/textblock/textblockModel";
import { TextblockViewModel } from "./textblockViewModel";
import { IHtmlEditor } from "@paperbits/common/editing/IHtmlEditor";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";


export class TextblockViewModelBinder implements IViewModelBinder<TextblockModel, TextblockViewModel> {
    private readonly htmlEditorFactory;

    constructor(htmlEditorFactory) {
        this.htmlEditorFactory = htmlEditorFactory;
    }

    public modelToViewModel(model: TextblockModel, readonly: boolean, viewModel?: TextblockViewModel): TextblockViewModel {
        if (!viewModel) {
            viewModel = new TextblockViewModel(this.htmlEditorFactory.createHtmlEditor());
        }

        model.htmlEditor = viewModel.htmlEditor;

        viewModel.state(model.state);
        // textblockViewModel.readonly(!!model.readonly);

        viewModel["widgetBinding"] = {
            displayName: "Text",
            readonly: readonly,
            model: model,
            flow: "liquid",
            editor: "paperbits-text-editor",
            editorResize: "horizontally",
            applyChanges: () => {
                this.modelToViewModel(model, readonly, viewModel);
            }
        }

        return viewModel;
    }

    public canHandleModel(model: TextblockModel): boolean {
        return model instanceof TextblockModel;
    }
}