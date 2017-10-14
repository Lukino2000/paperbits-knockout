import * as ko from "knockout";
import { IMedia } from "@paperbits/common/media/IMedia";
import { IWidgetOrder } from '@paperbits/common/editing/IWidgetOrder';

export class MediaItem {
    public key: string;
    public permalinkKey?: string;
    public widgetOrder: IWidgetOrder;
    public element: HTMLElement;

    public hasFocus: KnockoutObservable<boolean>;
    public downloadUrl: KnockoutObservable<string>;


    public permalinkUrl: KnockoutObservable<string>;
    public fileName: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public keywords: KnockoutObservable<string>;
    public contentType: KnockoutObservable<string>;

    constructor(media: IMedia) {
        this.permalinkKey = media.permalinkKey;

        this.key = media.key;
        this.permalinkUrl = ko.observable<string>();
        this.fileName = ko.observable<string>(media.filename);
        this.description = ko.observable<string>(media.description);
        this.keywords = ko.observable<string>(media.keywords);
        this.contentType = ko.observable<string>(media.contentType);
        this.hasFocus = ko.observable<boolean>();
        this.downloadUrl = ko.observable<string>(media.downloadUrl);
    }

    toMedia(): IMedia {
        return {
            key: this.key,
            filename: this.fileName(),
            description: this.description(),
            keywords: this.keywords(),
            contentType: this.contentType(),
            downloadUrl: this.downloadUrl(),
            permalinkKey: this.permalinkKey
        }
    }
}