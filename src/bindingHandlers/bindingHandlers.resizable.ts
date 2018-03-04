import * as ko from "knockout";
import { IEventManager } from "@paperbits/common/events/IEventManager";
import { isNumber } from "util";
import { PointGesture } from "@paperbits/common/events/gestures";

interface ResizableOptions {
    /**
     * Allowed values: "none", "vertically", "horizontally".
     */
    directions: string;
    onresize: () => void;
}

export class ResizableBindingHandler {
    constructor(eventManager: IEventManager) {
        ko.bindingHandlers.resizable = {
            init: (element: HTMLElement, valueAccessor: () => string | ResizableOptions) => {
                const options = valueAccessor();

                let directions;
                let onResizeCallback;

                const setOptions = (updatedOptions: string | ResizableOptions) => {
                    if (typeof updatedOptions === "string") {
                        directions = updatedOptions;
                    }
                    else {
                        directions = updatedOptions.directions;
                        onResizeCallback = updatedOptions.onresize;
                    }

                    if (directions.contains("suspended")) {
                        element.classList.add("resize-suspended");

                        element.style.width = null;
                        element.style.height = null;
                    }
                    else {
                        element.classList.remove("resize-suspended");
                    }
                }

                setOptions(ko.unwrap(options));

                if (ko.isObservable(options)) {
                    options.subscribe(setOptions);
                }

                let resizing = false;
                let initialOffsetX, initialOffsetY, initialWidth, initialHeight, initialEdge;

                const style = window.getComputedStyle(element);
                const minWidth = style.minWidth;
                const minHeight = style.minHeight;

                const onPointerDown = (event: MouseEvent, edge: string): void => {
                    if (directions == "none") {
                        return;
                    }

                    const rect = element.getBoundingClientRect();

                    event.preventDefault();
                    event.stopImmediatePropagation();

                    eventManager.addEventListener("onMoveGesture", onMoveGesture);
                    eventManager.addEventListener("onPressUpGesture", onPointerUp);

                    resizing = true;

                    initialEdge = edge;
                    initialOffsetX = event.clientX;
                    initialOffsetY = event.clientY;
                    initialWidth = rect.width;
                    initialHeight = rect.height;
                }

                const onPointerUp = (gesture: PointGesture): void => {
                    resizing = false;
                    eventManager.removeEventListener("onMoveGesture", onMoveGesture);
                    eventManager.removeEventListener("onPressUpGesture", onPointerUp);

                    if (onResizeCallback) {
                        onResizeCallback();
                    }
                }

                const onMoveGesture = (gesture: PointGesture): void => {
                    if (!resizing) {
                        return;
                    }

                    let width, height, left, top;

                    switch (initialEdge) {
                        case "left":
                            left = gesture.clientX + "px";
                            width = (initialWidth + (initialOffsetX - gesture.clientX)) + "px";
                            break;

                        case "right":
                            width = (initialWidth + gesture.clientX - initialOffsetX) + "px";
                            break;

                        case "top":
                            top = gesture.clientY + "px";
                            height = (initialHeight + (initialOffsetY - gesture.clientY)) + "px";
                            break;

                        case "bottom":
                            height = (initialHeight + gesture.clientY - initialOffsetY) + "px";
                            break;
                    }

                    if (isNumber(minWidth) && width < minWidth) {
                        width = minWidth;
                    }
                    else {
                        element.style.left = left;
                        element.style.width = width;
                        element.classList.add("resized-horizontally");
                    }

                    if (isNumber(minHeight) && height < minHeight) {
                        height = minHeight;
                    }
                    else {
                        element.style.top = top;
                        element.style.height = height;
                        element.classList.add("resized-vertically");
                    }
                }

                if (directions.contains("vertically")) {
                    const topResizeHandle = element.ownerDocument.createElement("div");
                    topResizeHandle.classList.add("resize-handle", "resize-handle-top");
                    element.appendChild(topResizeHandle);
                    topResizeHandle.addEventListener("mousedown", (e) => onPointerDown(e, "top"))

                    const bottomResizeHandle = element.ownerDocument.createElement("div");
                    bottomResizeHandle.classList.add("resize-handle", "resize-handle-bottom");
                    element.appendChild(bottomResizeHandle);
                    bottomResizeHandle.addEventListener("mousedown", (e) => onPointerDown(e, "bottom"));
                }

                if (directions.contains("horizontally")) {
                    const rightResizeHandle = element.ownerDocument.createElement("div");
                    rightResizeHandle.classList.add("resize-handle", "resize-handle-right");
                    element.appendChild(rightResizeHandle);
                    rightResizeHandle.addEventListener("mousedown", (e) => onPointerDown(e, "right"));

                    const leftResizeHandle = element.ownerDocument.createElement("div");
                    leftResizeHandle.classList.add("resize-handle", "resize-handle-left");
                    element.appendChild(leftResizeHandle);
                    leftResizeHandle.addEventListener("mousedown", (e) => onPointerDown(e, "left"));
                }

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    eventManager.removeEventListener("onMoveGesture", onMoveGesture);
                    eventManager.removeEventListener("onPressUpGesture", onPointerUp);
                });
            }
        }
    }
}
