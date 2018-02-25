import * as ko from "knockout";
import template from "./intentionSelector.html";
import { IBag } from "@paperbits/common/IBag";
import { Component } from "../../../decorators/component";
import { IAppIntentionsProvider } from "../../../application/interface";
import { Intention } from "../../../../../paperbits-common/src/appearance/intention";


export interface IntentionItem extends Intention {
    selected: KnockoutObservable<boolean>;
}

@Component({
    selector: "intention-selector",
    template: template,
    injectable: "intentionSelector"
})
export class IntentionSelector {
    private readonly intentionsProvider: IAppIntentionsProvider;
    private readonly intentions: Intention[];
    private readonly selectedIntention: KnockoutObservable<Intention>;
    private readonly setIntentionSelectorCallback: Function;

    public intentionsViewModel: IntentionItem[];
    public title: string;
    constructor(
        title: string,
        intentions: Intention[],
        selectedIntention: KnockoutObservable<Intention>, 
        setIntentionSelectorCallback: Function, 
        intentionsProvider: IAppIntentionsProvider) {
        this.selectedIntention = selectedIntention;
        this.setIntentionSelectorCallback = setIntentionSelectorCallback;
        this.intentionsProvider = intentionsProvider;
        this.intentions = intentions;
        this.title = title;

        this.selectIntention = this.selectIntention.bind(this);
        this.onIntentionChange = this.onIntentionChange.bind(this);

        this.intentionsViewModel = [];
        let intentionMap = this.intentionsProvider.getIntentions();

        for(var i = 0; i < this.intentions.length; i++){
            const intention : Intention = intentions[i];

            const intentionItem : IntentionItem = {
                name: intention.name,
                fullId: intention.fullId,
                params: intention.params,
                scope: intention.scope,
                selected: ko.observable(false),
                properties: intention.properties
            };
            this.intentionsViewModel.push(intentionItem);
        }

        if (selectedIntention) {
            selectedIntention.subscribe(this.onIntentionChange);
        }
    }

    private onIntentionChange(intention: Intention): void {
        this.intentionsViewModel.forEach(i => {
            i.selected(i.fullId == intention.fullId);
        });
    }

    public selectIntention(intention: Intention): void {
        this.selectedIntention(intention);
        
        if (this.setIntentionSelectorCallback) {
            this.setIntentionSelectorCallback(intention);
        }
    }

    public clearIntentions(): void {
        this.selectedIntention(null);

        if (this.setIntentionSelectorCallback) {
            this.setIntentionSelectorCallback(null);
        }
    }
}