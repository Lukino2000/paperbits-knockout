import * as ko from "knockout";
import template from "./audioEditor.html";
import { AudioPlayerViewModel } from "../../widgets/audio-player/audioViewModel";
import { IWidgetEditor } from '@paperbits/common/widgets/IWidgetEditor';
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { MediaContract } from '@paperbits/common/media/mediaContract';
import { Component } from "../../decorators/component";


@Component({
    selector: "paperbits-audio-player-editor",
    template: template,
    injectable: "audioPlayerEditor"
})
export class AudioEditor implements IWidgetEditor {
    private audio: KnockoutObservable<AudioPlayerViewModel>;
    private readonly viewManager: IViewManager;

    public sourceUrl: KnockoutObservable<string>;
    public controls: KnockoutObservable<boolean>;
    public autoplay: KnockoutObservable<boolean>;

    constructor(viewManager: IViewManager) {
        this.viewManager = viewManager;

        this.onSourceUrlUpdate = this.onSourceUrlUpdate.bind(this);
        this.onControlsUpdate = this.onControlsUpdate.bind(this);
        this.onAutoplayUpdate = this.onAutoplayUpdate.bind(this);
        this.uploadMedia = this.uploadMedia.bind(this);
        this.onMediaUploaded = this.onMediaUploaded.bind(this);

        this.sourceUrl = ko.observable<string>();
        this.sourceUrl.subscribe(this.onSourceUrlUpdate);

        this.controls = ko.observable<boolean>(true);
        this.controls.subscribe(this.onControlsUpdate);

        this.autoplay = ko.observable<boolean>(false);
        this.autoplay.subscribe(this.onAutoplayUpdate);

        this.audio = ko.observable<AudioPlayerViewModel>();
    }

    private onControlsUpdate(controls: boolean): void {
        this.audio().controls(controls ? true : null);
    }

    private onAutoplayUpdate(autoplay: boolean): void {
        this.audio().autoplay(autoplay ? true : null);
    }

    private onSourceUrlUpdate(sourceUrl: string): void {
        this.audio().sourceUrl(sourceUrl);
    }

    public setWidgetModel(audio: AudioPlayerViewModel): void {
        this.audio(audio);
        this.sourceUrl(audio.sourceUrl());
        this.controls(audio.controls())
        this.autoplay(audio.autoplay())
    }

    public uploadMedia(): void {
        //this.viewManager.openUploadDialog(this.onMediaUploaded);
    }

    private onMediaUploaded(media: MediaContract): void {
        //this.sourceUrl(media.content);
    }
}