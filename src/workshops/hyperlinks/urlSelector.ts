import * as ko from "knockout";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";

export class UrlSelector implements IResourceSelector<string> {
    private readonly onUrlSelected: (url: string) => void;

    public url: KnockoutObservable<string>;
    public onResourceSelected: (url: string) => void;

    constructor(onSelect: (url: string) => void) {
        this.onResourceSelected = onSelect;

        this.selectUrl = this.selectUrl.bind(this);

        this.url = ko.observable<string>();
        this.url.subscribe(this.selectUrl.bind(this));
    }

    public selectResource(url: string): void {
        this.url(url);
    }

    public async selectUrl(url: string): Promise<void> {
        if (url && url.length > 0 && this.onResourceSelected) {
            this.onResourceSelected(url);
        }
    }
}