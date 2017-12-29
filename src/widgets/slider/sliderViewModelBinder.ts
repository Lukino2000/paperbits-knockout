import { SliderModel } from "@paperbits/common/widgets/slider/sliderModel";
import { SliderViewModel } from "./sliderViewModel";
import { SlideViewModel } from "./slideViewModel";
import { RowViewModelBinder } from "../row/rowViewModelBinder";
import { IAppIntentionsProvider } from "../../application/interface";


export class SliderViewModelBinder {
    private readonly rowViewModelBinder: RowViewModelBinder;
    private readonly intentionsProvider: IAppIntentionsProvider;

    constructor(rowViewModelBinder: RowViewModelBinder, intentionsProvider: IAppIntentionsProvider) {
        this.rowViewModelBinder = rowViewModelBinder;
        this.intentionsProvider = intentionsProvider;
    }

    public modelToViewModel(model: SliderModel, readonly: boolean, viewModel?: SliderViewModel): SliderViewModel {
        if (!viewModel) {
            viewModel = new SliderViewModel();
        }

        let classes = [];

        switch (model.size) {
            case "small":
                classes.push("carousel carousel-short");
                break;

            case "medium":
                classes.push("carousel");
                break;

            case "large":
                classes.push("carousel carousel-tall");
                break;
        }
        
        viewModel.css(classes.join(" "));
        viewModel.style(model.style);

        if (viewModel.slides) {
            viewModel.slides(model.slides.map(slideModel => {
                let rowViewModels = slideModel.rows.map(rowModel => {
                    return this.rowViewModelBinder.modelToViewModel(rowModel, readonly);
                })

                let slideViewModel = new SlideViewModel();

                slideViewModel.rows(rowViewModels);
                slideViewModel.layout(slideModel.layout);
                slideViewModel.background(slideModel.background);
                slideViewModel.thumbnail(slideModel.thumbnail);

                let classes = [];
                let backgroundColorKey = slideModel.background.colorKey;
                let intentionMap = this.intentionsProvider.getIntentions();
                let backgroundIntention = intentionMap.container.background[backgroundColorKey];

                if (!backgroundIntention) {
                    backgroundIntention = intentionMap.container.background.section_bg_default;
                }
                classes.push(backgroundIntention.styles());

                if (slideModel.padding === "with-padding") {
                    classes.push(slideModel.padding);
                }
                slideViewModel.layout(slideModel.layout);
                slideViewModel.css(classes.join(" "));

                slideViewModel["widgetBinding"] = {
                    model: slideModel,
                    applyChanges: () => {
                    }
                }

                viewModel.activeSlideNumber(model.activeSlideNumber);

                return slideViewModel;
            }));
        }

        viewModel["widgetBinding"] = {
            displayName: "Slider",
            model: model,
            editor: "paperbits-slider-editor",
            applyChanges: () => {
                this.modelToViewModel(model, readonly, viewModel);
            }
        }

        return viewModel;
    }

    public canHandleModel(model: SliderModel): boolean {
        return model instanceof SliderModel;
    }
}
