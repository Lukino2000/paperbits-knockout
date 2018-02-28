﻿import * as ko from "knockout";

ko.bindingHandlers["columnSize"] = {
    init(element: HTMLElement, valueAccessor) {
        let sizes = valueAccessor();
        let size: number = sizes.xs;

        if (sizes.sm) {
            size = sizes.sm;
        }

        if (sizes.md) {
            size = sizes.md;
        }

        if (sizes.lg) {
            size = sizes.lg;
        }

        if (sizes.xl) {
            size = sizes.xl;
        }

        let css = {};

        css[`col-cfg-${size}`] = true;

        ko.applyBindingsToNode(element, { css: css })
    }
};
