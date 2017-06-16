import * as ko from "knockout";
import * as template from "./colorSelector.html";
import { Intention } from "@paperbits/common/ui/color";
import { Component } from "../../decorators/component";

export interface IntentionItem {
    name: string;
    key: string;
    css: () => string;
}

@Component({
    selector: "color-selector",
    template: template,
    injectable: "colorSelector"
})
export class ColorSelector {
    private readonly selectedColor: KnockoutObservable<string>;
    private readonly setColorCallback: Function;

    public intentions: IntentionItem[];

    constructor(selectedColor: KnockoutObservable<string>, setColorCallback: Function) {
        this.selectedColor = selectedColor;
        this.setColorCallback = setColorCallback;

        this.selectIntention = this.selectIntention.bind(this);

        this.intentions = [];

        for (var key in intentions.section.background) {
            let intention = intentions.section.background[key];
            this.intentions.push({ name: intention.name(), key: key, css: intention.styles() });
        }
    }

    public selectIntention(intention: IntentionItem): void {
        if (this.selectedColor) {
            this.selectedColor(intention.key);
        }

        if (this.setColorCallback) {
            this.setColorCallback(intention.key);
        }
    }

    public clearIntentions(): void {
        if (this.selectedColor) {
            this.selectedColor(null);
        }

        if (this.setColorCallback) {
            this.setColorCallback(null);
        }
    }
}