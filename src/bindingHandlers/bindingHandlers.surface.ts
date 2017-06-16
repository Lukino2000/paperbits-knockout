import * as $ from "jquery/dist/jquery";
import * as ko from "knockout";

ko.bindingHandlers["surface"] = {
    init(element, valueAccessor) {
        ko.applyBindingsToNode(element, {
            dragsource: {
                sticky: false,
                payload: "surface",
                preventDragging: (clickedElement: HTMLElement) => {
                    return $(clickedElement).closest("a, .form, .toolbox-button, .toolbox-dropdown").length > 0;
                }
            }
        });
    }
};