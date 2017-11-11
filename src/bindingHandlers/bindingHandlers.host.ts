import * as ko from "knockout";
import { GlobalEventHandler } from "@paperbits/common/events/globalEventHandler";
import { IViewManager } from "@paperbits/common/ui/IViewManager";


export class HostBindingHandler {
    constructor(globalEventHandler: GlobalEventHandler, viewManager: IViewManager) {
        ko.bindingHandlers["host"] = {
            init: (element: HTMLElement, valueAccessor: any) => {
                let config = valueAccessor();
                let css = ko.observable<string>("desktop");

                ko.applyBindingsToNode(element, { css: css });

                config.viewport.subscribe((viewport) => {
                    switch (viewport) {
                        case "xl":
                            css("viewport-xl");
                            break;

                        case "lg":
                            css("viewport-lg");
                            break;

                        case "md":
                            css("viewport-md");
                            break;

                        case "sm":
                            css("viewport-sm");
                            break;

                        case "xs":
                            css("viewport-xs");
                            break;

                        default:
                            throw "Unknown viewport";
                    }
                })

                const hostElement: HTMLIFrameElement = document.createElement("iframe");
                hostElement.src = "index-theme.html";
                hostElement.classList.add("host");

                const onPointerMove = (event) => {
                    let elements: HTMLElement[];

                    if (document.elementsFromPoint) {
                        elements = Array.prototype.slice.call(element.ownerDocument.elementsFromPoint(event.clientX, event.clientY));
                    }
                    else if (element.ownerDocument.msElementsFromPoint) {
                        elements = Array.prototype.slice.call(element.ownerDocument.msElementsFromPoint(event.clientX, event.clientY));
                    }
                    else {
                        throw `Method "elementsFromPoint" not supported by browser.`
                    }

                    if (elements.some(el => el.classList.contains("toolbox") || el.classList.contains("editor"))) {
                        hostElement.classList.add("no-pointer-events");
                    }
                    else {
                        hostElement.classList.remove("no-pointer-events");
                    }
                }

                const onLoad = () => {
                    globalEventHandler.appendDocument(hostElement.contentDocument);

                    let documentElement = document.createElement("paperbits-document");
                    hostElement.contentDocument.body.appendChild(documentElement);
                    ko.applyBindings({}, documentElement);
                }

                hostElement.addEventListener("load", onLoad, false);
                document.addEventListener("pointermove", onPointerMove, true);

                element.appendChild(hostElement);

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    hostElement.removeEventListener("load", onLoad, false);
                    document.removeEventListener("pointermove", onPointerMove);
                });
            }
        }
    }
}