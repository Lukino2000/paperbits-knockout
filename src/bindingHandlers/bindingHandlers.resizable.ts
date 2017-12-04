import * as ko from "knockout";
import { IEventManager } from "../../../paperbits-common/src/events/IEventManager";
import { debug } from "util";
import { watch } from "fs";


export class ResizableBindingHandler {
    constructor(eventManager: IEventManager) {
        ko.bindingHandlers.resizable = {
            init: (element: HTMLElement, valueAccessor: () => string) => {
                const options = valueAccessor();

                let resizing = false;
                let initialOffsetX, initialOffsetY, initialWidth, initialHeight, initialEdge;

                const style = window.getComputedStyle(element);
                const minWidth = style.minWidth;

                const onPointerDown = (event: PointerEvent, edge: string): void => {
                    const rect = element.getBoundingClientRect();

                    event.preventDefault();
                    event.stopImmediatePropagation();

                    eventManager.addEventListener("onPointerMove", onPointerMove);
                    eventManager.addEventListener("onPointerUp", onPointerUp);

                    resizing = true;

                    initialEdge = edge;
                    initialOffsetX = event.clientX;
                    initialOffsetY = event.clientY;
                    initialWidth = rect.width;
                    initialHeight = rect.height;
                }

                const onPointerUp = (event: PointerEvent): void => {
                    resizing = false;
                    eventManager.removeEventListener("onPointerMove", onPointerMove);
                    eventManager.removeEventListener("onPointerUp", onPointerUp);
                }

                const onPointerMove = (event: PointerEvent): void => {
                    if (!resizing) {
                        return;
                    }

                    let width, height, left, top;

                    switch (initialEdge) {
                        case "left":
                            left = event.clientX + 'px';
                            width = (initialWidth + (initialOffsetX - event.clientX)) + 'px';
                            break;

                        case "right":
                            width = (initialWidth + event.clientX - initialOffsetX) + 'px';
                            break;

                        case "top":
                            top = event.clientY + 'px';
                            height = (initialHeight + (initialOffsetY - event.clientY)) + 'px';
                            break;

                        case "bottom":
                            height = (initialHeight + event.clientY - initialOffsetY) + 'px';
                            break;
                    }

                    if (width < minWidth) {
                        width = minWidth;
                    }
                    else {
                        element.style.left = left;
                        element.style.width = width;
                    }

                    element.style.top = top;
                    element.style.height = height;
                    element.classList.add("h-resized");
                }

                if (options.contains("both") || options.contains("vertically")) {
                    const topResizeHandle = element.ownerDocument.createElement("div");
                    topResizeHandle.classList.add("resize-handle", "resize-handle-top");
                    element.appendChild(topResizeHandle);
                    topResizeHandle.addEventListener("pointerdown", (e) => onPointerDown(e, "top"))

                    const bottomResizeHandle = element.ownerDocument.createElement("div");
                    bottomResizeHandle.classList.add("resize-handle", "resize-handle-bottom");
                    element.appendChild(bottomResizeHandle);
                    bottomResizeHandle.addEventListener("pointerdown", (e) => onPointerDown(e, "bottom"));
                }

                if (options.contains("both") || options.contains("horizontally")) {
                    const rightResizeHandle = element.ownerDocument.createElement("div");
                    rightResizeHandle.classList.add("resize-handle", "resize-handle-right");
                    element.appendChild(rightResizeHandle);
                    rightResizeHandle.addEventListener("pointerdown", (e) => onPointerDown(e, "right"));

                    const leftResizeHandle = element.ownerDocument.createElement("div");
                    leftResizeHandle.classList.add("resize-handle", "resize-handle-left");
                    element.appendChild(leftResizeHandle);
                    leftResizeHandle.addEventListener("pointerdown", (e) => onPointerDown(e, "left"));
                }
            }
        }
    }
}
