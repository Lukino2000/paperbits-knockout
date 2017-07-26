import * as ko from "knockout";
import * as Utils from "@paperbits/common/core/utils";
import ILazy = Utils.ILazy;
import { ICreatedMedia } from "@paperbits/common/media/ICreatedMedia";
import { IWidgetFactoryResult } from "@paperbits/common/editing/IWidgetFactoryResult";
import { IPictureNode } from "@paperbits/common/widgets/models/IPictureNode";
import { PictureModel } from "@paperbits/common/widgets/models/pictureModel";
import { PictureModelBinder } from "@paperbits/common/widgets/pictureModelBinder";
import { IMedia } from "@paperbits/common/media/IMedia";
import { IWidgetModel } from "@paperbits/common/editing/IWidgetModel";
import { IWidgetOrder } from "@paperbits/common/editing/IWidgetOrder";
import { IContentDropHandler } from "@paperbits/common/editing/IContentDropHandler";
import { MediaHandlers } from "../../editors/mediaHandlers";
import { IWidgetHandler } from "@paperbits/common/editing/IWidgetHandler";
import { IDataTransfer } from "@paperbits/common/editing/IDataTransfer";
import { IContentDescriptor } from "@paperbits/common/editing/IContentDescriptor";
import { PromiseToDelayedComputed } from "../../core/task";

const pictureIconUrl = "data:image/svg+xml;base64,PHN2ZyBjbGFzcz0ibmMtaWNvbiBvdXRsaW5lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjQ4cHgiIGhlaWdodD0iNDhweCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjUsIDAuNSkiPgo8cG9seWxpbmUgZGF0YS1jYXA9ImJ1dHQiIGRhdGEtY29sb3I9ImNvbG9yLTIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzQ0NDQ0NCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50cz0iMiwzNCAxMiwyNiAyMiwzNCAKCTM0LDIwIDQ2LDMwICIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiPjwvcG9seWxpbmU+CjxyZWN0IHg9IjIiIHk9IjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzQ0NDQ0NCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHdpZHRoPSI0NCIgaGVpZ2h0PSI0MCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciI+PC9yZWN0Pgo8Y2lyY2xlIGRhdGEtY29sb3I9ImNvbG9yLTIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzQ0NDQ0NCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGN4PSIyMCIgY3k9IjE2IiByPSI0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIj48L2NpcmNsZT4KPC9nPjwvc3ZnPg==";

export class PictureHandlers implements IWidgetHandler, IContentDropHandler {
    private readonly pictureModelBinder: PictureModelBinder;

    constructor(pictureModelBinder: PictureModelBinder) {
        this.pictureModelBinder = pictureModelBinder;
    }

    private async prepareWidgetOrder(config: IPictureNode): Promise<IWidgetOrder> {
        let model = await this.pictureModelBinder.nodeToModel(config);

        let factoryFunction: () => IWidgetFactoryResult = () => {
            throw "Not implemented.";

            // let widgetModel = await this.pictureModelBinder.modelToWidgetModel(model);
            // let htmlElement = document.createElement("widget");
            // htmlElement.style.width = "150px";
            // ko.applyBindingsToNode(htmlElement, { widget: widgetModel })
            // htmlElement["attachedModel"] = widgetModel.model;
            // return { element: htmlElement };
        }

        let widgetOrder: IWidgetOrder = {
            title: "Picture",
            createWidget: factoryFunction,
            createModel: () => {
                return model;
            }
        }

        return widgetOrder;
    }

    private async getWidgetOrderByConfig(sourceUrl: string, caption: string): Promise<IWidgetOrder> {
        let model = new PictureModel();
        model.sourceUrl = sourceUrl;
        model.caption = caption;
        model.layout = "noframe";

        let widgetOrder: IWidgetOrder = {
            title: "Picture",
            createWidget: () => {
                throw "Not implemented.";

                // let widgetModel = await this.pictureModelBinder.modelToWidgetModel(model);
                // let htmlElement = document.createElement("widget");
                // htmlElement.style.width = "150px";

                // ko.applyBindingsToNode(htmlElement, { widget: widgetModel });
                // htmlElement["attachedModel"] = widgetModel.model;

                // return {
                //     element: htmlElement,
                //     onMediaUploadedCallback: (media: ICreatedMedia) => {
                //         model.sourceKey = media.permalink.key;
                //         model.sourceUrl = media.media.downloadUrl;
                //         widgetModel.applyChanges();
                //     }
                // }
            },
            createModel: () => {
                return model;
            }
        }

        return widgetOrder;
    }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        return await this.getWidgetOrderByConfig("http://placehold.it/800x600", "Picture");
    }

    public getContentDescriptorFromMedia(media: IMedia): IContentDescriptor {
        if (!media.filename || ![".jpg", ".jpeg", ".png", ".svg", ".gif"].some(e => media.filename.endsWith(e))) {
            return null;
        }

        let getWidgetOrderFunction: () => Promise<IWidgetOrder> = async () => {
            let config: IPictureNode = {
                kind: "block",
                type: "picture",
                sourceKey: media.permalinkKey,
                caption: media.filename,
                layout: "polaroid"
            }

            return await this.prepareWidgetOrder(config);
        }

        return {
            title: "Picture",
            description: media.description,
            getWidgetOrder: getWidgetOrderFunction
        };
    }

    public getContentDescriptorFromDataTransfer(dataTransfer: IDataTransfer): IContentDescriptor {
        if (!dataTransfer.name || ![".jpg", ".jpeg", ".png", ".svg", ".gif"].some(e => dataTransfer.name.endsWith(e))) {
            return null;
        }

        let source = dataTransfer.source;
        let droppedSourceUrl: string;

        if (source instanceof File) {
            droppedSourceUrl = URL.createObjectURL(source);
        }
        else {
            droppedSourceUrl = source;
        }

        let getThumbnailPromise = () => new Promise<string>(async (resolve) => {
            resolve(await Utils.readBlobAsDataUrl(<Blob>source));
        });

        return {
            title: "Picture",
            description: dataTransfer.name,
            iconUrl: pictureIconUrl,
            getWidgetOrder: async () => {
                return await this.getWidgetOrderByConfig(droppedSourceUrl, dataTransfer.name);
            },
            getPreviewUrl: getThumbnailPromise,
            getThumbnailUrl: getThumbnailPromise,
            uploadables: [dataTransfer.source]
        };
    }
}