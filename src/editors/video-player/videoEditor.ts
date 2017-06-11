import * as ko from "knockout";
import { IWidgetEditor } from '@paperbits/common/widgets/IWidgetEditor';
import { IMedia } from '@paperbits/common/media/IMedia';
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { VideoPlayerModel } from "@paperbits/common/widgets/models/videoPlayerModel";

export class VideoEditor implements IWidgetEditor {
    private video: VideoPlayerModel;
    private readonly viewManager: IViewManager;

    private applyChangesCallback: () => void;

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
    }

    private onControlsUpdate(controls: boolean): void {
        this.video.controls = controls;
        this.applyChangesCallback();
    }

    private onAutoplayUpdate(autoplay: boolean): void {
        this.video.autoplay = autoplay;
        this.applyChangesCallback();
    }

    private onSourceUrlUpdate(sourceUrl: string): void {
        this.video.sourceUrl = sourceUrl;
        this.applyChangesCallback();
    }

    public setWidgetModel(video: VideoPlayerModel, applyChangesCallback?: () => void): void {
        this.video = video;
        this.applyChangesCallback = applyChangesCallback;
        this.sourceUrl(video.sourceUrl);
        this.controls(video.controls);
        this.autoplay(video.autoplay);
    }

    public uploadMedia(): void {
        // this.viewManager.openUploadDialog(this.onMediaUploaded);
    }

    private onMediaUploaded(media: IMedia): void {
        //this.sourceUrl(media.content);
    }
}