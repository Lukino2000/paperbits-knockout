﻿import * as $ from "jquery/dist/jquery";
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
            init: (triggerElement: HTMLElement, valueAccessor) => {
                const options = ko.unwrap(valueAccessor());

                let balloonX;
                let balloonY;

                const reposition = () => {
                    const targetElement: HTMLElement = options.element || document.querySelector(options.selector);
                    const triggerRect = triggerElement.getBoundingClientRect();
                    const targetRect = targetElement.getBoundingClientRect();

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

                    targetElement.classList.remove("balloon-top");
                    targetElement.classList.remove("balloon-bottom");

                    switch (position) {
                        case "top":
                            balloonY = triggerRect.top - targetRect.height;
                            balloonX = triggerRect.left + (triggerRect.width / 2) - 20;
                            targetElement.classList.add("balloon-top");
                            break;

                        case "bottom":
                            balloonY = triggerRect.top + triggerRect.height;
                            balloonX = triggerRect.left + (triggerRect.width / 2) - 20;
                            targetElement.classList.add("balloon-bottom");
                            break;
                    }

                    targetElement.style.top = `${balloonY}px`;
                    targetElement.style.left = `${balloonX}px`;
                }

                const open = (): void => {
                    const targetElement: HTMLElement = options.element || document.querySelector(options.selector);

                    if (!targetElement) {
                        return;
                    }
                    targetElement.classList.add(balloonActiveClassName);
                    reposition();
                }

                const close = (): void => {
                    const targetElement: HTMLElement = options.element || document.querySelector(options.selector);

                    if (!targetElement) {
                        return;
                    }
                    targetElement.classList.remove(balloonActiveClassName);
                }

                const toggle = (): void => {
                    const targetElement: HTMLElement = options.element || document.querySelector(options.selector);

                    if (!targetElement) {
                        return;
                    }

                    if (targetElement.classList.contains(balloonActiveClassName)) {
                        close();
                    }
                    else {
                        open();
                    }
                }

                const onPointerDown = (event: PointerEvent) => {
                    if (!triggerElement) {
                        return;
                    }

                    const targetElement: HTMLElement = options.element || document.querySelector(options.selector);

                    if (!targetElement) {
                        return;
                    }

                    const elements = Utils.elementsFromPoint(triggerElement.ownerDocument, event.clientX, event.clientY);

                    if (elements.contains(triggerElement)) {
                        event.preventDefault();
                        event.stopPropagation();
                        toggle();
                    }
                    else if (!elements.contains(targetElement)) {
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
                    let targetElement: HTMLElement = options.element || document.querySelector(options.selector);

                    if (!targetElement) {
                        return;
                    }

                    reposition();
                }

                triggerElement.addEventListener("keydown", onKeyDown);
                triggerElement.addEventListener("click", onClick);
                document.addEventListener("scroll", onScroll);
                eventManager.addEventListener("onPointerDown", onPointerDown);

                ko.utils.domNodeDisposal.addDisposeCallback(triggerElement, () => {
                    triggerElement.removeEventListener("keydown", onKeyDown);
                    triggerElement.removeEventListener("click", onClick)
                    document.removeEventListener("scroll", onScroll);
                    eventManager.removeEventListener("onPointerDown", onPointerDown);
                });
            }
        };
    }
}