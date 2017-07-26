import * as ko from "knockout";
import * as template from "./picture.html";
import { ILightbox } from "@paperbits/common/ui/ILightbox"; // TODO: Can be plugged in as binding
import { IBackground } from "@paperbits/common/ui/IBackground";
import { Component } from "../../decorators/component";

const DefaultSourceUrl = "http://placehold.it/800x600";


@Component({
    selector: "paperbits-picture",
    template: template,
    injectable: "picture"
})
export class PictureViewModel {
    public sourceUrl: KnockoutObservable<string>;
    public caption: KnockoutObservable<string>;
    public action: KnockoutObservable<string>;
    public layout: KnockoutObservable<string>;
    public animation: KnockoutObservable<string>;
    public background: KnockoutObservable<IBackground>;
    public css: KnockoutComputed<string>;

    constructor() {
        this.sourceUrl = ko.observable<string>(DefaultSourceUrl);
        this.caption = ko.observable<string>("Picture");
        this.layout = ko.observable<string>("noframe");
        this.animation = ko.observable<string>("none");

        this.background = ko.computed<IBackground>(() => {
            let background = {
                imageUrl: this.sourceUrl(),
            };

            return background;
        });

        this.css = ko.computed(() => {
            let classes = [];
            classes.push(this.layout());

            return classes.join(" ");
        });
    }
}
