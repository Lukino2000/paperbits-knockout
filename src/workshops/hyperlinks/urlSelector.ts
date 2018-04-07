import * as ko from "knockout";
import template from "./urlSelector.html";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { Component } from "../../decorators/component";


@Component({
    selector: "url-selector",
    template: template,
    injectable: "urlSelector"
})
export class UrlSelector implements IResourceSelector<string> {
    private readonly onUrlSelected: (url: string) => void;

    public urls: KnockoutObservableArray<string>;

    public url: KnockoutObservable<string>;
    public onSelected: (url: string) => void;

    constructor(onSelect: (url: string) => void) {
        this.onSelected = onSelect;

        this.selectUrl = this.selectUrl.bind(this);

        this.urls = ko.observableArray<string>([
            "https://google.com",
            "https://paperbits.io",
        ]);

        this.url = ko.observable<string>();
        this.url.subscribe(this.selectUrl.bind(this));
    }

    // public selectResource(url: string): void {
    //     this.url(url);
    // }

    public async selectUrl(url: string): Promise<void> {
        if (url && url.length > 0 && this.onSelected) {
            this.onSelected(url);
        }
    }
}