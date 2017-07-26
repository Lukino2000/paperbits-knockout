import * as ko from "knockout";
import * as template from "./placeholder.html";
import { Component } from "../../decorators/component";


@Component({
    selector: "paperbits-placeholder",
    template: template,
    injectable: "placeholderWidget",
})
export class PlaceholderViewModel {
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;

    constructor() {
        this.title = ko.observable<string>();
        this.description = ko.observable<string>();
    }
}
