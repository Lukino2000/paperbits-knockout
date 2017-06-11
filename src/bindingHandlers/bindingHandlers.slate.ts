import * as ko from "knockout";
import { IHtmlEditor } from "@paperbits/common/editing/IHtmlEditor";
import { IEventManager } from "@paperbits/common/events/IEventManager";


export class SlateBindingHandler {
    constructor(eventManager: IEventManager) {
        ko.bindingHandlers["slate"] = {
            init(element: HTMLElement, valueAccessor) {
                let config = valueAccessor();
                let stateObservable: KnockoutObservable<Object> = config.state;
                let htmlEditor: IHtmlEditor = ko.unwrap(config.htmlEditor);

                htmlEditor.renderToContainer(element);
                htmlEditor.disable();

                let onSelectionChange = () => {
                    eventManager.dispatchEvent("htmlEditorChanged", htmlEditor);
                }
                htmlEditor.addSelectionChangeListener(onSelectionChange);

                let onEscapeKeyPressed = () => { htmlEditor.disable(); }
                eventManager.addEventListener("onEscape", onEscapeKeyPressed);

                let onWidgetEditorClose = () => { htmlEditor.disable(); }

                eventManager.addEventListener("onWidgetEditorClose", onWidgetEditorClose);

                let onHtmlEditorRequested = () => {
                    if (config.readonly()) {
                        return;
                    }
                    htmlEditor.enable();
                }

                eventManager.addEventListener("enableHtmlEditor", onHtmlEditorRequested);

                stateObservable.subscribe(state => {
                    htmlEditor.updateState(state);
                });

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    htmlEditor.disable();
                    htmlEditor.removeSelectionChangeListener(onSelectionChange);
                    eventManager.removeEventListener("onEscape", onEscapeKeyPressed);
                    eventManager.removeEventListener("onWidgetEditorClose", onWidgetEditorClose);
                    eventManager.removeEventListener("enableHtmlEditor", onHtmlEditorRequested);
                });
            }
        };
    }
}
