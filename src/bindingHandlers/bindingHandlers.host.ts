import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import { GlobalEventHandler } from "@paperbits/common/events/globalEventHandler";
import { IViewManager, ViewManagerMode } from "@paperbits/common/ui/IViewManager";


export class HostBindingHandler {
    constructor(globalEventHandler: GlobalEventHandler, viewManager: IViewManager) {
        ko.bindingHandlers["host"] = {
            init: (element: HTMLElement, valueAccessor: any) => {
                const config = valueAccessor();
                const css = ko.observable<string>("desktop");

                ko.applyBindingsToNode(element, { css: css });

                const hostElement: HTMLIFrameElement = document.createElement("iframe");
                hostElement.src = "./theme/index.html";
                hostElement.classList.add("host");

                config.viewport.subscribe((viewport) => {
                    viewManager.mode = ViewManagerMode.selecting;
                    
                    switch (viewport) {
                        case "zoomout":
                            css("viewport-zoomout");
                            viewManager.mode = ViewManagerMode.zoomout;
                            break;

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


                const onPointerMove = (event) => {
                    const elements = Utils.elementsFromPoint(element.ownerDocument, event.clientX, event.clientY);

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