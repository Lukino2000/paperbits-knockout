import * as ko from "knockout";
import * as template from "./styleSelector.html";
import { Intention } from "@paperbits/common/ui/color";
import { Component } from "../../decorators/component";
import { IntentionMapService } from "@paperbits/slate/intentionMapService";
import { IBag } from "@paperbits/common/core/IBag";


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
    private readonly intentionMapService: IntentionMapService;
    private readonly selectedStyle: KnockoutObservable<Object>;
    private readonly setStyleCallback: Function;

    public intentions: IntentionItem[];

    constructor(selectedStyle: KnockoutObservable<Object>, setStyleCallback: Function, intentionMapService: IntentionMapService) {
        this.selectedStyle = selectedStyle;
        this.setStyleCallback = setStyleCallback;
        this.intentionMapService = intentionMapService;

        this.selectIntention = this.selectIntention.bind(this);
        this.onStyleChange = this.onStyleChange.bind(this);

        this.intentions = [];
        let intentionMap = <any>this.intentionMapService.getMap();

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