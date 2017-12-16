import * as $ from "jquery/dist/jquery";
import * as ko from "knockout";
import * as Utils from "@paperbits/common/core/utils";
import { IEventManager } from "@paperbits/common/events/IEventManager";

const balloonActiveClassName = "balloon-is-active";

export interface BalloonOptions {
    position: string;
}

export class BalloonBindingHandler {
    constructor(eventManager: IEventManager) {
        ko.bindingHandlers["balloon"] = {
            init: (toggleElement: HTMLElement, valueAccessor) => {
                const options = ko.unwrap(valueAccessor());

                let balloonX;
                let balloonY;
                let componentElement;

                const getBalloonElement = (): HTMLElement => {
                    let balloonElement: HTMLElement;

                    if (options.element) {
                        return options.element;
                    }
                    else if (options.component) {
                        if (componentElement) {
                            return componentElement;
                        }

                        componentElement = document.createElement("div");
                        componentElement.classList.add("balloon");
                        toggleElement.ownerDocument.body.appendChild(componentElement);

                        ko.applyBindingsToNode(componentElement, { component: options.component });

                        return componentElement;
                    }
                    else if (options.selector) {
                        return document.querySelector(options.selector);
                    }

                    return balloonElement;
                }

                const removeComponent = (): void => {
                    if (componentElement) {
                        toggleElement.ownerDocument.body.removeChild(componentElement);
                        componentElement = null;
                    }
                }

                const reposition = (): void => {
                    const balloonElement = getBalloonElement();
                    const triggerRect = toggleElement.getBoundingClientRect();
                    const targetRect = balloonElement.getBoundingClientRect();

                    let position = options.position;

                    switch (options.position) {
                        case "top":
                            balloonY = triggerRect.top;

                            if ((balloonY - targetRect.height) < 0) {
                                position = "bottom";
                            }
                            break;

                        case "bottom":
                            balloonY = triggerRect.top + triggerRect.height;

                            if (balloonY + targetRect.height > window.innerHeight) {
                                position = "top";
                            }
                            break;
                    }

                    balloonElement.classList.remove("balloon-top");
                    balloonElement.classList.remove("balloon-bottom");

                    switch (position) {
                        case "top":
                            balloonY = triggerRect.top - targetRect.height;
                            balloonX = triggerRect.left + (triggerRect.width / 2) - 20;
                            balloonElement.classList.add("balloon-top");
                            break;

                        case "bottom":
                            balloonY = triggerRect.top + triggerRect.height;
                            balloonX = triggerRect.left + (triggerRect.width / 2) - 20;
                            balloonElement.classList.add("balloon-bottom");
                            break;
                    }

                    balloonElement.style.top = `${balloonY}px`;
                    balloonElement.style.left = `${balloonX}px`;
                }

                const open = (): void => {
                    const balloonElement = getBalloonElement();

                    if (!balloonElement) {
                        return;
                    }
                    balloonElement.classList.add(balloonActiveClassName);
                    reposition();
                }

                const close = (): void => {
                    const balloonElement = getBalloonElement();

                    if (!balloonElement) {
                        return;
                    }
                    balloonElement.classList.remove(balloonActiveClassName);

                    removeComponent();
                }

                const toggle = (): void => {
                    const balloonElement = getBalloonElement();

                    if (!balloonElement) {
                        return;
                    }

                    if (balloonElement.classList.contains(balloonActiveClassName)) {
                        close();
                    }
                    else {
                        open();
                    }
                }

                const onPointerDown = (event: PointerEvent): void => {
                    if (!toggleElement) {
                        return;
                    }

                    const balloonElement = getBalloonElement();

                    if (!balloonElement) {
                        return;
                    }

                    const elements = Utils.elementsFromPoint(toggleElement.ownerDocument, event.clientX, event.clientY);

                    if (elements.contains(toggleElement)) {
                        event.preventDefault();
                        event.stopPropagation();
                        toggle();
                    }
                    else if (!elements.contains(balloonElement)) {
                        close();
                    }
                }

                const onKeyDown = (event: KeyboardEvent): void => {
                    switch (event.keyCode) {
                        case 13:
                        case 32:
                            event.preventDefault();
                            toggle();
                            break;

                        case 27:
                            if (options.isOpen && options.isOpen()) {
                                // TODO: ViewManager should have stack of open editors, so they need to be closed one by one.
                                options.isOpen(false);
                            }
                            break;
                    }
                }

                const onClick = (event: PointerEvent): void => {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    // toggle();
                }

                const onScroll = (event: PointerEvent) => {
                    const balloonElement = getBalloonElement();

                    if (!balloonElement) {
                        return;
                    }

                    reposition();
                }

                toggleElement.addEventListener("keydown", onKeyDown);
                toggleElement.addEventListener("click", onClick);
                document.addEventListener("scroll", onScroll);
                eventManager.addEventListener("onPointerDown", onPointerDown);

                ko.utils.domNodeDisposal.addDisposeCallback(toggleElement, () => {
                    toggleElement.removeEventListener("keydown", onKeyDown);
                    toggleElement.removeEventListener("click", onClick)
                    document.removeEventListener("scroll", onScroll);
                    eventManager.removeEventListener("onPointerDown", onPointerDown);

                    removeComponent();
                });
            }
        };
    }
}