import * as ko from "knockout";

ko.bindingHandlers["collapse"] = {
    init: (triggerElement: HTMLElement, valueAccessor) => {
        const targetSelector = ko.unwrap(valueAccessor());
        const targetElement = document.querySelector(targetSelector);
        const visibleObservable = ko.observable(true);
        const triggerClassObservable = ko.observable()

        const onPointerDown = (event: PointerEvent) => {
            if (event.pointerType === "mouse" && event.button !== 0) {
                return;
            }
            visibleObservable(!visibleObservable());
        }

        const onClick = (event: MouseEvent) => {
            event.preventDefault();
            event.stopImmediatePropagation();
        }

        triggerElement.addEventListener("click", onClick);
        triggerElement.addEventListener("pointerdown", onPointerDown);

        ko.applyBindingsToNode(targetElement, {
            visible: visibleObservable
        });

        ko.applyBindingsToNode(triggerElement, {
            css: { collapsed: ko.pureComputed(() => !visibleObservable()) }
        });

        ko.utils.domNodeDisposal.addDisposeCallback(triggerElement, () => {
            triggerElement.removeEventListener("pointerdown", onPointerDown);
        });
    }
}