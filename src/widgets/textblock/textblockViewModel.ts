import * as ko from "knockout";
import template from "./textblock.html";
import { Component } from "../../decorators/component";
import { IHtmlEditor } from "@paperbits/common/editing/IHtmlEditor";


@Component({
    selector: "paperbits-text",
    template: template
})
export class TextblockViewModel {
    public readonly htmlEditor: IHtmlEditor;
    public readonly state: KnockoutObservable<Object>;

    public readonly: KnockoutObservable<boolean>;

    constructor(htmlEditor) {
        this.htmlEditor = htmlEditor;
        this.state = ko.observable();
        this.readonly = ko.observable(false);
    }
}

