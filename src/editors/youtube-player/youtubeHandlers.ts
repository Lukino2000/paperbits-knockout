import * as ko from "knockout";
import { YoutubeModelBinder } from "@paperbits/common/widgets/youtube-player/youtubeModelBinder";
import { YoutubePlayerModel } from "@paperbits/common/widgets/youtube-player/youtubePlayerModel";
import { YoutubePlayerViewModel } from "../../widgets/youtube-player/youtubePlayerViewModel";
import { IWidgetBinding } from "@paperbits/common/editing";
import * as Utils from '@paperbits/common/utils';
import { IWidgetOrder } from '@paperbits/common/editing';
import { IContentDropHandler } from '@paperbits/common/editing';
import { IDataTransfer } from '@paperbits/common/editing';
import { IContentDescriptor } from '@paperbits/common/editing';
import { IWidgetHandler } from '@paperbits/common/editing';
import { IWidgetFactoryResult } from '@paperbits/common/editing';

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

        const widgetOrder: IWidgetOrder = {
            name: "youtube-player",
            displayName: "Youtube player",
            iconClass: "paperbits-player-48",
            createWidget: () => {
                throw "Not implemented.";
                // let htmlElement = document.createElement("widget");
                // htmlElement.style.width = "100px";

                // ko.applyBindingsToNode(htmlElement, { widget: widgetModel });
                // htmlElement["attachedModel"] = widgetModel.model;

                // return { element: htmlElement }
            },
            createModel: async () => {
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
        const source = dataTransfer.source;

        if (source && typeof source === "string") {
            const lower = source.toLowerCase();

            if (lower.startsWith("https://www.youtube.com") || lower.startsWith("http://www.youtube.com")) {
                var videoId = new RegExp("[?&](?:v=)(.*?)(?:$|&)").exec(source);
                return videoId ? videoId[1] : null;
            }
        }

        return null;
    }
}