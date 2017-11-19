import * as ko from "knockout";

ko.bindingHandlers["validationMessageToggle"] = {
    // TODO: Switch to balloons

    init: (triggerElement: HTMLElement, valueAccessor) => {
        const observable = valueAccessor();

        if (!ko.isObservable(observable) || !observable.isValid) {
            console.warn("No validation assigned to observable for element: " + triggerElement.nodeType);
            return;
        }

        const shownObservable = ko.observable(false);

        ko.applyBindingsToNode(triggerElement, {
            click: () => {
                shownObservable(!shownObservable())
            },

            css: {
                shown: shownObservable
            },

            attr: { error: observable.error },

            visible: ko.pureComputed(() => !observable.isValid())
        });
    }
}