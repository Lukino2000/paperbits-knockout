import * as ko from "knockout";
import template from "./colorSelector.html";
import { Intention } from "@paperbits/common/ui/color";
import { Component } from "../../decorators/component";
import { IAppIntentionsProvider } from "../../application/interface";

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
    private readonly intentionsProvider: IAppIntentionsProvider;
    private readonly selectedColor: KnockoutObservable<string>;
    private readonly onSelect: Function;

    public intentions: IntentionItem[];

    constructor(onSelect: Function, selectedColor: KnockoutObservable<string>, intentionsProvider: IAppIntentionsProvider) {
        this.selectedColor = selectedColor;
        this.onSelect = onSelect;
        this.intentionsProvider = intentionsProvider;

        this.selectIntention = this.selectIntention.bind(this);

        this.intentions = [];
        let intentionMap = this.intentionsProvider.getIntentions();

        for (var key in intentionMap.container.background) {
            let intention = intentionMap.container.background[key];
            this.intentions.push({ name: intention.name(), key: key, css: intention.styles() });
        }
    }

    public selectIntention(intention: IntentionItem): void {
        if (this.selectedColor) {
            this.selectedColor(intention.key);
        }

        if (this.onSelect) {
            this.onSelect(intention.key);
        }
    }

    public clearIntentions(): void {
        if (this.selectedColor) {
            this.selectedColor(null);
        }

        if (this.onSelect) {
            this.onSelect(null);
        }
    }
}