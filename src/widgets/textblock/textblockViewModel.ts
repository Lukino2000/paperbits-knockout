import * as ko from "knockout";
import * as template from "./textblock.html";
import { Component } from "../../decorators/component";


@Component({
    selector: "paperbits-text",
    template: template,
    injectable: "textblock"
})
export class TextblockViewModel {
    public readonly htmlEditor;
    public readonly state: KnockoutObservable<Object>;

    public readonly: KnockoutObservable<boolean>;

    constructor(htmlEditor) {
        this.htmlEditor = htmlEditor;
        this.state = ko.observable();
        this.readonly = ko.observable(false);
    }
}

