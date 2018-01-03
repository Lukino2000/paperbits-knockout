import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import ILazy = Utils.ILazy;
import { ICreatedMedia } from "@paperbits/common/media/ICreatedMedia";
import { IWidgetFactoryResult } from "@paperbits/common/editing/IWidgetFactoryResult";
import { PictureContract } from "@paperbits/common/widgets/picture/IPictureNode";
import { PictureModel } from "@paperbits/common/widgets/picture/pictureModel";
import { PictureModelBinder } from "@paperbits/common/widgets/picture/pictureModelBinder";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { IWidgetBinding } from "@paperbits/common/editing/IWidgetBinding";
import { IWidgetOrder } from "@paperbits/common/editing/IWidgetOrder";
import { IContentDropHandler } from "@paperbits/common/editing/IContentDropHandler";
import { MediaHandlers } from "../../editors/mediaHandlers";
import { IWidgetHandler } from "@paperbits/common/editing/IWidgetHandler";
import { IDataTransfer } from "@paperbits/common/editing/IDataTransfer";
import { IContentDescriptor } from "@paperbits/common/editing/IContentDescriptor";
import { PromiseToDelayedComputed } from "../../core/task";
import { BackgroundModel } from "@paperbits/common/widgets/background/backgroundModel";
import { PictureViewModelBinder } from "../../widgets/picture/pictureViewModelBinder";

const pictureIconUrl = "data:image/svg+xml;base64,PHN2ZyBjbGFzcz0ibmMtaWNvbiBvdXRsaW5lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjQ4cHgiIGhlaWdodD0iNDhweCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjUsIDAuNSkiPgo8cG9seWxpbmUgZGF0YS1jYXA9ImJ1dHQiIGRhdGEtY29sb3I9ImNvbG9yLTIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzQ0NDQ0NCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50cz0iMiwzNCAxMiwyNiAyMiwzNCAKCTM0LDIwIDQ2LDMwICIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiPjwvcG9seWxpbmU+CjxyZWN0IHg9IjIiIHk9IjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzQ0NDQ0NCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHdpZHRoPSI0NCIgaGVpZ2h0PSI0MCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciI+PC9yZWN0Pgo8Y2lyY2xlIGRhdGEtY29sb3I9ImNvbG9yLTIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzQ0NDQ0NCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGN4PSIyMCIgY3k9IjE2IiByPSI0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIj48L2NpcmNsZT4KPC9nPjwvc3ZnPg==";
const defaultLayout = "noframe";
const widgetDisplayName = "Picture";

export class PictureHandlers implements IWidgetHandler, IContentDropHandler {
    private static readonly imageFileExtensions = [".jpg", ".jpeg", ".png", ".svg", ".gif"];
    private readonly pictureModelBinder: PictureModelBinder;
    private readonly pictureViewModelBinder: PictureViewModelBinder;

    constructor(pictureModelBinder: PictureModelBinder, pictureViewModelBinder: PictureViewModelBinder) {
        this.pictureModelBinder = pictureModelBinder;
        this.pictureViewModelBinder = pictureViewModelBinder;
    }

    private async prepareWidgetOrder(config: PictureContract): Promise<IWidgetOrder> {
        const pictureModel = await this.pictureModelBinder.nodeToModel(config);

        const factoryFunction: () => IWidgetFactoryResult = () => {
            throw "Not implemented.";
        }

        const widgetOrder: IWidgetOrder = {
            name: "picture",
            displayName: widgetDisplayName,
            iconClass: "paperbits-image-2",
            createModel: () => {
                return pictureModel;
            }
        }

        return widgetOrder;
    }

    private async getWidgetOrderByConfig(sourceUrl: string, caption: string): Promise<IWidgetOrder> {
        const backgroundModel = new BackgroundModel();
        backgroundModel.sourceUrl = sourceUrl;

        const pictureModel = new PictureModel();
        pictureModel.background = backgroundModel;
        pictureModel.caption = caption;
        pictureModel.layout = defaultLayout;

        let widgetOrder: IWidgetOrder = {
            name: "picture",
            displayName: widgetDisplayName,
            iconClass: "paperbits-image-2",
            createWidget: (): IWidgetFactoryResult => {
                // We create HTML element here just for dragging animation
                const pictureViewModel = this.pictureViewModelBinder.modelToViewModel(pictureModel, false);
                const htmlElement = document.createElement("widget");

                htmlElement.style.width = "150px";
                htmlElement.style.height = "150px";
                htmlElement.style.overflow = "hidden";
                htmlElement.style.backgroundSize = "cover";
                htmlElement.classList.add("no-pointer-events");

                ko.applyBindingsToNode(htmlElement, { widget: pictureViewModel });

                return {
                    element: htmlElement,
                    widgetModel: pictureModel,
                    widgetBinding: pictureViewModel["widgetBinding"],
                    onMediaUploadedCallback: (media: ICreatedMedia) => {
                        pictureModel.background.sourceKey = media.permalink.key;
                        pictureModel.background.sourceUrl = media.media.downloadUrl;

                        // TODO: Notify PageModelBinder to update page config.
                    }
                }
            },
            createModel: () => {
                return pictureModel;
            }
        }

        return widgetOrder;
    }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        return await this.getWidgetOrderByConfig(null, widgetDisplayName);
    }

    public getContentDescriptorFromMedia(media: MediaContract): IContentDescriptor {
        if (!PictureHandlers.IsMediaFileImage(media)) {
            return null;
        }

        return {
            title: widgetDisplayName,
            description: media.description,
            getWidgetOrder: async () => {
                return await this.getWidgetOrderByConfig(media.downloadUrl, media.filename);
            }
        };
    }

    public getContentDescriptorFromDataTransfer(dataTransfer: IDataTransfer): IContentDescriptor {
        if (!dataTransfer.name || !PictureHandlers.imageFileExtensions.some(e => dataTransfer.name.endsWith(e))) {
            return null;
        }

        const source = dataTransfer.source;
        const droppedSourceUrl = URL.createObjectURL(source);

        const getThumbnailPromise = () => new Promise<string>(async (resolve) => {
            resolve(await Utils.readBlobAsDataUrl(<Blob>source));
        });

        return {
            title: widgetDisplayName,
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

    public static IsMediaFileImage(media: MediaContract): boolean {
        return (media.contentType && media.contentType.contains("image")) || (media.filename && this.imageFileExtensions.some(e => media.filename.endsWith(e)));

    }
}