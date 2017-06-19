import * as ko from "knockout";
import "../bindingHandlers/bindingHandlers.stickTo";
import "../bindingHandlers/bindingHandlers.scrollable";

ko.components.register("spinner", {
    template: `<div class="spinner spinner-signal"></div>`,
    viewModel: () => null
});