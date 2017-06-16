import * as ko from "knockout";
import "../bindingHandlers/bindingHandlers.stickTo";
import "../bindingHandlers/bindingHandlers.scrollable";

ko.components.register("spinner", {
    template: { fromUrl: "ui/spinner.html" },
    viewModel: () => null
});