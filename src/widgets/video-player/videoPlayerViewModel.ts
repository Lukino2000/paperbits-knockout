import * as ko from "knockout";
import { VideoPlayerModel } from "@paperbits/common/widgets/models/videoPlayerModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";

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