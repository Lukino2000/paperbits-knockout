import * as ko from "knockout";
import template from "./mediaSelector.html";
import * as Utils from "@paperbits/common/utils";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { MediaItem } from "./mediaItem";
import { MediaContract } from '@paperbits/common/media/mediaContract';
import { IPermalink } from '@paperbits/common/permalinks/IPermalink';
import { IPermalinkService } from '@paperbits/common/permalinks/IPermalinkService';
import { IMediaService } from '@paperbits/common/media/IMediaService';
import { Component } from "../../decorators/component";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { IMediaFilter } from "@paperbits/common/media/IMediaFilter";


@Component({
    selector: "media-selector",
    template: template,
    injectable: "mediaSelector"
})
export class MediaSelector implements IResourceSelector<MediaContract> {
    private readonly mediaService: IMediaService;
    private readonly permalinkService: IPermalinkService;
    private readonly viewManager: IViewManager;
    private readonly onMediaSelected: (media: MediaContract) => void;
    private readonly mediaFilter: IMediaFilter;

    public readonly searchPattern: KnockoutObservable<string>;
    public readonly mediaItems: KnockoutObservableArray<MediaItem>;
    public readonly working: KnockoutObservable<boolean>;

    public selectedMediaItem: KnockoutObservable<MediaItem>;

    public onResourceSelected: (media: MediaContract) => void;

    constructor(mediaService: IMediaService, permalinkService: IPermalinkService, viewManager: IViewManager, onSelect: (media: MediaContract) => void, mediaFilter:IMediaFilter) {
        this.mediaService = mediaService;
        this.permalinkService = permalinkService;
        this.viewManager = viewManager;
        this.mediaFilter = mediaFilter;

        this.selectMedia = this.selectMedia.bind(this);
        this.mediaItems = ko.observableArray<MediaItem>();
        this.selectedMediaItem = ko.observable<MediaItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchMedia);
        this.working = ko.observable(true);

        this.onResourceSelected = onSelect;


        // setting up...
        this.mediaItems = ko.observableArray<MediaItem>();
        this.selectedMediaItem = ko.observable<MediaItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchMedia);
        this.working = ko.observable(true);

        this.searchMedia();
    }

    public async searchMedia(searchPattern: string = ""): Promise<void> {
        this.working(true);
        let mediaFiles
        if(this.mediaFilter) {
            mediaFiles = await this.mediaService.searchByProperties(this.mediaFilter.propertyNames, this.mediaFilter.propertyValue, this.mediaFilter.startSearch);
        } else {
            mediaFiles = await this.mediaService.search(searchPattern);
        }
        let mediaItems = mediaFiles.map(media => new MediaItem(media));
        this.mediaItems(mediaItems);
        this.working(false);
    }

    public async selectMedia(media: MediaItem): Promise<void> {
        this.selectedMediaItem(media);

        if (this.onResourceSelected) {
            this.onResourceSelected(media.toMedia());
        }
    }

    private onMediaUploaded(): void {
        this.searchMedia();
    }

    public async uploadMedia(): Promise<void> {
        const files = await this.viewManager.openUploadDialog();

        this.working(true);

        const uploadPromises = [];

        for (var index = 0; index < files.length; index++) {
            const file = files[index];
            const content = await Utils.readFileAsByteArray(file);
            const uploadPromise = this.mediaService.createMedia(file.name, content, file.type);

            this.viewManager.addPromiseProgressIndicator(uploadPromise, "Media library", `Uploading ${file.name}...`);
            uploadPromises.push(uploadPromise);
        }

        await Promise.all(uploadPromises);
        await this.searchMedia();
        this.working(false);
    }
}