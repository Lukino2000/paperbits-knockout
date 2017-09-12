import * as ko from "knockout";
import { YoutubeModelBinder } from "@paperbits/common/widgets/youtube-player/youtubeModelBinder";
import { YoutubePlayerModel } from "@paperbits/common/widgets/youtube-player/youtubePlayerModel";
import { YoutubePlayerViewModel } from "../../widgets/youtube-player/youtubePlayerViewModel";
import { IWidgetBinding } from "@paperbits/common/editing/IWidgetBinding";
import * as Utils from '@paperbits/common/core/utils';
import { IWidgetOrder } from '@paperbits/common/editing/IWidgetOrder';
import { IContentDropHandler } from '@paperbits/common/editing/IContentDropHandler';
import { IDataTransfer } from '@paperbits/common/editing/IDataTransfer';
import { IContentDescriptor } from '@paperbits/common/editing/IContentDescriptor';
import { IWidgetHandler } from '@paperbits/common/editing/IWidgetHandler';
import { IWidgetFactoryResult } from '@paperbits/common/editing/IWidgetFactoryResult';

const defaultYoutubeClipId = "KK9bwTlAvgo";

export class YoutubeHandlers implements IWidgetHandler, IContentDropHandler {
    private readonly youtubePlayerModelBinder: YoutubeModelBinder;

    constructor(youtubeModelBinder: YoutubeModelBinder) {
        this.youtubePlayerModelBinder = youtubeModelBinder;
    }

    private async getWidgetOrderByConfig(youtubeClipId: string): Promise<IWidgetOrder> {
        let youtubePlayerModel = new YoutubePlayerModel();
        youtubePlayerModel.videoId = youtubeClipId;

        // let widgetModel = await this.youtubePlayerModelBinder.modelToWidgetModel(youtubePlayerModel);

        let widgetOrder: IWidgetOrder = {
            name: "youtube-player",
            displayName: "Youtube player",
            createWidget: () => {
                throw "Not implemented.";
                // let htmlElement = document.createElement("widget");
                // htmlElement.style.width = "100px";

                // ko.applyBindingsToNode(htmlElement, { widget: widgetModel });
                // htmlElement["attachedModel"] = widgetModel.model;

                // return { element: htmlElement }
            },
            createModel: () => {
                return youtubePlayerModel;
            }
        }
        return widgetOrder;
    }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        return await this.getWidgetOrderByConfig(defaultYoutubeClipId);
    }

    public getContentDescriptorFromDataTransfer(dataTransfer: IDataTransfer): IContentDescriptor {
        let videoId = this.getVideoId(dataTransfer);

        if (!videoId) {
            return null;
        }

        let getThumbnailPromise = () => Promise.resolve(`https://img.youtube.com/vi/${videoId}/0.jpg`);

        var descriptor: IContentDescriptor = {
            title: "Youtube player",
            description: "",
            getWidgetOrder: (): Promise<IWidgetOrder> => this.getWidgetOrderByConfig(videoId),
            getPreviewUrl: getThumbnailPromise,
            getThumbnailUrl: getThumbnailPromise
        };

        return descriptor;
    }

    private getVideoId(dataTransfer: IDataTransfer): string {
        let source = dataTransfer.source;

        if (source && typeof source === "string") {
            let lower = source.toLowerCase();

            if (lower.startsWith("https://www.youtube.com") || lower.startsWith("http://www.youtube.com")) {
                var videoId = new RegExp("[?&](?:v=)(.*?)(?:$|&)").exec(source);
                return videoId ? videoId[1] : null;
            }
        }

        return null;
    }
}