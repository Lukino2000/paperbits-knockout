import * as ko from "knockout";
import * as template from "./layout.html";
import { Component } from "../../decorators/component";


@Component({
    selector: "paperbits-layout",
    template: template,
    injectable: "layoutWidget"
})
export class LayoutViewModel {
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public uriTemplate: KnockoutObservable<string>;
    public widgets: KnockoutObservableArray<Object>;

    constructor() {
        this.widgets = ko.observableArray<Object>();
        this.title = ko.observable<string>();
        this.description = ko.observable<string>();
        this.uriTemplate = ko.observable<string>();
    }
}