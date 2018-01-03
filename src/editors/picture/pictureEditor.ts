import * as ko from "knockout";
import template from "./pictureEditor.html";
import * as Utils from '@paperbits/common/utils';
import { IMediaService } from '@paperbits/common/media/IMediaService';
import { ICreatedMedia } from '@paperbits/common/media/ICreatedMedia';
import { IPermalink } from '@paperbits/common/permalinks/IPermalink';
import { IPermalinkService } from '@paperbits/common/permalinks/IPermalinkService';
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { IWidgetEditor } from '@paperbits/common/widgets/IWidgetEditor';
import { PictureModel } from "@paperbits/common/widgets/picture/pictureModel";
import { IEventManager } from '@paperbits/common/events/IEventManager';
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { Component } from "../../decorators/component";
import { BackgroundModel } from "@paperbits/common/widgets/background/backgroundModel";


@Component({
    selector: "paperbits-picture-editor",
    template: template,
    injectable: "pictureEditor"
})
export class PictureEditor implements IWidgetEditor {
    private picture: PictureModel;
    private applyChangesCallback: () => void;

    public readonly caption: KnockoutObservable<string>;
    public readonly action: KnockoutObservable<string>;
    public readonly layout: KnockoutObservable<string>;
    public readonly animation: KnockoutObservable<string>;
    public readonly background: KnockoutObservable<BackgroundModel>;

    constructor(private viewManager: IViewManager) {
        this.onCaptionUpdate = this.onCaptionUpdate.bind(this);
        this.onLayoutUpdate = this.onLayoutUpdate.bind(this);
        this.onAnimationUpdate = this.onAnimationUpdate.bind(this);
        this.onMediaSelected = this.onMediaSelected.bind(this);

        this.caption = ko.observable<string>();
        this.caption.subscribe(this.onCaptionUpdate);

        this.action = ko.observable<string>();
        this.layout = ko.observable<string>();
        this.layout.subscribe(this.onLayoutUpdate);

        this.animation = ko.observable<string>();
        this.animation.subscribe(this.onAnimationUpdate);

        this.background = ko.observable();
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

    public setWidgetModel(picture: PictureModel, applyChangesCallback?: () => void): void {
        this.picture = picture;
        this.applyChangesCallback = applyChangesCallback;

        this.background(picture.background);
        this.caption(picture.caption);
        this.layout(picture.layout);
        this.animation(picture.animation);
    }

    public onMediaSelected(media: MediaContract): void {
        this.picture.background.sourceKey = media.permalinkKey;
        this.picture.background.sourceUrl = media.downloadUrl;

        this.background.valueHasMutated();
        this.applyChangesCallback();
    }

    public closeEditor(): void {
        this.viewManager.closeWidgetEditor();
    }
}
