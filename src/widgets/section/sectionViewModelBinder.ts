import { SectionModel } from "@paperbits/common/widgets/section/sectionModel";
import { SectionViewModel } from "./sectionViewModel";
import { IntentionMapService } from "@paperbits/slate/intentionMapService";
import { RowViewModelBinder } from "../row/rowViewModelBinder";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";

export class SectionViewModelBinder implements IViewModelBinder {
    private readonly rowViewModelBinder: RowViewModelBinder;
    private readonly intentionMapService: IntentionMapService;

    constructor(rowViewModelBinder: RowViewModelBinder, intentionMapService: IntentionMapService) {
        this.rowViewModelBinder = rowViewModelBinder;
        this.intentionMapService = intentionMapService;
    }

    public modelToViewModel(model: SectionModel, readonly: boolean, sectionViewModel?: SectionViewModel): SectionViewModel {
        if (!sectionViewModel) {
            sectionViewModel = new SectionViewModel();
        }

        let rowViewModels = model.rows.map(rowModel => {
            let rowViewModel = this.rowViewModelBinder.modelToViewModel(rowModel, readonly);
            return rowViewModel;
        })

        sectionViewModel.rows(rowViewModels);
        sectionViewModel.layout(model.layout);
        sectionViewModel.background(model.background);

        let sectionClasses = [];
        let backgroundColorKey = model.background.colorKey;
        let intentionMap = <any>this.intentionMapService.getMap();

        // TODO: Review background usage.
        let backgroundIntention = intentionMap.section.background[backgroundColorKey];

        if (!backgroundIntention) {
            backgroundIntention = intentionMap.section.background["section-bg-default"];
        }
        sectionClasses.push(backgroundIntention.styles());

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

        sectionViewModel.css(sectionClasses.join(" "));

        sectionViewModel["widgetBinding"] = {
            readonly: readonly,
            model: model,
            editor: "layout-section-editor",
            applyChanges: () => {
                this.modelToViewModel(model, readonly, sectionViewModel);
            }
        }

        return sectionViewModel;
    }

    public canHandleModel(model: SectionModel): boolean {
        return model instanceof SectionModel;
    }
}