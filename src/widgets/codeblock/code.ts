import * as ko from "knockout";

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