import * as ko from "knockout";
import PerfectScrollbar from "perfect-scrollbar";

ko.bindingHandlers["scrollable"] = {
    init: (element: HTMLElement, valueAccessor: any) => {
        const ps = new PerfectScrollbar(element);
    }
}