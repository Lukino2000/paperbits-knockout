import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import { IEventManager } from "@paperbits/common/events/IEventManager";
import { Keys } from "@paperbits/common/keyboard";

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

                const createComponent = async (options): Promise<HTMLElement> => {
                    return new Promise<HTMLElement>(resolve => {
                        const container = document.createElement("div");
                        
                        container.classList.add("balloon");
                        toggleElement.ownerDocument.body.appendChild(container);

                        let componentConfig;

                        if (typeof options.component === "string") {
                            componentConfig = { name: options.component }
                        }
                        else {
                            componentConfig = options.component;
                        }

                        componentConfig.oncreate = () => {
                            resolve(container);
                        }

                        ko.applyBindingsToNode(container, {
                            component: componentConfig
                        });
                    });
                }

                const getBalloonElement = async (): Promise<HTMLElement> => {
                    if (options.element) {
                        return options.element;
                    }
                    else if (options.component) {
                        if (componentElement) {
                            return componentElement;
                        }

                        componentElement = await createComponent(options);

                        return componentElement;
                    }
                    else if (options.selector) {
                        return document.querySelector(options.selector);
                    }
                }

                const removeComponent = (): void => {
                    if (componentElement) {
                        toggleElement.ownerDocument.body.removeChild(componentElement);
                        componentElement = null;
                    }
                }

                const reposition = async (): Promise<void> => {
                    const balloonElement = await getBalloonElement();
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
                            balloonElement.classList.add("balloon-top");
                            balloonY = triggerRect.top - targetRect.height;
                            balloonX = triggerRect.left + (triggerRect.width / 2) - 20;

                            break;

                        case "bottom":
                            balloonElement.classList.add("balloon-bottom");
                            balloonY = triggerRect.top + triggerRect.height;
                            balloonX = triggerRect.left + (triggerRect.width / 2) - 20;
                            break;
                    }

                    balloonElement.style.top = `${balloonY}px`;
                    balloonElement.style.left = `${balloonX}px`;
                }

                const open = async (): Promise<void> => {
                    const balloonElement = await getBalloonElement();

                    if (!balloonElement) {
                        return;
                    }
                    balloonElement.classList.add(balloonActiveClassName);
                    reposition();
                }

                const close = async (): Promise<void> => {
                    const balloonElement = await getBalloonElement();

                    if (!balloonElement) {
                        return;
                    }
                    balloonElement.classList.remove(balloonActiveClassName);

                    removeComponent();
                }

                const toggle = async (): Promise<void> => {
                    const balloonElement = await getBalloonElement();

                    if (!balloonElement) {
                        return;
                    }

                    if (balloonElement.classList.contains(balloonActiveClassName)) {
                        await close();
                    }
                    else {
                        await open();
                    }
                }

                const onPointerDown = async (event: PointerEvent): Promise<void> => {
                    if (!toggleElement) {
                        return;
                    }

                    const balloonElement = await getBalloonElement();

                    if (!balloonElement) {
                        return;
                    }

                    const elements = Utils.elementsFromPoint(toggleElement.ownerDocument, event.clientX, event.clientY);

                    if (elements.contains(toggleElement)) {
                        event.preventDefault();
                        event.stopPropagation();
                        await toggle();
                    }
                    else if (!elements.contains(balloonElement)) {
                        await close();
                    }
                }

                const onKeyDown = async (event: KeyboardEvent): Promise<void> => {
                    switch (event.keyCode) {
                        case Keys.Enter:
                        case Keys.Space:
                            event.preventDefault();
                            await toggle();
                            break;

                        case Keys.Esc:
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
                }

                const onScroll = async (event: PointerEvent): Promise<void> => {
                    // TODO: This is expensive and frequent event. 

                    const balloonElement = await getBalloonElement();

                    if (!balloonElement) {
                        return;
                    }

                    await reposition();
                }

                toggleElement.addEventListener("keydown", onKeyDown);
                toggleElement.addEventListener("click", onClick);
                document.addEventListener("scroll", onScroll);
                eventManager.addEventListener("onPressDownGesture", onPointerDown);

                ko.utils.domNodeDisposal.addDisposeCallback(toggleElement, () => {
                    toggleElement.removeEventListener("keydown", onKeyDown);
                    toggleElement.removeEventListener("click", onClick)
                    document.removeEventListener("scroll", onScroll);
                    eventManager.removeEventListener("onPressDownGesture", onPointerDown);

                    removeComponent();
                });
            }
        };
    }
}