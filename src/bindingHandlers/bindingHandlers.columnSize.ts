import * as ko from "knockout";

ko.bindingHandlers["columnSize"] = {
    init(element: HTMLElement, valueAccessor) {
        let size = valueAccessor();
        let css = {};

        css[`col-cfg-${size}`] = true;

        ko.applyBindingsToNode(element, { css: css })
    }
};
