import * as ko from "knockout";
import { IBackground } from "@paperbits/common/ui/IBackground";
import { IWidgetOrder } from '@paperbits/common/editing/IWidgetOrder';
import { IWidgetFactoryResult } from '@paperbits/common/editing/IWidgetFactoryResult';

export class DropBucketItem {
    public title: string | KnockoutObservable<string>;
    public description: string;
    public previewUrl: KnockoutObservable<string>;
    public thumbnailUrl: KnockoutObservable<string>;
    public widgetOrder: KnockoutObservable<IWidgetOrder>;
    public uploadables: KnockoutObservableArray<File | string>;
    public uploadablesPending: Promise<any>;
    public widgetFactoryResult: IWidgetFactoryResult;
    public background: KnockoutObservable<IBackground>;

    constructor() {
        this.title = null;
        this.description = null;
        this.previewUrl = ko.observable<string>();
        this.thumbnailUrl = ko.observable<string>();
        this.uploadables = ko.observableArray<File | string>();
        this.widgetOrder = ko.observable<IWidgetOrder>();

        this.background = ko.computed<IBackground>(() => {
            return {
                imageUrl: this.thumbnailUrl()
            }
        });

    }
}