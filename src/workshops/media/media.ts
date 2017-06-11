import * as ko from "knockout";
import * as Utils from "@paperbits/common/core/utils";
import { IMediaService } from "@paperbits/common/media/IMediaService";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { IContentDropHandler } from "@paperbits/common/editing/IContentDropHandler";
import { MediaItem } from "../../workshops/media/mediaItem";
import { IMedia } from "@paperbits/common/media/IMedia";
import { ICreatedMedia } from "@paperbits/common/media/ICreatedMedia";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IWidgetOrder } from "@paperbits/common/editing/IWidgetOrder";
import { LayoutEditor } from "../../editors/layout/layoutEditor";

const DeleteKeyCode = 46; // TODO: Move to separate file;

export class MediaWorkshop {
    private readonly mediaService: IMediaService;
    private readonly permalinkService: IPermalinkService;
    private readonly viewManager: IViewManager;
    private layoutEditor: LayoutEditor; //TODO: Review usage and remove;
    private dropHandlers: Array<IContentDropHandler>; // TODO: Switch to IWidgetHandlers

    public searchPattern: KnockoutObservable<string>;
    public mediaItems: KnockoutObservableArray<MediaItem>;
    public selectedMediaItem: KnockoutObservable<MediaItem>;
    public readonly working: KnockoutObservable<boolean>;

    constructor(mediaService: IMediaService, permalinkService: IPermalinkService, viewManager: IViewManager, layoutEditor: LayoutEditor, dropHandlers: Array<IContentDropHandler>) {
        // initialization...
        this.mediaService = mediaService;
        this.permalinkService = permalinkService;
        this.viewManager = viewManager;
        this.layoutEditor = layoutEditor;
        this.dropHandlers = dropHandlers;

        // rebinding...
        //this.onFaviconUploaded = this.onFaviconUploaded.bind(this);
        this.searchMedia = this.searchMedia.bind(this);
        this.uploadMedia = this.uploadMedia.bind(this);
        this.onMediaUploaded = this.onMediaUploaded.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.selectMedia = this.selectMedia.bind(this);
        this.keydown = this.keydown.bind(this);

        // setting up...
        this.working = ko.observable(true);
        this.mediaItems = ko.observableArray<MediaItem>();
        this.searchPattern = ko.observable<string>();
        this.selectedMediaItem = ko.observable<MediaItem>();

        this.searchPattern.subscribe(this.searchMedia);
        this.searchMedia();
    }

    public async searchMedia(searchPattern: string = ""): Promise<void> {
        this.working(true);

        var drophandlers = this.dropHandlers;
        var result: Array<MediaItem> = [];
        this.mediaItems(result);

        let mediaFiles = await this.mediaService.search(searchPattern);

        mediaFiles.forEach(async media => {
            for (var i = 0; i < drophandlers.length; i++) {
                let handler = drophandlers[i];

                if (!handler.getContentDescriptorFromMedia) {
                    continue;
                }

                let descriptor = handler.getContentDescriptorFromMedia(media);

                //TODO: Move this logic to drag start. MediaItem can get descriptor byitself;

                if (descriptor && descriptor.getWidgetOrder) {
                    let order = await descriptor.getWidgetOrder();
                    var mediaItem = new MediaItem(media);
                    mediaItem.widgetOrder = order;
                    this.mediaItems.push(mediaItem);
                }
            }
        });

        this.working(false);
    }

    private onMediaUploaded(): void {
        this.searchMedia();
    }

    public async uploadMedia(): Promise<void> {
        let files = await this.viewManager.openUploadDialog();

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

    public async deleteMedia(): Promise<void> {
        // TODO: Ask for confirmation.
        this.working(true);
        await this.mediaService.deleteMedia(this.selectedMediaItem().media);
        this.selectedMediaItem(null);
        await this.searchMedia();

        this.viewManager.notifySuccess("Media library", "File deleted");
        this.working(false);
    }

    public selectMedia(mediaItem: MediaItem): void {
        mediaItem.hasFocus(true);
        this.selectedMediaItem(mediaItem);
    }

    public onDragStart(item: MediaItem): HTMLElement {
        this.viewManager.foldEverything();
        var widgetElement = item.widgetOrder.createWidget().element;
        item.element = widgetElement;
        return widgetElement;
    }

    public onDragEnd(item: MediaItem): void {
        this.layoutEditor.onWidgetDragEnd(item, item.element);
    }

    public keydown(item: MediaItem, event: KeyboardEvent): void {
        if (event.keyCode === DeleteKeyCode) {
            this.deleteMedia();
        }
    }
}