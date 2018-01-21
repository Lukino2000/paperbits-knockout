import * as ko from "knockout";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { IWidgetOrder } from '@paperbits/common/editing/IWidgetOrder';
import { PictureHandlers } from "../../editors/picture/pictureHandlers";
import { IWidgetFactoryResult } from "@paperbits/common/editing/IWidgetFactoryResult";

export class MediaItem {
    public key: string;
    public permalinkKey?: string;
    public blobKey: string;
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

    constructor(mediaContract: MediaContract) {
        this.key = mediaContract.key;
        this.blobKey = mediaContract.blobKey;
        this.permalinkKey = mediaContract.permalinkKey;
        this.permalinkUrl = ko.observable<string>();
        this.fileName = ko.observable<string>(mediaContract.filename);
        this.description = ko.observable<string>(mediaContract.description);
        this.keywords = ko.observable<string>(mediaContract.keywords);
        this.contentType = ko.observable<string>(mediaContract.contentType);
        this.hasFocus = ko.observable<boolean>();
        this.downloadUrl = ko.observable<string>(mediaContract.downloadUrl);

        this.isImage = PictureHandlers.IsMediaFileImage(mediaContract);
    }

    toMedia(): MediaContract {
        return {
            key: this.key,
            blobKey: this.blobKey,
            filename: this.fileName(),
            description: this.description(),
            keywords: this.keywords(),
            contentType: this.contentType(),
            downloadUrl: this.downloadUrl(),
            permalinkKey: this.permalinkKey
        }
    }
}