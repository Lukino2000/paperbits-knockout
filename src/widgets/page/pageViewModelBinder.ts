import { PageModel } from "@paperbits/common/widgets/page/pageModel";
import { PageViewModel } from "./pageViewModel";
import { ViewModelBinderSelector } from "../viewModelBinderSelector";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { SectionModel } from "@paperbits/common/widgets/section/sectionModel";
import { DragSession } from "@paperbits/common/ui/draggables/dragSession";


export class PageViewModelBinder implements IViewModelBinder<PageModel, PageViewModel> {
    private readonly viewModelBinderSelector: ViewModelBinderSelector;

    constructor(viewModelBinderSelector: ViewModelBinderSelector) {
        this.viewModelBinderSelector = viewModelBinderSelector;
    }

    public modelToViewModel(model: PageModel, readonly: boolean, pageViewModel?: PageViewModel): any {
        if (!pageViewModel) {
            pageViewModel = new PageViewModel();
        }

        const widgetViewModels = model.sections
            .map(widgetModel => {
                const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);

                if (!widgetViewModelBinder) {
                    return null;
                }

                let widgetViewModel = widgetViewModelBinder.modelToViewModel(widgetModel, !readonly);

                return widgetViewModel;
            })
            .filter(x => x != null);

        pageViewModel.sections(widgetViewModels);

        const binding = {
            readonly: readonly,
            model: model,
            applyChanges: () => {
                this.modelToViewModel(model, readonly, pageViewModel);
            },
            onDragOver: (dragSession: DragSession): boolean => {
                return dragSession.type === "section";
            },
            onDragDrop: (dragSession: DragSession): void => {
                switch (dragSession.type) {
                    case "section":
                        model.sections.splice(dragSession.insertIndex, 0, <SectionModel>dragSession.sourceModel);
                        break;
                }
                binding.applyChanges();
            }
        }

        pageViewModel["widgetBinding"] = binding;

        return pageViewModel;
    }

    public canHandleModel(model: PageModel): boolean {
        return model instanceof PageModel;
    }
}