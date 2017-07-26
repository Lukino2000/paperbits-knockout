import { SectionModel } from "@paperbits/common/widgets/models/sectionModel";
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
        sectionViewModel.backgroundType(model.backgroundType);
        sectionViewModel.backgroundPictureUrl(model.backgroundPictureUrl);
        sectionViewModel.backgroundSize(model.backgroundSize);
        sectionViewModel.backgroundPosition(model.backgroundPosition);

        let sectionClasses = [];
        let backgroundIntentionKey = model.backgroundIntentionKey;
        let intentionMap = <any>this.intentionMapService.getMap();
        let backgroundIntention = intentionMap.section.background[backgroundIntentionKey];

        if (!backgroundIntention) {
            backgroundIntention = intentionMap.section.background["section-bg-default"];
        }
        sectionClasses.push(backgroundIntention.styles());

        if (model.padding === "with-padding") {
            sectionClasses.push("with-padding");
        }

        switch (model.snap) {
            case "none":
                sectionViewModel.snapTo(null);
                break;
            case "top":
                sectionViewModel.snapTo("top");
                break;
            case "bottom":
                sectionViewModel.snapTo("bottom");
                break;
            default:
                throw `Unkown snap value "${model.snap}".`;
        }

        sectionViewModel.css(sectionClasses.join(" "));

        sectionViewModel["attachedWidgetModel"] = {
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