import * as ko from "knockout";
import { LayoutEditor } from "../editors/layout/layoutEditor";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { PageModelBinder } from "@paperbits/common/widgets/page/pageModelBinder";
import { LayoutModelBinder } from "@paperbits/common/widgets/layout/layoutModelBinder";
import { GridEditor } from "../editors/grid/gridEditor";
import { GridHelper } from "../editors/grid/gridHelper";

export class GridBindingHandler {
    constructor(layoutEditor: LayoutEditor, viewManager: IViewManager, pageModelBinder: PageModelBinder, layoutModelBinder: LayoutModelBinder) {
        ko.bindingHandlers["layout-grid"] = {
            init(gridElement: HTMLElement, valueAccessor) {
                const options = valueAccessor();

                const gridEditor = new GridEditor(viewManager, gridElement.ownerDocument);

                const observer = new MutationObserver(mutations => {
                    let layoutModel = GridHelper.getModel(gridElement);
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

        // ko.bindingHandlers["layoutsection"] = {
        //     init(sectionElement: HTMLElement, valueAccessor) {
        //         // TODO: Attach drag & drop events;
        //     }
        // };

        // ko.bindingHandlers["layoutrow"] = {
        //     init(rowElement: HTMLElement, valueAccessor) {
        //         layoutEditor.applyBindingsToRow(rowElement);
        //     }
        // };

        // ko.bindingHandlers["layoutcolumn"] = {
        //     init(columnElement: HTMLElement, valueAccessor) {
        //         layoutEditor.applyBindingsToColumn(columnElement);
        //     }
        // };
    }
}
