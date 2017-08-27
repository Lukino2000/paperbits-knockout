import * as ko from "knockout";
import * as template from "./map.html";
import { Component } from "../../decorators/component";


@Component({
    selector: "paperbits-map",
    template: template
})
export class MapViewModel {
    public location: KnockoutObservable<string>;
    public caption: KnockoutObservable<string>;
    public layout: KnockoutObservable<string>;
    public animation: KnockoutObservable<string>;
    public zoomControl: KnockoutObservable<string>;

    constructor() {
        this.location = ko.observable<string>("Seattle, WA");
        this.caption = ko.observable<string>("Seattle, WA");
        this.layout = ko.observable<string>();
        this.zoomControl = ko.observable<string>("hide");
    }
}