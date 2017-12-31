import { SectionModel } from "@paperbits/common/widgets/section/sectionModel";
import { SectionViewModel } from "./sectionViewModel";
import { RowViewModelBinder } from "../row/rowViewModelBinder";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { DragSession } from "@paperbits/common/ui/draggables/dragManager";
import { IAppIntentionsProvider } from "../../application/interface";


export class SectionViewModelBinder implements IViewModelBinder {
    private readonly rowViewModelBinder: RowViewModelBinder;
    private readonly intentionsProvider: IAppIntentionsProvider;

    constructor(rowViewModelBinder: RowViewModelBinder, intentionsProvider: IAppIntentionsProvider) {
        this.rowViewModelBinder = rowViewModelBinder;
        this.intentionsProvider = intentionsProvider;
    }

    public modelToViewModel(model: SectionModel, readonly: boolean, existingViewModel?: SectionViewModel): SectionViewModel {
        if (!existingViewModel) {
            existingViewModel = new SectionViewModel();
        }

        const rowViewModels = model.rows.map(rowModel => {
            let rowViewModel = this.rowViewModelBinder.modelToViewModel(rowModel, readonly);
            return rowViewModel;
        })

        existingViewModel.rows(rowViewModels);
        existingViewModel.layout(model.layout);
        existingViewModel.background(model.background);

        const sectionClasses = [];

        /*
            TODO: What we do here is, in fact, converting intentions to classes.
            Most of the Box styling can be defined through universal intentions, e.g. background.
        */

        if (model.background) {
            let backgroundColorKey = model.background.colorKey;
            let intentions = this.intentionsProvider.getIntentions();

            // TODO: Review background usage.
            let backgroundIntention = intentions.container.background[backgroundColorKey];
``
            if (!backgroundIntention) {
                backgroundIntention = intentions.container.background.section_bg_default;
            }
            sectionClasses.push(backgroundIntention.styles());
        }

        
        if (model.padding === "with-padding") {
            sectionClasses.push("with-padding");
        }

        switch (model.snap) {
            case "none":
                // Do nothing
                break;
            case "top":
                sectionClasses.push("sticky-top");
                break;
            case "bottom":
                sectionClasses.push("sticky-bottom");
                break;
            default:
                throw `Unkown snap value "${model.snap}".`;
        }

        existingViewModel.css(sectionClasses.join(" "));

        const binding = {
            displayName: "Section",
            readonly: readonly,
            model: model,
            flow: "liquid",
            editor: "layout-section-editor",
            applyChanges: () => {
                this.modelToViewModel(model, readonly, existingViewModel);
            }
        }

        existingViewModel["widgetBinding"] = binding;

        return existingViewModel;
    }

    public canHandleModel(model: SectionModel): boolean {
        return model instanceof SectionModel;
    }
}