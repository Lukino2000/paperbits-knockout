import * as $ from "jquery/dist/jquery";
import * as ko from "knockout";
import { IEditorSession } from "@paperbits/common/ui/IEditorSession";

ko.bindingHandlers["surface"] = {
    init(element, valueAccessor?: () => IEditorSession) {
        const editorSession = valueAccessor();
        const settingsString = localStorage["settings"];

        if (settingsString) {
            const settings = JSON.parse(settingsString);
            const position = settings[editorSession.component.name] || {};

            if (position) {
                element.style.left = position.x + "px";
                element.style.top = position.y + "px";
            }
        }

        ko.applyBindingsToNode(element, {
            dragsource: {
                sticky: false,
                payload: "surface",
                preventDragging: (clickedElement: HTMLElement) => {
                    return $(clickedElement).closest("a, .form, .toolbox-button, .toolbox-dropdown").length > 0;
                },
                ondragend: (): void => {
                    if (!editorSession || !editorSession.component) {
                        return;
                    }

                    const rect = element.getBoundingClientRect();
                    const settingsString = localStorage["settings"];
                    let settings = {};

                    if (settingsString) {
                        settings = JSON.parse(settingsString);
                    }

                    const draggedEditorSettings = {};
                    draggedEditorSettings[editorSession.component.name] = {
                        x: rect.left,
                        y: rect.top
                    }

                    Object.assign(settings, draggedEditorSettings);

                    localStorage["settings"] = JSON.stringify(settings);
                }
            }
        });
    }
};