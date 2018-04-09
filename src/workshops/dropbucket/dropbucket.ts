﻿import * as ko from "knockout";
import template from "./dropbucket.html";
import * as Utils from "@paperbits/common/utils";
import { IViewManager, ViewManagerMode } from "@paperbits/common/ui";
import { IEventManager, GlobalEventHandler } from "@paperbits/common/events";
import { IHttpClient } from "@paperbits/common/http";
import { IMediaService, ICreatedMedia  } from "@paperbits/common/media";
import { IWidgetOrder, IContentDropHandler, IContentDescriptor, IDataTransfer } from "@paperbits/common/editing";
import { ProgressPromise } from "@paperbits/common";
import { DropBucketItem } from "../../workshops/dropbucket/dropbucketItem";
import { Component } from "../../decorators/component";

/*
   - Drop bucket introduces a special container for dropping content,
     which, if supported, could be picked up by a widget;

   - If dropped content is supported by several widgets (i.e. Bing and Google maps), user will be able to choose;
   
   - All KNOWN content is dragged only from Vienna UI with attached context;
   
   - Widget/Content handler registrations should be injected in respective order;
*/

@Component({
    selector: "dropbucket",
    template: template,
    injectable: "dropbucket"
})
export class DropBucket {
    private readonly eventManager: IEventManager;
    private readonly dropHandlers: Array<IContentDropHandler>;
    private readonly mediaService: IMediaService;
    private readonly viewManager: IViewManager;
    private readonly httpClient: IHttpClient;

    public droppedItems: KnockoutObservableArray<DropBucketItem>;

    constructor(globalEventHandler: GlobalEventHandler, eventManager: IEventManager, mediaService: IMediaService, dropHandlers: Array<IContentDropHandler>, viewManager: IViewManager, httpClient: IHttpClient) {
        this.eventManager = eventManager;
        this.mediaService = mediaService;
        this.viewManager = viewManager;
        this.httpClient = httpClient;

        this.onDragDrop = this.onDragDrop.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onPaste = this.onPaste.bind(this);
        this.addPendingContent = this.addPendingContent.bind(this);
        this.uploadContentAsMedia = this.uploadContentAsMedia.bind(this);
        this.discardDroppedContent = this.discardDroppedContent.bind(this);
        this.handleDroppedContent = this.handleDroppedContent.bind(this);
        this.handleUnknownContent = this.handleUnknownContent.bind(this);

        globalEventHandler.addDragDropListener(this.onDragDrop);
        // globalEventHandler.addPasteListener(this.onPaste);

        this.dropHandlers = dropHandlers;
        this.droppedItems = ko.observableArray<DropBucketItem>();
    }

    private canHandleDrop(event: DragEvent): boolean {
        return (event.dataTransfer.files && event.dataTransfer.files.length > 0) || event.dataTransfer.getData("url").length > 0;
    }

    private addPendingContent(item: DropBucketItem): void {
        this.droppedItems.push(item);
    }

    private async handleDroppedContent(contentDescriptor: IContentDescriptor): Promise<void> {
        var dropbucketItem = new DropBucketItem();

        dropbucketItem.title = contentDescriptor.title;
        dropbucketItem.description = contentDescriptor.description;

        if (contentDescriptor.getWidgetOrder) {
            let widgetOrder = await contentDescriptor.getWidgetOrder();
            dropbucketItem.widgetOrder(widgetOrder);
        }

        dropbucketItem.thumbnailUrl(contentDescriptor.iconUrl);

        if (contentDescriptor.getThumbnailUrl) {
            contentDescriptor.getThumbnailUrl().then(thumbnailUrl => {
                dropbucketItem.previewUrl(thumbnailUrl);
                dropbucketItem.thumbnailUrl(thumbnailUrl);
            });
        }

        if (contentDescriptor.uploadables && contentDescriptor.uploadables.length) {
            for (var i = 0; i < contentDescriptor.uploadables.length; i++) {
                var uploadable = contentDescriptor.uploadables[i];
                dropbucketItem.uploadables.push(uploadable);
            }
        }

        this.addPendingContent(dropbucketItem);
    }

    private onDragDrop(event: DragEvent): void {
        if (!this.canHandleDrop(event)) {
            return;
        }

        this.droppedItems.removeAll();

        var dataTransfer = event.dataTransfer;
        var items: IDataTransfer[];

        if (dataTransfer.files.length > 0) {
            items = [];
            for (let i = 0; i < dataTransfer.files.length; i++) {
                items.push({
                    source: dataTransfer.files[i],
                    name: dataTransfer.files[i].name,
                    mimeType: dataTransfer.files[i].type
                });
            }
        }
        else {
            var urlData = dataTransfer.getData("url");
            var parts = urlData.split("/");

            items = [{
                source: urlData,
                name: parts[parts.length - 1]
            }];
        }

        for (let item of items) {
            var handled = false;
            var contentDescriptor: IContentDescriptor = null;
            var j = 0;

            while (contentDescriptor === null && j < this.dropHandlers.length) {
                contentDescriptor = this.dropHandlers[j].getContentDescriptorFromDataTransfer(item);

                if (contentDescriptor) {
                    this.handleDroppedContent(contentDescriptor);
                    handled = true;
                }
                j++;
            }

            if (!handled) { // none found
                this.handleUnknownContent(dataTransfer);
            }
        }
    }

    private onPaste(event: ClipboardEvent): void {
        this.droppedItems.removeAll();
        var text = event.clipboardData.getData("text");
        var i = 0;
        var contentDescriptor: IContentDescriptor = null;

        while (contentDescriptor === null && i < this.dropHandlers.length) {
            contentDescriptor = this.dropHandlers[i].getContentDescriptorFromDataTransfer({
                source: text,
                name: text.split("/").pop().split("?")[0]
            });

            if (contentDescriptor) {
                this.handleDroppedContent(contentDescriptor);
            }

            i++;
        }
    }

    private handleUnknownContent(dataTransfer: DataTransfer): void {
        var title: string;
        var description: string = "";

        if (dataTransfer.files.length > 1) {
            title = `${dataTransfer.files.length} files`;
        }
        else if (dataTransfer.files.length > 0) {
            title = "File";
            description = dataTransfer.files[0].name;
        }
        else {
            title = "Piece of text";
        }

        var dropbucketItem = new DropBucketItem();
        var uploadables = [];

        for (var i = 0; i < dataTransfer.files.length; i++) {
            uploadables.push(dataTransfer.files[i]);
        }

        dropbucketItem.title = title;
        dropbucketItem.description = description;
        dropbucketItem.uploadables(uploadables);

        this.addPendingContent(dropbucketItem);
    }

    public onDragStart(item: DropBucketItem): HTMLElement {
        item.widgetFactoryResult = item.widgetOrder().createWidget();

        const widgetElement = item.widgetFactoryResult.element;
        const widgetModel = item.widgetFactoryResult.widgetModel;
        const widgetBinding = item.widgetFactoryResult.widgetBinding;

        this.droppedItems.remove(item);

        this.viewManager.beginDrag({
            type: "widget",
            sourceModel: widgetModel,
            sourceBinding: widgetBinding
        });

        return widgetElement;
    }

    public async onDragEnd(dropbucketItem: DropBucketItem): Promise<void> {
        dropbucketItem.widgetFactoryResult.element.remove();
        this.droppedItems.remove(dropbucketItem);

        const uploadables = dropbucketItem.uploadables();

        if (uploadables && uploadables.length > 0) {
            this.uploadContentAsMedia(dropbucketItem);
            this.droppedItems.remove(dropbucketItem);
        }

        const dragSession = this.viewManager.getDragSession();
        const acceptorBinding = dragSession.targetBinding;

        acceptorBinding.onDragDrop(dragSession);

        this.eventManager.dispatchEvent("virtualDragEnd");
    }

    public uploadContentAsMedia(dropbucketItem: DropBucketItem): void {
        var uploadables = dropbucketItem.uploadables();

        this.droppedItems.remove(dropbucketItem);

        uploadables.forEach(async uploadable => {
            let uploadPromise: ProgressPromise<ICreatedMedia>;

            if (typeof uploadable === "string") {
                let name = uploadable.split("/").pop().split("?")[0];

                uploadPromise = Utils
                    .downloadFile(uploadable)
                    .sequence(blob => this.mediaService.createMedia(name, blob));

                this.viewManager.addPromiseProgressIndicator(uploadPromise, "Media library", `Uploading ${uploadable}...`);
            }
            else {
                // TODO: Restore
                let content = await Utils.readFileAsByteArray(uploadable);
                uploadPromise = this.mediaService.createMedia(uploadable.name, content, uploadable.type);
                this.viewManager.addPromiseProgressIndicator(uploadPromise, "Media library", `Uploading ${uploadable.name}...`);
            }

            let onMediaUploadedCallback = dropbucketItem.widgetFactoryResult.onMediaUploadedCallback;

            if (onMediaUploadedCallback && typeof onMediaUploadedCallback === "function") {
                //VK: Called by KO binding, so 2nd argument may be an event
                uploadPromise.then(createdMedia => onMediaUploadedCallback(createdMedia));
            }
        });
    }

    public discardDroppedContent(): void {
        this.droppedItems.removeAll();
    }
}