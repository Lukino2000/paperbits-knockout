import * as ko from "knockout";
import template from "./colorSelector.html";
import { Intention } from "@paperbits/common/ui/color";
import { Component } from "../../decorators/component";
import { IntentionMapService } from "@paperbits/slate/intentionMapService";

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
    private readonly intentionMapService: IntentionMapService;
    private readonly selectedColor: KnockoutObservable<string>;
    private readonly setColorCallback: Function;

    public intentions: IntentionItem[];

    constructor(selectedColor: KnockoutObservable<string>, setColorCallback: Function, intentionMapService: IntentionMapService) {
        this.selectedColor = selectedColor;
        this.setColorCallback = setColorCallback;
        this.intentionMapService = intentionMapService;

        this.selectIntention = this.selectIntention.bind(this);

        this.intentions = [];
        let intentionMap = <any>this.intentionMapService.getMap();

        for (var key in intentionMap.section.background) {
            let intention = intentionMap.section.background[key];
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