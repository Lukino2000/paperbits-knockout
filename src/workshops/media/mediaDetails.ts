import * as ko from "knockout";
import template from "./mediaDetails.html";
import { IMedia } from "@paperbits/common/media/IMedia";
import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IMediaService } from "@paperbits/common/media/IMediaService";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { MediaItem } from "../../workshops/media/mediaItem";
import { Component } from "../../decorators/component";
import { Validators } from "../../validation/validators";

@Component({
    selector: "media-details-workshop",
    template: template,
    injectable: "mediaDetailsWorkshop"
})
export class MediaDetailsWorkshop {
    private readonly mediaService: IMediaService;
    private readonly permalinkService: IPermalinkService;
    private readonly viewManager: IViewManager;
    private mediaPermalink: IPermalink;

    public readonly mediaItem: MediaItem;

    constructor(mediaService: IMediaService, permalinkService: IPermalinkService, mediaItem: MediaItem, viewManager: IViewManager) {
        // initialization...
        this.mediaService = mediaService;
        this.permalinkService = permalinkService;
        this.viewManager = viewManager;
        this.mediaItem = mediaItem;

        // rebinding...
        //this.onFaviconUploaded = this.onFaviconUploaded.bind(this);
        this.deleteMedia = this.deleteMedia.bind(this);
        this.updateMetadata = this.updateMetadata.bind(this);

        Validators.initPermalinkValidation();
        this.init();
    }

    private async init(): Promise<void> {
        let permalink = await this.permalinkService.getPermalinkByKey(this.mediaItem.permalinkKey);

        this.mediaPermalink = permalink;
        this.mediaItem.permalinkUrl(permalink.uri);

        this.mediaItem.fileName.extend({required: true});
        this.mediaItem.fileName.subscribe(this.updateMetadata);
        this.mediaItem.description.subscribe(this.updateMetadata);
        this.mediaItem.keywords.subscribe(this.updateMetadata);

        Validators.setPermalinkValidatorWithUpdate(this.mediaItem.permalinkUrl, this.mediaPermalink, this.permalinkService);
    }

    private async updateMetadata(): Promise<void> {
        await this.mediaService.updateMedia(this.mediaItem.toMedia());
    }

    public async deleteMedia(): Promise<void> {
        //TODO: Show confirmation dialog according to mockup
        await this.mediaService.deleteMedia(this.mediaItem.toMedia());
        this.viewManager.notifySuccess("Media library", "File deleted");
        
        this.viewManager.closeWorkshop("media-details-workshop");
        this.viewManager.openWorkshop("media");
    }
}