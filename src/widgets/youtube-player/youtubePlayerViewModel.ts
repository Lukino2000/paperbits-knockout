import * as ko from "knockout";
import * as template from "./youtube.html";
import { Component } from "../../decorators/component";


@Component({
    selector: "paperbits-youtube-player",
    template: template,
    injectable: "youtubePlayer"
})
export class YoutubePlayerViewModel {
    public videoId: KnockoutObservable<string>;

    constructor() {
        this.videoId = ko.observable<string>();
    }
}