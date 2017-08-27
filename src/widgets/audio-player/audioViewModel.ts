import * as ko from "knockout";
import * as template from "./audioPlayer.html";
import { Component } from "../../decorators/component";


@Component({
    selector: "paperbits-audio-player",
    template: template
})
export class AudioPlayerViewModel {
    public sourceUrl: KnockoutObservable<string>;
    public controls: KnockoutObservable<boolean>;
    public autoplay: KnockoutObservable<boolean>;
    public sourceKey: KnockoutObservable<string>;

    constructor() {
        this.sourceUrl = ko.observable<string>();
        this.sourceKey = ko.observable<string>();
        this.controls = ko.observable<boolean>();
        this.autoplay = ko.observable<boolean>();
    }
}