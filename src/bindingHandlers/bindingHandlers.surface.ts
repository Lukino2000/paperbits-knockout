import * as $ from "jquery/dist/jquery";
import * as ko from "knockout";
import * as Utils from '@paperbits/common/core/utils';
import { IEditorSession } from "@paperbits/common/ui/IEditorSession";
import { debug } from "util";
import { Number } from "es6-shim";

ko.bindingHandlers["surface"] = {
    init(element: HTMLElement, valueAccessor?: () => IEditorSession) {
        const editorSession = valueAccessor();
        const settingsString = localStorage["settings"];

        if (settingsString) {
            const settings = JSON.parse(settingsString);
            const editorSettings = settings[editorSession.component.name];

            if (editorSettings) {
                if (Number.isInteger(editorSettings.width)) {
                    element.style.width = editorSettings.width + "px";
                }

                if (Number.isInteger(editorSettings.height)) {
                    element.style.height = editorSettings.height + "px";
                    element.classList.add("h-resized");
                }

                if (Number.isInteger(editorSettings.left)) {
                    if (editorSettings.left + editorSettings.width > document.body.clientWidth) {
                        editorSettings.left = document.body.clientWidth - editorSettings.width;
                    }

                    element.style.left = editorSettings.left + "px";
                }

                if (Number.isInteger(editorSettings.top)) {
                    if (editorSettings.top + editorSettings.height > document.body.clientHeight) {
                        editorSettings.top = document.body.clientHeight - editorSettings.height;
                    }

                    element.style.top = editorSettings.top + "px";
                }
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

                    Utils.setValue(`${editorSession.component.name}/top`, settings, Math.floor(rect.top));
                    Utils.setValue(`${editorSession.component.name}/left`, settings, Math.floor(rect.left));

                    localStorage["settings"] = JSON.stringify(settings);
                }
            }
        });

        ko.applyBindingsToNode(element, {
            resizable: {
                directions: editorSession.resize,
                onresize: () => {
                    if (!editorSession || !editorSession.component) {
                        return;
                    }

                    const settingsString = localStorage["settings"];

                    let settings = {};

                    if (settingsString) {
                        settings = JSON.parse(settingsString);
                    }

                    if (editorSession.resize === "horizontally" || editorSession.resize === "all") {
                        Utils.setValue(`${editorSession.component.name}/width`, settings, element.clientWidth);
                    }

                    if (editorSession.resize === "vertically" || editorSession.resize === "all") {
                        Utils.setValue(`${editorSession.component.name}/height`, settings, element.clientHeight)
                    }

                    localStorage["settings"] = JSON.stringify(settings);
                }
            }
        });
    }
};