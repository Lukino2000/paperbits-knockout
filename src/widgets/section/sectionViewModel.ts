import * as ko from "knockout";
import * as template from "./section.html";
import { RowViewModel } from "./../row/rowViewModel";
import { IBackground } from "@paperbits/common/ui/IBackground";
import { Component } from "../../decorators/component";


@Component({
    selector: "layout-section",
    template: template,
    injectable: "section"
})
export class SectionViewModel {
    public rows: KnockoutObservableArray<RowViewModel>;
    public layout: KnockoutObservable<string>;
    public backgroundType: KnockoutObservable<string>;
    public backgroundPictureUrl: KnockoutObservable<string>;
    public backgroundSize: KnockoutObservable<string>;
    public backgroundPosition: KnockoutObservable<string>;
    public backgroundRepeat: KnockoutObservable<string>;

    public background: KnockoutObservable<IBackground>;
    public css: KnockoutObservable<string>;
    public snapTo: KnockoutObservable<string>;

    constructor() {
        this.rows = ko.observableArray<RowViewModel>();
        this.layout = ko.observable<string>("container");
        this.backgroundType = ko.observable<string>();
        this.backgroundPictureUrl = ko.observable<string>();
        this.backgroundSize = ko.observable<string>();
        this.backgroundPosition = ko.observable<string>();
        this.backgroundRepeat = ko.observable<string>();
        this.css = ko.observable<string>();
        this.snapTo = ko.observable<string>();
        this.background = ko.computed<IBackground>(this.computeBackground.bind(this));
    }

    private computeBackground() {
        let background = {
            // videoUrl: "https://firebasestorage.googleapis.com/v0/b/project-5562312728052499011.appspot.com/o/tenants%2Fdefault%2Fcar-20120827-85.mp4?alt=media&token=38138adf-5898-4ffb-a67e-cec1f8d4689b"
        };

        if (this.backgroundType() === "picture") {
            Object.assign(background, {
                imageUrl: this.backgroundPictureUrl(),
                position: this.backgroundPosition(),
                size: this.backgroundSize(),
                repeat: this.backgroundRepeat()
            })
        }

        return background;
    }
}