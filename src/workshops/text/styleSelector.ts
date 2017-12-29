import * as ko from "knockout";
import template from "./styleSelector.html";
import { Intention } from "@paperbits/common/ui/color";
import { Component } from "../../decorators/component";
import { IBag } from "@paperbits/common/core/IBag";
import { IAppIntentionsProvider } from "../../application/interface";


export interface IntentionItem {
    name: string;
    key: string;
    css: string;
    category: string;
    scope: string;
    selected: KnockoutObservable<boolean>;
}

@Component({
    selector: "style-selector",
    template: template,
    injectable: "styleSelector"
})
export class StyleSelector {
    private readonly intentionsProvider: IAppIntentionsProvider;
    private readonly selectedStyle: KnockoutObservable<Object>;
    private readonly setStyleCallback: Function;

    public intentions: IntentionItem[];

    constructor(selectedStyle: KnockoutObservable<Object>, setStyleCallback: Function, 
        intentionsProvider: IAppIntentionsProvider) {
        this.selectedStyle = selectedStyle;
        this.setStyleCallback = setStyleCallback;
        this.intentionsProvider = intentionsProvider;

        this.selectIntention = this.selectIntention.bind(this);
        this.onStyleChange = this.onStyleChange.bind(this);

        this.intentions = [];
        let intentionMap = this.intentionsProvider.getIntentions();

        for (var key in intentionMap.text.style) {
            const intention = intentionMap.text.style[key];

            this.intentions.push({
                name: intention.name(),
                key: key,
                css: intention.styles(),
                category: intention.category,
                scope: intention.scope,
                selected: ko.observable(false)
            });
        }

        if (selectedStyle) {
            selectedStyle.subscribe(this.onStyleChange);
        }
    }

    private onStyleChange(style: IBag<string>): void {
        this.intentions.forEach(intention => {
            intention.selected(style[intention.category] == intention.key);
        });
    }

    public selectIntention(intention: IntentionItem): void {
        this.selectedStyle(intention.key);

        if (this.setStyleCallback) {
            this.setStyleCallback(intention);
        }
    }

    public clearIntentions(): void {
        this.selectedStyle(null);

        if (this.setStyleCallback) {
            this.setStyleCallback(null);
        }
    }
}