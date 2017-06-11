import * as ko from "knockout";
import { AudioPlayerModel } from "@paperbits/common/widgets/models/audioPlayerModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";

export class AudioPlayerViewModel implements IViewModelBinder {
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

    public attachToModel(model:AudioPlayerModel){
        this.sourceUrl(model.sourceUrl);
        this.sourceKey(model.sourceKey);
        this.controls(model.controls);
        this.autoplay(model.autoplay);
    }
}