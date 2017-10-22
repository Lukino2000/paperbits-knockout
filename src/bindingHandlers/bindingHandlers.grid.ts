import * as ko from "knockout";
import { IViewManager, ViewManagerMode } from "@paperbits/common/ui/IViewManager";
import { PageModelBinder } from "@paperbits/common/widgets/page/pageModelBinder";
import { LayoutModelBinder } from "@paperbits/common/widgets/layout/layoutModelBinder";
import { GridEditor } from "../editors/grid/gridEditor";
import { GridHelper } from "../editors/grid/gridHelper";
import { IEventManager } from "@paperbits/common/events/IEventManager";
import { RowModel } from "@paperbits/common/widgets/row/rowModel";
import { ColumnModel } from "@paperbits/common/widgets/column/columnModel";


export class GridBindingHandler {
    constructor(viewManager: IViewManager, eventManager: IEventManager, pageModelBinder: PageModelBinder, layoutModelBinder: LayoutModelBinder) {
        ko.bindingHandlers["layout-grid"] = {
            init(gridElement: HTMLElement, valueAccessor) {
                const options = valueAccessor();

                const gridEditor = new GridEditor(<any>viewManager, gridElement.ownerDocument, eventManager);

                const observer = new MutationObserver(mutations => {
                    if (viewManager.mode === ViewManagerMode.fold) {
                        return;
                    }

                    const layoutModel = GridHelper.getModel(gridElement);
                    layoutModelBinder.updateContent(layoutModel);
                });

                observer.observe(gridElement, {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: true
                });

                ko.utils.domNodeDisposal.addDisposeCallback(gridElement, () => {
                    gridEditor.detach();
                    observer.disconnect();
                });

                gridEditor.attach();
            }
        }

        ko.bindingHandlers["content-grid"] = {
            init(gridElement: HTMLElement, valueAccessor) {
                var observer = new MutationObserver(mutations => {
                    if (viewManager.mode === ViewManagerMode.fold) {
                        return;
                    }

                    let model = GridHelper.getModel(gridElement);
                    pageModelBinder.updateContent(model);
                });

                observer.observe(gridElement, {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: true
                });

                ko.utils.domNodeDisposal.addDisposeCallback(gridElement, () => {
                    observer.disconnect();
                });
            }
        }

        ko.bindingHandlers["layoutsection"] = {
            init(sourceElement: HTMLElement, valueAccessor) {
                GridEditor.attachSectionDragEvents(sourceElement, viewManager, eventManager);
            }
        }

        ko.bindingHandlers["layoutcolumn"] = {
            init(sourceElement: HTMLElement, valueAccessor) {
                GridEditor.attachColumnDragEvents(sourceElement, viewManager, eventManager);
            }
        };
    }
}
