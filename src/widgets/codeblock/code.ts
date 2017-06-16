import * as ko from "knockout";
import * as template from "./code.html";
import { Component } from "../../decorators/component";


@Component({
    selector: "paperbits-code",
    template: template,
    injectable: "codeBlock"
})
export class Code {
    public lang: KnockoutObservable<string>;
    public code: KnockoutObservable<string>;
    public theme: KnockoutObservable<string>;
    public isEditable: KnockoutObservable<boolean>;

    constructor() {
        this.code = ko.observable<string>("var i = 0;");
        this.lang = ko.observable<string>("csharp");
        this.theme = ko.observable<string>("ambient");
        this.isEditable = ko.observable<boolean>(false);
    }
}