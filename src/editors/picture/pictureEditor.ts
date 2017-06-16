import * as ko from "knockout";
import * as template from "./pictureEditor.html";
import * as Utils from '@paperbits/common/core/utils';
import { IBackground } from "@paperbits/common/ui/IBackground";
import { IMediaService } from '@paperbits/common/media/IMediaService';
import { ICreatedMedia } from '@paperbits/common/media/ICreatedMedia';
import { IPermalink } from '@paperbits/common/permalinks/IPermalink';
import { IPermalinkService } from '@paperbits/common/permalinks/IPermalinkService';
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { IWidgetEditor } from '@paperbits/common/widgets/IWidgetEditor';
import { PictureModel } from "@paperbits/common/widgets/models/pictureModel";
import { IEventManager } from '@paperbits/common/events/IEventManager';
import { IMedia } from "@paperbits/common/media/IMedia";
import { Component } from "../../decorators/component";


@Component({
    selector: "picture-editor-editor",
    template: template,
    injectable: "pictureEditor"
})
export class PictureEditor implements IWidgetEditor {
    private picture: PictureModel;
    private applyChangesCallback: () => void;

    public readonly sourceUrl: KnockoutObservable<string>;
    public readonly caption: KnockoutObservable<string>;
    public readonly action: KnockoutObservable<string>;
    public readonly layout: KnockoutObservable<string>;
    public readonly animation: KnockoutObservable<string>;
    public readonly background: KnockoutComputed<IBackground>;

    constructor() {
        this.onSourceUrlUpdate = this.onSourceUrlUpdate.bind(this);
        this.onCaptionUpdate = this.onCaptionUpdate.bind(this);
        this.onLayoutUpdate = this.onLayoutUpdate.bind(this);
        this.onAnimationUpdate = this.onAnimationUpdate.bind(this);
        this.onMediaSelected = this.onMediaSelected.bind(this);

        this.sourceUrl = ko.observable<string>();
        this.sourceUrl.subscribe(this.onSourceUrlUpdate);

        this.caption = ko.observable<string>();
        this.caption.subscribe(this.onCaptionUpdate);

        this.action = ko.observable<string>();
        this.layout = ko.observable<string>();
        this.layout.subscribe(this.onLayoutUpdate);

        this.animation = ko.observable<string>();
        this.animation.subscribe(this.onAnimationUpdate);

        this.background = ko.computed<IBackground>(() => {
            return {
                imageUrl: this.sourceUrl(),
                // position?: string;
                // repeat?: string;
                // color?: string;
                // size: this.backgroundSize()
            };
        });
    }

    private onCaptionUpdate(caption: string): void {
        this.picture.caption = caption;
        this.applyChangesCallback();
    }

    private onLayoutUpdate(layout: string): void {
        this.picture.layout = layout;
        this.applyChangesCallback();
    }

    private onAnimationUpdate(layout: string): void {
        this.picture.animation = layout;
        this.applyChangesCallback();
    }

    private onSourceUrlUpdate(sourceUrl: string): void {
        this.picture.sourceUrl = sourceUrl;
        this.applyChangesCallback();
    }

    public setWidgetModel(picture: PictureModel, applyChangesCallback?: () => void): void {
        this.picture = picture;
        this.applyChangesCallback = applyChangesCallback;

        this.sourceUrl(picture.sourceUrl);
        this.caption(picture.caption);
        this.layout(picture.layout);
        this.animation(picture.animation);
    }

    public onMediaSelected(media: IMedia): void {
        this.picture.sourceKey = media.permalinkKey;
        this.sourceUrl(media.downloadUrl)

        this.applyChangesCallback();
    }
}