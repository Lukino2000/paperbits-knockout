import * as ko from "knockout";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { IWidgetOrder } from '@paperbits/common/editing/IWidgetOrder';
import { PictureHandlers } from "../../editors/picture/pictureHandlers";
import { IWidgetFactoryResult } from "@paperbits/common/editing/IWidgetFactoryResult";

export class MediaItem {
    public key: string;
    public permalinkKey?: string;
    public widgetOrder: IWidgetOrder;
    public element: HTMLElement;
    public isImage: boolean;

    public hasFocus: KnockoutObservable<boolean>;
    public downloadUrl: KnockoutObservable<string>;

    public permalinkUrl: KnockoutObservable<string>;
    public fileName: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public keywords: KnockoutObservable<string>;
    public contentType: KnockoutObservable<string>;
    public widgetFactoryResult: IWidgetFactoryResult;

    constructor(media: MediaContract) {
        this.permalinkKey = media.permalinkKey;

        this.key = media.key;
        this.permalinkUrl = ko.observable<string>();
        this.fileName = ko.observable<string>(media.filename);
        this.description = ko.observable<string>(media.description);
        this.keywords = ko.observable<string>(media.keywords);
        this.contentType = ko.observable<string>(media.contentType);
        this.hasFocus = ko.observable<boolean>();
        this.downloadUrl = ko.observable<string>(media.downloadUrl);

        this.isImage = PictureHandlers.IsMediaFileImage(media);
    }

    toMedia(): MediaContract {
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