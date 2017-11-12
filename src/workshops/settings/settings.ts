import * as ko from "knockout";
import template from "./settings.html";
import * as Utils from '@paperbits/common/core/utils';
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { ISiteService } from '@paperbits/common/sites/ISiteService';
import { ICreatedMedia } from '@paperbits/common/media/ICreatedMedia';
import { IMediaService } from '@paperbits/common/media/IMediaService';
import { IPermalink } from '@paperbits/common/permalinks/IPermalink';
import { IPermalinkService } from '@paperbits/common/permalinks/IPermalinkService';
import { IMedia } from '@paperbits/common/media/IMedia';
import { ISiteSettings } from "@paperbits/common/sites/ISiteSettings";
import { Component } from "../../decorators/component";
import { IMediaFilter } from "@paperbits/common/media/IMediaFilter";
import { metaDataSetter } from "@paperbits/common/meta/metaDataSetter";


@Component({
    selector: "settings",
    template: template,
    injectable: "settingsWorkshop"
})
export class SettingsWorkshop {
    private readonly mediaService: IMediaService;
    private readonly permalinkService: IPermalinkService;
    private readonly siteService: ISiteService;
    private readonly viewManager: IViewManager;
    private readonly mediaFilter: IMediaFilter;

    public readonly working: KnockoutObservable<boolean>;

    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public keywords: KnockoutObservable<string>;
    public gmapsApiKey: KnockoutObservable<string>;
    public gtmContainerId: KnockoutObservable<string>;
    public intercomAppId: KnockoutObservable<string>;
    public faviconSourceKey: KnockoutObservable<string>;
    public faviconFileName: KnockoutObservable<string>;


    constructor(mediaService: IMediaService, permalinkService: IPermalinkService, siteService: ISiteService, viewManager: IViewManager) {
        // initialization...
        this.mediaService = mediaService;
        this.permalinkService = permalinkService;
        this.siteService = siteService;
        this.viewManager = viewManager;

        // rebinding...     
        this.onMediaSelected = this.onMediaSelected.bind(this);

        // setting up...
        this.working = ko.observable<boolean>();
        this.mediaFilter = {
            propertyNames: ["contentType"],
            propertyValue: metaDataSetter.iconContentType,
            startSearch: true
        };

        this.loadSettings();

        this.title = ko.observable<string>();
        this.description = ko.observable<string>();
        this.keywords = ko.observable<string>();
        this.gmapsApiKey = ko.observable<string>();
        this.gtmContainerId = ko.observable<string>();
        this.intercomAppId = ko.observable<string>();
        this.faviconSourceKey = ko.observable<string>();
        this.faviconFileName = ko.observable<string>();
    }

    private async loadSettings(): Promise<void> {
        this.working(true);

        let settings = await this.siteService.getSiteSettings();

        if (settings) {
            this.title(settings.title);
            this.description(settings.description);
            this.keywords(settings.keywords);
            this.faviconSourceKey(settings.iconPermalinkKey);
            this.setFaviconUri(settings.iconPermalinkKey);

            if (settings.config) {
                if (settings.config.googlemaps) {
                    this.gmapsApiKey(settings.config.googlemaps.apiKey);
                }
                if (settings.config.gtm) {
                    this.gtmContainerId(settings.config.gtm.containerId);
                }
                if (settings.config.intercom) {
                    this.intercomAppId(settings.config.intercom.appId);
                }
            }
        }
        this.working(false);

        this.title.subscribe(this.onSettingChange.bind(this));
        this.description.subscribe(this.onSettingChange.bind(this));
        this.keywords.subscribe(this.onSettingChange.bind(this));
        this.gmapsApiKey.subscribe(this.onSettingChange.bind(this));
        this.gtmContainerId.subscribe(this.onSettingChange.bind(this));
        this.intercomAppId.subscribe(this.onSettingChange.bind(this));
        this.faviconSourceKey.subscribe(this.onSettingChange.bind(this));
    }

    private async onSettingChange(): Promise<void> {
        let config: ISiteSettings = {
            title: this.title(),
            description: this.description(),
            keywords: this.keywords(),
            iconPermalinkKey: this.faviconSourceKey(),

            config: {
                intercom: {
                    appId: this.intercomAppId()
                },
                gtm: {
                    containerId: this.gtmContainerId(),
                    dataLayerName: this.gtmContainerId()
                },
                googlemaps: {
                    apiKey: this.gmapsApiKey()
                }
            }
        }

        await this.siteService.setSiteSettings(config);
    }

    public onMediaSelected(media: IMedia) {
        if(media) {
            this.faviconSourceKey(media.permalinkKey);            
            this.setFaviconUri(media.permalinkKey);
        } else {
            this.faviconFileName(null);
            this.faviconSourceKey(null);
        }
    }

    private async setFaviconUri(permalinkKey: string) {
        if(permalinkKey) {
            let iconPermalink = await this.permalinkService.getPermalinkByKey(permalinkKey);
            if(iconPermalink){
                this.faviconFileName(iconPermalink.uri);
                this.viewManager.loadFavIcon();
            }
        }
    }
}