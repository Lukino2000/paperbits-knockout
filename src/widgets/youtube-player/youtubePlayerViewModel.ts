import * as ko from "knockout";


export class YoutubePlayerViewModel {
    public videoId: KnockoutObservable<string>;

    constructor() {
        this.videoId = ko.observable<string>();
    }
}