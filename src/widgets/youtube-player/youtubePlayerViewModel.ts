import * as ko from "knockout";
import template from "./youtube.html";
import { Component } from "../../decorators/component";
import { IWidgetBinding } from "@paperbits/common/editing";
import { YoutubePlayerModel } from "@paperbits/common/widgets/youtube-player/youtubePlayerModel";


@Component({
    selector: "paperbits-youtube-player",
    template: template
})
export class YoutubePlayerViewModel {
    public videoId: KnockoutObservable<string>;

    constructor() {
        this.videoId = ko.observable<string>();
    }
}