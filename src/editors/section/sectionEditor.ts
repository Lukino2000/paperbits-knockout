import * as ko from "knockout";
import * as template from "./sectionEditor.html";
import { IMedia } from "@paperbits/common/media/IMedia";
import * as Utils from '@paperbits/common/core/utils';
import { IBackground } from "@paperbits/common/ui/IBackground";
import { SectionViewModel } from "../../widgets/section/sectionViewModel";
import { IMediaService } from '@paperbits/common/media/IMediaService';
import { ICreatedMedia } from '@paperbits/common/media/ICreatedMedia';
import { IPermalink } from '@paperbits/common/permalinks/IPermalink';
import { IPermalinkService } from '@paperbits/common/permalinks/IPermalinkService';
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { IWidgetEditor } from '@paperbits/common/widgets/IWidgetEditor';
import { SectionModel } from "@paperbits/common/widgets/models/sectionModel";
import { IEventManager } from '@paperbits/common/events/IEventManager';
import { Component } from "../../decorators/component";


@Component({
    selector: "layout-section-editor",
    template: template,
    injectable: "sectionEditor"
})
export class SectionEditor implements IWidgetEditor {
    private section: SectionModel;
    private applyChangesCallback: () => void;

    public readonly layout: KnockoutObservable<string>;
    public readonly padding: KnockoutObservable<string>;
    public readonly snap: KnockoutObservable<string>;
    public readonly backgroundSize: KnockoutObservable<string>;
    public readonly backgroundPosition: KnockoutObservable<string>;
    public readonly backgroundIntentionKey: KnockoutObservable<string>;
    public readonly backgroundRepeat: KnockoutObservable<string>;
    public readonly background: KnockoutObservable<IBackground>;
    public readonly backgroundType: KnockoutObservable<string>;

    constructor() {
        this.setWidgetModel = this.setWidgetModel.bind(this);
        this.onMediaSelected = this.onMediaSelected.bind(this);
        this.clearBackground = this.clearBackground.bind(this);

        this.layout = ko.observable<string>();
        this.layout.subscribe(this.onChange.bind(this));

        this.padding = ko.observable<string>();
        this.padding.subscribe(this.onChange.bind(this));

        this.snap = ko.observable<string>();
        this.snap.subscribe(this.onChange.bind(this));

        this.backgroundSize = ko.observable<string>();
        this.backgroundSize.subscribe(this.onChange.bind(this));

        this.backgroundPosition = ko.observable<string>();
        this.backgroundPosition.subscribe(this.onChange.bind(this));

        this.backgroundIntentionKey = ko.observable<string>();
        this.backgroundIntentionKey.subscribe(this.onChange.bind(this));

        this.backgroundRepeat = ko.observable<string>();
        this.backgroundRepeat.subscribe(this.onChange.bind(this));

        this.background = ko.observable<IBackground>();
        this.backgroundType = ko.observable<string>();
    }


    /**
     * Collecting changes from the editor UI and invoking callback method.
     */
    private onChange(): void {
        if (!this.applyChangesCallback) {
            return;
        }
        this.section.layout = this.layout();
        this.section.padding = this.padding();
        this.section.snap = this.snap();

        this.section.backgroundIntentionKey = this.backgroundIntentionKey();
        this.section.backgroundSize = this.backgroundSize();
        this.section.backgroundPosition = this.backgroundPosition();

        this.applyBackground();
        this.applyChangesCallback();
    }

    private applyBackground(): void {
        let background = { color: this.section.backgroundIntentionKey };

        Object.assign(background, {
            imageUrl: this.section.backgroundPictureUrl,
            position: this.backgroundPosition(),
            repeat: this.backgroundRepeat(),
            size: this.backgroundSize()
        });

        this.background(background);
        this.backgroundType(this.section.backgroundType);
    }

    public onMediaSelected(media: IMedia): void {
        this.section.backgroundSourceKey = media.permalinkKey;
        this.section.backgroundType = "picture";
        this.section.backgroundPictureUrl = media.downloadUrl;

        this.applyBackground();
        this.applyChangesCallback();
    }

    public clearBackground(): void {
        this.section.backgroundSourceKey = null;
        this.section.backgroundType = "none";
        this.section.backgroundPictureUrl = null;

        this.applyBackground();
        this.applyChangesCallback();
    }

    public setPictureBackground(): void {
        this.section.backgroundSourceKey = null;
        this.section.backgroundType = "picture";
        this.section.backgroundPictureUrl = null;

        this.applyBackground();
        this.applyChangesCallback();
    }

    public setWidgetModel(section: SectionModel, applyChangesCallback?: () => void): void {
        this.section = section;

        this.layout(this.section.layout);
        this.padding(this.section.padding);
        this.snap(this.section.snap);
        this.backgroundType(this.section.backgroundType);
        this.backgroundSize(this.section.backgroundSize);

        this.backgroundPosition(this.section.backgroundPosition);
        this.backgroundIntentionKey(this.section.backgroundIntentionKey);

        this.applyBackground();

        this.applyChangesCallback = applyChangesCallback;
    }

    public comingSoon(): void {
        alert("This feature is coming soon!");
    }
}
