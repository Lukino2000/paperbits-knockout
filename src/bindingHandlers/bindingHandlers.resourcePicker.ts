import * as ko from "knockout";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { IHyperlinkProvider } from "@paperbits/common/ui/IHyperlinkProvider";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";

ko.bindingHandlers["resourcePicker"] = {
    init: (element: HTMLElement, valueAccessor) => {
        let config = valueAccessor();
        let resourcePicker: IHyperlinkProvider = ko.unwrap(config["resourcePicker"]);
        let onSelect = ko.unwrap(config["onSelect"]);
        let hyperlink: HyperlinkModel = ko.unwrap(config["hyperlink"]);

        let onSelectCallback;
        let onSelectCallbackProxy = (newResource) => {
            if (onSelectCallback) {
                onSelectCallback(newResource);
            }
        }

        ko.applyBindingsToNode(element, {
            component: {
                name: resourcePicker.componentName,
                params: { onSelect: onSelectCallbackProxy },
                oncreate: (resourceSelector: IResourceSelector<any>) => {
                    if (hyperlink && resourceSelector.selectResource) {
                        resourceSelector.selectResource(hyperlink.href);
                    }

                    onSelectCallback = (newResource) => {
                        let hyperlink = resourcePicker.getHyperlinkFromResource(newResource);
                        onSelect(hyperlink);
                    }
                }
            }
        })
    }
}