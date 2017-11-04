import * as ko from "knockout";
import template from "./sectionEditor.html";
import { IMedia } from "@paperbits/common/media/IMedia";
import * as Utils from '@paperbits/common/core/utils';
import { SectionViewModel } from "../../widgets/section/sectionViewModel";
import { IMediaService } from '@paperbits/common/media/IMediaService';
import { ICreatedMedia } from '@paperbits/common/media/ICreatedMedia';
import { IPermalink } from '@paperbits/common/permalinks/IPermalink';
import { IPermalinkService } from '@paperbits/common/permalinks/IPermalinkService';
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { IWidgetEditor } from '@paperbits/common/widgets/IWidgetEditor';
import { SectionModel } from "@paperbits/common/widgets/section/sectionModel";
import { IEventManager } from '@paperbits/common/events/IEventManager';
import { Component } from "../../decorators/component";
import { BackgroundModel } from "@paperbits/common/widgets/background/backgroundModel";


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
    public readonly backgroundColorKey: KnockoutObservable<string>;
    public readonly backgroundRepeat: KnockoutObservable<string>;
    public readonly backgroundSourceType: KnockoutObservable<string>;
    public readonly background: KnockoutObservable<BackgroundModel>;


    constructor(private viewManager: IViewManager) {
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

        this.backgroundColorKey = ko.observable<string>();
        this.backgroundColorKey.subscribe(this.onChange.bind(this));

        this.backgroundRepeat = ko.observable<string>();
        this.backgroundRepeat.subscribe(this.onChange.bind(this));

        this.background = ko.observable<BackgroundModel>();
        this.backgroundSourceType = ko.observable<string>();
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

        this.section.background.colorKey = this.backgroundColorKey();
        this.section.background.size = this.backgroundSize();
        this.section.background.position = this.backgroundPosition();
        this.section.background.repeat = this.backgroundRepeat();

        this.background.valueHasMutated();
        this.applyChangesCallback();
    }

    public onMediaSelected(media: IMedia): void {
        this.section.background.sourceKey = media.permalinkKey;
        this.section.background.sourceUrl = media.downloadUrl;

        this.background.valueHasMutated();
        this.applyChangesCallback();
    }

    public clearBackground(): void {
        this.section.background.sourceKey = null;
        this.section.background.sourceUrl = null;
        this.section.background.sourceType = "none";

        this.backgroundSourceType("none");
        this.background.valueHasMutated();
        this.applyChangesCallback();
    }

    public setPictureBackground(): void {
        this.section.background.sourceKey = null;
        this.section.background.sourceUrl = null;
        this.section.background.sourceType = "picture";

        this.backgroundSourceType("picture");
        this.background.valueHasMutated();

        this.applyChangesCallback();
    }

    public setWidgetModel(section: SectionModel, applyChangesCallback?: () => void): void {
        this.section = section;

        this.layout(this.section.layout);
        this.padding(this.section.padding);
        this.snap(this.section.snap);
        this.backgroundColorKey(this.section.background.colorKey);
        this.backgroundPosition(this.section.background.position);
        this.backgroundSize(this.section.background.size);
        this.backgroundSourceType(this.section.background.sourceType);
        this.backgroundRepeat(this.section.background.repeat);

        this.background(this.section.background);
        this.applyChangesCallback = applyChangesCallback;
    }

    public comingSoon(): void {
        alert("This feature is coming soon!");
    }

    public closeEditor(): void {
        this.viewManager.closeWidgetEditor();
    }
}
