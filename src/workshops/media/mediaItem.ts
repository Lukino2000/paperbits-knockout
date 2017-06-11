import * as ko from "knockout";
import { IMedia } from "@paperbits/common/media/IMedia";
import { IWidgetOrder } from '@paperbits/common/editing/IWidgetOrder';

export class MediaItem {
    public media: IMedia;
    public widgetOrder: IWidgetOrder;
    public element: HTMLElement;
    public hasFocus: KnockoutObservable<boolean>;

    constructor(media: IMedia) {
        this.media = media;
        this.hasFocus = ko.observable<boolean>();
    }
}