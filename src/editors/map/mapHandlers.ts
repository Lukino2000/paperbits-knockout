import * as ko from "knockout";
import * as Utils from '@paperbits/common/utils';
import { MapModelBinder } from "@paperbits/common/widgets/map/mapModelBinder";
import { IWidgetBinding } from "@paperbits/common/editing/IWidgetBinding";
import { MapViewModel } from "../../widgets/map/mapViewModel";
import { IWidgetOrder } from '@paperbits/common/editing/IWidgetOrder';
import { IContentDropHandler } from '@paperbits/common/editing/IContentDropHandler';
import { IContentDescriptor } from '@paperbits/common/editing/IContentDescriptor';
import { IDataTransfer } from '@paperbits/common/editing/IDataTransfer';
import { IWidgetHandler } from '@paperbits/common/editing/IWidgetHandler';
import { IWidgetFactoryResult } from '@paperbits/common/editing/IWidgetFactoryResult';
import { ISettingsProvider, Settings } from '@paperbits/common/configuration/ISettingsProvider';
import { MapContract } from "@paperbits/common/widgets/map/mapContract";
import * as GoogleMapsLoader from "google-maps";


export class MapHandlers implements IWidgetHandler, IContentDropHandler {
    private readonly settingsProvider: ISettingsProvider;
    private readonly mapModelBinder: MapModelBinder;
    private googleMapsKey: string;

    constructor(settingsProvider: ISettingsProvider, mapModelBinder: MapModelBinder) {
        this.settingsProvider = settingsProvider;
        this.mapModelBinder = mapModelBinder;

        this.init();
    }

    private async init(): Promise<void> {
        let config = await this.settingsProvider.getSetting(Settings.Config.GMaps);

        this.load(config["apiKey"]);

        // this.settingsProvider.addSettingChangeListener(Settings.Config.GMaps, config => {
        //     GoogleMapsLoader.release(() => { this.load(config["apiKey"]); });
        // });
    }

    private load(apiKey: string) {
        this.googleMapsKey = apiKey;

        let proxy: any = GoogleMapsLoader;
        proxy.KEY = this.googleMapsKey;
        proxy.load();
    }

    private async prepareWidgetOrder(config: MapContract): Promise<IWidgetOrder> {
        let model = await this.mapModelBinder.nodeToModel(config);

        let factoryFunction: () => IWidgetFactoryResult = () => {
            throw "Not implemented.";

            // let widgetModel = await this.mapModelBinder.modelToWidgetModel(model);
            // let htmlElement = document.createElement("widget");
            // htmlElement.style.width = "150px";
            // htmlElement.style.height = "100px";
            // ko.applyBindingsToNode(htmlElement, { widget: widgetModel })
            // htmlElement["attachedModel"] = widgetModel.model;
            // return { element: htmlElement };
        }

        let widgetOrder: IWidgetOrder = {
            name: "map",
            displayName: "Map",
            iconClass: "paperbits-m-location",
            createWidget: factoryFunction,
            createModel: () => {
                return model;
            }
        }

        return widgetOrder;
    }

    private async  getWidgetOrderByConfig(location: string): Promise<IWidgetOrder> {
        let config: MapContract = {
            kind: "block",
            type: "map",
            location: location,
        }
        return await this.prepareWidgetOrder(config);
    }

    public getWidgetOrder(): Promise<IWidgetOrder> {
        return Promise.resolve(this.getWidgetOrderByConfig("Seattle, WA"));
    }

    public getContentDescriptorFromDataTransfer(dataTransfer: IDataTransfer): IContentDescriptor {
        let mapConfig = this.parseDataTransfer(dataTransfer);

        if (!mapConfig) {
            return null;
        }

        let getThumbnailPromise = () => Promise.resolve(`https://maps.googleapis.com/maps/api/staticmap?center=${mapConfig.location}&format=jpg&size=130x90&key=${this.googleMapsKey}`);

        var descriptor: IContentDescriptor = {
            title: "Map",
            description: mapConfig.location,
            getWidgetOrder: () => Promise.resolve(this.getWidgetOrderByConfig(mapConfig.location)),
            getThumbnailUrl: getThumbnailPromise
        };

        return descriptor;
    }

    private parseDataTransfer(dataTransfer: IDataTransfer): MapContract {
        let source = dataTransfer.source;

        if (source && typeof source === "string") {
            let url = source.toLowerCase();

            if (url.startsWith("https://www.google.com/maps/") || url.startsWith("http://www.google.com/maps/")) {
                var location: string;
                var match = new RegExp("/place/([^/]+)").exec(url);

                if (match && match.length > 1) {
                    location = match[1].replaceAll("+", " ");
                }
                else {
                    match = new RegExp("/@([^/]+)").exec(url);
                    if (match && match.length > 1) {
                        var locationParts = match[1].split(",");
                        location = locationParts.slice(0, 2).join(",");
                    }
                }

                return location ? { location: location, kind: "map" } : null;
            }
        }

        return null;
    }
}