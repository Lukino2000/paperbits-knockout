import * as ko from "knockout";
import * as template from "./video.html";
import { VideoPlayerModel } from "@paperbits/common/widgets/models/videoPlayerModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { Component } from "../../decorators/component";


@Component({
    selector: "paperbits-video-player",
    template: template,
    injectable: "videoPlayer"
})
export class VideoPlayerViewModel implements IViewModelBinder {
    public sourceUrl: KnockoutObservable<string>;
    public controls: KnockoutObservable<boolean>;
    public autoplay: KnockoutObservable<boolean>;

    constructor() {
        this.sourceUrl = ko.observable<string>();
        this.controls = ko.observable<boolean>();
        this.autoplay = ko.observable<boolean>();
    }

    public attachToModel(model:VideoPlayerModel){        
        this.sourceUrl(model.sourceUrl);
        this.controls(model.controls);
        this.autoplay(model.autoplay);
    }
}