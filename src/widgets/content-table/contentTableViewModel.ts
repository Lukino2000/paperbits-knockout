import * as ko from "knockout";
import template from "./contentTable.html";
import { Component } from "../../decorators/component";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";

@Component({
    selector: "content-table",
    template: template
})
export class ContentTableViewModel {
    public title: KnockoutObservable<string>;
    public targetPermalinkKey: KnockoutObservable<string>;
    public anchors: KnockoutObservableArray<HyperlinkModel>;

    constructor() {
        this.title = ko.observable<string>();
        this.targetPermalinkKey = ko.observable<string>();
        this.anchors = ko.observableArray<HyperlinkModel>();
    }
}