import * as ko from "knockout";
import * as template from "./video.html";
import { Component } from "../../decorators/component";


@Component({
    selector: "paperbits-video-player",
    template: template,
    injectable: "videoPlayer"
})
export class VideoPlayerViewModel {
    public sourceUrl: KnockoutObservable<string>;
    public controls: KnockoutObservable<boolean>;
    public autoplay: KnockoutObservable<boolean>;

    constructor() {
        this.sourceUrl = ko.observable<string>();
        this.controls = ko.observable<boolean>();
        this.autoplay = ko.observable<boolean>();
    }
}