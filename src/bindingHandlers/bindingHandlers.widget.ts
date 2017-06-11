import * as ko from "knockout";
import { IEditorSession } from "@paperbits/common/ui/IEditorSession";
import { IWidgetEditor } from "@paperbits/common/widgets/IWidgetEditor";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { IInjector } from "@paperbits/common/injection/IInjector";
import { IWidgetModel } from "@paperbits/common/editing/IWidgetModel";


export class WidgetBindingHandler {
    public constructor(viewManager: IViewManager) {
        ko.bindingHandlers["widget"] = {
            init(widgetElement: HTMLElement, valueAccessor: () => IWidgetModel) {
                let attachedWidgetModel: IWidgetModel = valueAccessor();

                let oncreate = (viewModel, element: Node) => {
                    attachedWidgetModel.applyChanges = (): void => {
                        attachedWidgetModel.setupViewModel(viewModel);
                    }

                    attachedWidgetModel.setupViewModel(viewModel);

                    if (element.nodeName == "#comment") {
                        do {
                            element = element.nextSibling;
                        }
                        while (element != null && element.nodeName == "#comment")
                    }

                    if (!element) {
                        return;
                    }

                    element["attachedModel"] = attachedWidgetModel.model;
                    element["attachedWidgetModel"] = attachedWidgetModel;
                }

                ko.applyBindingsToNode(widgetElement, {
                    component: {
                        name: attachedWidgetModel.name,
                        params: attachedWidgetModel.params,
                        oncreate: oncreate
                    }
                })
            }
        };
    }
}