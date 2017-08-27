import * as ko from "knockout";
import * as Ps from "perfect-scrollbar"

ko.bindingHandlers["scrollable"] = {
    init: (element: HTMLElement, valueAccessor: any) => {
        Ps.initialize(element);
    }
}