import { Intention } from "@paperbits/common/ui/color";


export interface IntentionItem {
    name: string;
    key: string;
    css: () => string;
}

export class StyleSelector {
    private readonly selectedStyle: KnockoutObservable<string>;
    private readonly setStyleCallback: Function;

    public intentions: IntentionItem[];

    constructor(selectedStyle: KnockoutObservable<string>, setStyleCallback: Function) {
        this.selectedStyle = selectedStyle;
        this.setStyleCallback = setStyleCallback;

        this.selectIntention = this.selectIntention.bind(this);

        this.intentions = [];

        for (var key in intentions.text.style) {
            let intention = intentions.text.style[key];
            this.intentions.push({ name: intention.name(), key: key, css: intention.styles() });
        }
    }

    public selectIntention(intention: IntentionItem): void {
        this.selectedStyle(intention.key);

        if (this.setStyleCallback) {
            this.setStyleCallback(intention.key);
        }
    }

    public clearIntentions(): void {
        this.selectedStyle(null);

        if (this.setStyleCallback) {
            this.setStyleCallback(null);
        }
    }
}