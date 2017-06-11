import * as $ from "jquery";
import * as ko from "knockout";
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

                let reposition = function (targetElement: HTMLElement) {
                    let targetRect = triggerElement.getBoundingClientRect();
                    let balloonRect = targetElement.getBoundingClientRect();
                    let position = options.position;

                    switch (options.position) {
                        case "top":
                            balloonY = targetRect.top;

                            if ((balloonY - balloonRect.height) < 0) {
                                position = "bottom";
                            }
                            break;

                        case "bottom":
                            balloonY = targetRect.top + targetRect.height;

                            if (balloonY + balloonRect.height > window.innerHeight) {
                                position = "top";
                            }
                            break;
                    }

                    targetElement.classList.remove("balloon-top");
                    targetElement.classList.remove("balloon-bottom");

                    switch (position) {
                        case "top":
                            balloonY = targetRect.top - balloonRect.height;
                            balloonX = targetRect.left + (targetRect.width / 2);
                            targetElement.classList.add("balloon-top");
                            break;

                        case "bottom":
                            balloonY = targetRect.top + targetRect.height;
                            balloonX = targetRect.left + (targetRect.width / 2);
                            targetElement.classList.add("balloon-bottom");
                            break;
                    }

                    targetElement.style.top = `${balloonY}px`;
                    targetElement.style.left = `${balloonX}px`;
                }

                let watch = () => { }

                const documentObserver = new MutationObserver(watch);

                const onClick = (event) => {
                    event.preventDefault();

                    let targetElement: HTMLElement = document.querySelector(options.target);

                    if (!targetElement) {
                        throw `Could not find target for balloon.`;
                    }

                    if (targetElement.classList.contains(balloonActiveClassName)) {
                        targetElement.classList.remove(balloonActiveClassName);
                        documentObserver.disconnect();
                    }
                    else {
                        targetElement.classList.add(balloonActiveClassName);
                        reposition(targetElement);

                        watch = function () {
                            reposition(targetElement);
                        }
                        documentObserver.observe(document.body, { childList: true, subtree: true, attributes: true });
                    }
                }

                const onScroll = (event) => {
                    let targetElement: HTMLElement = document.querySelector(options.target);

                    if (!targetElement) {
                        return;
                    }

                    reposition(targetElement);
                }

                const onPointerDown = (event) => {
                    let targetElement: HTMLElement = document.querySelector(options.target);

                    if (!targetElement) {
                        return;
                    }

                    let it = $(event.target).closest(targetElement);
                    let that = $(event.target).closest(triggerElement);

                    if (it.length === 0 && that.length === 0) {
                        if (targetElement) {
                            targetElement.classList.remove(balloonActiveClassName);
                        }

                        documentObserver.disconnect();

                        if (options.isOpen) {
                            options.isOpen(false);
                        }
                    }
                }

                triggerElement.addEventListener("click", onClick);
                document.addEventListener("scroll", onScroll);
                eventManager.addEventListener("onPointerDown", onPointerDown);

                ko.utils.domNodeDisposal.addDisposeCallback(triggerElement, () => {
                    documentObserver.disconnect();
                    triggerElement.removeEventListener("click", onClick);
                    document.removeEventListener("scroll", onScroll);
                    eventManager.removeEventListener("onPointerDown", onPointerDown);
                });
            }
        };
    }
}