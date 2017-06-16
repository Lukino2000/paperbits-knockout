import * as $ from "jquery/dist/jquery";
import * as ko from "knockout";
import { IBackground } from "@paperbits/common/ui/IBackground";

ko.bindingHandlers["style"] = {
    update(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor() || {});

        ko.utils.objectForEach(value, function (styleName, styleValue) {
            styleValue = ko.utils.unwrapObservable(styleValue);

            if (styleValue === null || styleValue === undefined || styleValue === false) {
                // Empty string removes the value, whereas null/undefined have no effect
                styleValue = "";
            }

            element.style.setProperty(styleName, styleValue);
        });
    }
};

ko.bindingHandlers["background"] = {
    init(element: HTMLElement, valueAccessor) {
        var configuration = valueAccessor();
        var styleObservable = ko.observable();

        var setBackground = (config: IBackground) => {
            let style = {};

            Object.assign(style, { "background-color": config.color || null });

            if (config.imageUrl) {
                Object.assign(style, { "background-image": `url("${ko.unwrap(config.imageUrl)}")` });
            }
            else {
                Object.assign(style, { "background-image": null });
            }

            Object.assign(style, { "background-position": config.position || null })

            Object.assign(style, { "background-size": config.size || null })

            Object.assign(style, { "background-repeat": config.repeat || "no-repeat" })


            // if (config.videoUrl) {
            //     let elements = [].slice.call(element.getElementsByTagName("video"));

            //     let video: HTMLVideoElement;

            //     if (elements.length > 0) {
            //         video = elements[0];
            //     }
            //     else {
            //         video = document.createElement("video");
            //         video.classList.add("fit", "no-pointer-events")
            //         $(element).prepend(video);
            //     }

            //     video.src = config.videoUrl;
            //     video.autoplay = true;
            //     video.muted = true;
            //     video.loop = true;
            // }

            styleObservable(style);
        }

        ko.applyBindingsToNode(element, { style: styleObservable });

        if (ko.isObservable(configuration)) {
            configuration.subscribe((newConfiguration) => {

                if (!newConfiguration) {
                    newConfiguration = {};
                }
                else {
                    setBackground(ko.unwrap(newConfiguration));
                }
            });
        }

        let initialConfiguration = ko.unwrap(configuration);

        if (!initialConfiguration) {
            initialConfiguration = {};
        }

        setBackground(initialConfiguration);
    }
};