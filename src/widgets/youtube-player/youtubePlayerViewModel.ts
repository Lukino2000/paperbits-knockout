import * as ko from "knockout";
import * as template from "./youtube.html";
import { Component } from "../../decorators/component";
import { IWidgetModel } from "@paperbits/common/editing/IWidgetModel";
import { YoutubePlayerModel } from "@paperbits/common/widgets/models/youtubePlayerModel";


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

    public attachToModel(model: YoutubePlayerModel): void {
        this.videoId(model.videoId);
    }
}