import * as ko from "knockout";
import template from "./media.html";
import * as Utils from "@paperbits/common/core/utils";
import { IMediaService } from "@paperbits/common/media/IMediaService";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { IContentDropHandler } from "@paperbits/common/editing/IContentDropHandler";
import { MediaItem } from "../../workshops/media/mediaItem";
import { IMedia } from "@paperbits/common/media/IMedia";
import { ICreatedMedia } from "@paperbits/common/media/ICreatedMedia";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IWidgetOrder } from "@paperbits/common/editing/IWidgetOrder";
import { Component } from "../../decorators/component";
import { IContentDescriptor } from "@paperbits/common/editing/IContentDescriptor";
import { IEventManager } from "@paperbits/common/events/IEventManager";

const DeleteKeyCode = 46; // TODO: Move to separate file;


@Component({
    selector: "media",
    template: template,
    injectable: "mediaWorkshop"
})
export class MediaWorkshop {
    private readonly eventManager: IEventManager;
    private readonly mediaService: IMediaService;
    private readonly permalinkService: IPermalinkService;
    private readonly viewManager: IViewManager;
    private dropHandlers: Array<IContentDropHandler>; // TODO: Switch to IWidgetHandlers
    private searchTimeout: any;

    public searchPattern: KnockoutObservable<string>;
    public mediaItems: KnockoutObservableArray<MediaItem>;
    public selectedMediaItem: KnockoutObservable<MediaItem>;
    public readonly working: KnockoutObservable<boolean>;

    constructor(eventManager: IEventManager, mediaService: IMediaService, permalinkService: IPermalinkService, viewManager: IViewManager, dropHandlers: Array<IContentDropHandler>) {
        // initialization...
        this.eventManager = eventManager;
        this.mediaService = mediaService;
        this.permalinkService = permalinkService;
        this.viewManager = viewManager;
        this.dropHandlers = dropHandlers;

        // rebinding...
        //this.onFaviconUploaded = this.onFaviconUploaded.bind(this);
        this.searchMedia = this.searchMedia.bind(this);
        this.uploadMedia = this.uploadMedia.bind(this);
        this.onMediaUploaded = this.onMediaUploaded.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.selectMedia = this.selectMedia.bind(this);

        // setting up...
        this.working = ko.observable(true);
        this.mediaItems = ko.observableArray<MediaItem>();
        this.searchPattern = ko.observable<string>();
        this.selectedMediaItem = ko.observable<MediaItem>();

        this.searchPattern.subscribe(this.searchMedia);
        this.searchMedia();
    }

    private async launchSearch(searchPattern: string = ""): Promise<void> {
        this.working(true);

        var drophandlers = this.dropHandlers;
        var result: Array<MediaItem> = [];
        this.mediaItems(result);

        let mediaFiles = await this.mediaService.search(searchPattern);

        mediaFiles.forEach(async media => {            
            
            //TODO: Move this logic to drag start. MediaItem can get descriptor byitself;
            
            let mediaItem = new MediaItem(media);

            let descriptor = this.findContentDescriptor(media);
            if (descriptor && descriptor.getWidgetOrder) {
                let order = await descriptor.getWidgetOrder();
                mediaItem.widgetOrder = order;
            }
            
            this.mediaItems.push(mediaItem);
        });

        this.working(false);
    }

    private findContentDescriptor(media: IMedia): IContentDescriptor {
        let result: IContentDescriptor;
        for (var i = 0; i < this.dropHandlers.length; i++) {
            let handler = this.dropHandlers[i];

            if (!handler.getContentDescriptorFromMedia) {
                continue;
            }

            result = handler.getContentDescriptorFromMedia(media);

            if (result) {
                return result;
            }
        }
        return result;
    }

    public async searchMedia(searchPattern: string = ""): Promise<void> {
        clearTimeout(this.searchTimeout);

        this.searchTimeout = setTimeout(() => {
            this.launchSearch(searchPattern);
        }, 600);
    }

    private onMediaUploaded(): void {
        this.searchMedia();
    }

    public async uploadMedia(): Promise<void> {
        const files = await this.viewManager.openUploadDialog();

        this.working(true);

        let uploadPromises = [];

        for (var index = 0; index < files.length; index++) {
            let file = files[index];
            let content = await Utils.readFileAsByteArray(file);
            let uploadPromise = this.mediaService.createMedia(file.name, content, file.type);

            this.viewManager.addPromiseProgressIndicator(uploadPromise, "Media library", `Uploading ${file.name}...`);
            uploadPromises.push(uploadPromise);

        }

        await Promise.all(uploadPromises);
        await this.searchMedia();
        this.working(false);
    }

    public selectMedia(mediaItem: MediaItem): void {
        mediaItem.hasFocus(true);
        this.selectedMediaItem(mediaItem);
        this.viewManager.openWorkshop("media-details-workshop", mediaItem);
    }

    public onDragStart(item: MediaItem): HTMLElement {
        item.widgetFactoryResult = item.widgetOrder.createWidget();

        const widgetElement = item.widgetFactoryResult.element;
        const widgetModel = item.widgetFactoryResult.widgetModel;
        const widgetBinding = item.widgetFactoryResult.widgetBinding;

        this.viewManager.beginDrag({
            type: "widget",
            sourceModel: widgetModel,
            sourceBinding: widgetBinding
        });

        return widgetElement;
    }

    public onDragEnd(item: MediaItem): void {
        item.widgetFactoryResult.element.remove();
        const dragSession = this.viewManager.getDragSession();
        const acceptorBinding = dragSession.targetBinding;

        acceptorBinding.onDragDrop(dragSession);

        this.eventManager.dispatchEvent("virtualDragEnd");
    }
}