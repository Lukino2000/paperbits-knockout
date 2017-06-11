import * as ko from "knockout";
import "jquery.nicescroll";

declare var NiceScroll;

ko.bindingHandlers["scrollable"] = {
    init: (element: HTMLElement, valueAccessor: any) => {
        var jQuery = NiceScroll.getjQuery();

        jQuery(element).niceScroll({
            cursorcolor: "rgba(0,0,0,.2)",
            cursorborder: "none",
            autohidemode: true
        });
    }
}