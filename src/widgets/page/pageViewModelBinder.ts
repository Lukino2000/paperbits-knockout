import { PageModel } from "@paperbits/common/widgets/page/pageModel";
import { PageViewModel } from "./pageViewModel";
import { ViewModelBinderSelector } from "../viewModelBinderSelector";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";

export class PageViewModelBinder implements IViewModelBinder {
    private readonly viewModelBinderSelector: ViewModelBinderSelector;

    constructor(viewModelBinderSelector: ViewModelBinderSelector) {
        this.viewModelBinderSelector = viewModelBinderSelector;
    }

    public modelToViewModel(model: PageModel, readonly: boolean, pageViewModel?: PageViewModel): any {
        if (!pageViewModel) {
            pageViewModel = new PageViewModel();
        }

        let widgetViewModels = model.sections
            .map(widgetModel => {
                let widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);

                if (!widgetViewModelBinder) {
                    return null;
                }

                let widgetViewModel = widgetViewModelBinder.modelToViewModel(widgetModel, !readonly);

                return widgetViewModel;
            })
            .filter(x => x != null);

        pageViewModel.sections(widgetViewModels);


        pageViewModel["widgetBinding"] = {
            readonly: readonly,
            model: model,
            applyChanges: () => {
                this.modelToViewModel(model, readonly, pageViewModel);
            }
        }

        return pageViewModel;
    }

    public canHandleModel(model: PageModel): boolean {
        return model instanceof PageModel;
    }
}