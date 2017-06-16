import * as $ from "jquery/dist/jquery";
import * as ko from "knockout";

ko.bindingHandlers["snapTo"] = {
    init(element: HTMLElement, valueAccessor: () => any) {
        let config = valueAccessor();

        if (ko.isObservable(config)) {
            config.subscribe(newConfig => {
                element.classList.remove("sticky-top-shadow");
                element.classList.remove("sticky-bottom-shadow");
                element.classList.remove("sticky-top");
                element.classList.remove("sticky-bottom");

                if (newConfig) {
                    if (newConfig === "top") {
                        element["snapClass"] = "sticky-top";
                        element.classList.add("sticky-top");
                    }

                    if (newConfig === "bottom") {
                        element["snapClass"] = "sticky-bottom";
                        element.classList.add("sticky-bottom");
                    }
                }
            })
        }

        // let onScroll = () => {
        //     if (element.classList.contains("sticky-top")) {
        //         let scrollY = element.ownerDocument.defaultView.window.scrollY;
        //         let rect = element.getBoundingClientRect();

        //         if (rect.top === 0 && scrollY > 3) {
        //             element.classList.add("sticky-top-shadow");
        //         }
        //         else {
        //             element.classList.remove("sticky-top-shadow");
        //         }
        //         return;
        //     }
        // }

        // element.ownerDocument.addEventListener("scroll", onScroll);

        // ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
        //     document.removeEventListener("scroll", onScroll);
        // });
    }
};
