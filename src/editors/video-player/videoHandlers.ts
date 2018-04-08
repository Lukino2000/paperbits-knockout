import * as ko from "knockout";
import { VideoPlayerContract } from "@paperbits/common/widgets/video-player/VideoPlayerContract";
import { VideoPlayerModelBinder } from "@paperbits/common/widgets/video-player/videoPlayerModelBinder";
import { ICreatedMedia } from "@paperbits/common/media/ICreatedMedia";
import { IWidgetFactoryResult } from "@paperbits/common/editing/IWidgetFactoryResult";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { IWidgetBinding } from "@paperbits/common/editing/IWidgetBinding";
import { IEventManager } from "@paperbits/common/events/IEventManager";
import { IWidgetOrder } from "@paperbits/common/editing/IWidgetOrder";
import { IWidgetHandler } from "@paperbits/common/editing/IWidgetHandler";
import { IContentDropHandler } from "@paperbits/common/editing/IContentDropHandler";
import { MediaHandlers } from "../../editors/mediaHandlers";
import { IContentDescriptor } from "@paperbits/common/editing/IContentDescriptor";
import { IDataTransfer } from "@paperbits/common/editing/IDataTransfer";

export class VideoHandlers implements IWidgetHandler, IContentDropHandler {
    private readonly videoPlayerModelBinder: VideoPlayerModelBinder;

    private static DefaultVideoUri = "http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_640x360.m4v";
    private static DefaultThumbnailUri = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjQ4cHgiIGhlaWdodD0iNDhweCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48ZyAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC41LCAwLjUpIj4KPHJlY3QgeD0iMiIgeT0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNDQ0NDQ0IiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgd2lkdGg9IjQ0IiBoZWlnaHQ9IjQwIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+Cjxwb2x5Z29uIGRhdGEtY29sb3I9ImNvbG9yLTIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzQ0NDQ0NCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50cz0iJiMxMDsmIzk7MTcsMTQgMzMsMjQgMTcsMzQgIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+CjwvZz48L3N2Zz4=";
    private static ThumbnailTimeOffset = 60;

    constructor(videoPlayerModelBinder: VideoPlayerModelBinder) {
        this.videoPlayerModelBinder = videoPlayerModelBinder;
    }

    protected matches(filename: string): boolean {
        if (filename && ![".webm", ".mp4", ".m4v", ".ogg", ".ogv", ".ogx", ".ogm"].some(e => filename.endsWith(e))) {
            return false;
        }
        return true;
    }

    private async prepareWidgetOrder(config: VideoPlayerContract): Promise<IWidgetOrder> {
        let model = await this.videoPlayerModelBinder.nodeToModel(config);

        let factoryFunction: () => IWidgetFactoryResult = () => {
            throw "Not implemented.";

            // let widgetModel = await this.videoPlayerModelBinder.modelToWidgetModel(model);
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
        }

        let widgetOrder: IWidgetOrder = {
            name: "video-player",
            displayName: "Video player",
            iconClass: "paperbits-action-74",
            createWidget: factoryFunction,
            createModel: async () => {
                return model;
            }
        }

        return widgetOrder;
    }

    private async getWidgetOrderByConfig(sourceUrl: string): Promise<IWidgetOrder> {
        let config: VideoPlayerContract = {
            object: "block",
            type: "video-player",
            sourceUrl: sourceUrl,
            controls: true,
            autoplay: false
        }
        return await this.prepareWidgetOrder(config);
    }

    private async getWidgetOrderByUrl(url: string): Promise<IWidgetOrder> {
        return await this.getWidgetOrderByConfig(url);
    }

    public getContentDescriptorFromMedia(media: MediaContract): IContentDescriptor {
        if (!this.matches(media.filename)) {
            return null;
        }

        let getWidgetOrderFunction: () => Promise<IWidgetOrder> = async () => {
            let config: VideoPlayerContract = {
                object: "block",
                type: "video-player",
                sourceKey: media.permalinkKey,
                controls: true,
                autoplay: false
            }
            return await this.prepareWidgetOrder(config);
        }

        return {
            title: "Video recording",
            iconUrl: VideoHandlers.DefaultThumbnailUri,
            description: media.description,
            getWidgetOrder: getWidgetOrderFunction
        };
    }

    public getContentDescriptorFromDataTransfer(dataTransfer: IDataTransfer): IContentDescriptor {
        if (!this.matches(dataTransfer.name)) {
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
            resolve(await this.buildThumbnail(droppedSourceUrl));
        });

        var descriptor: IContentDescriptor = {
            title: "Video recording",
            description: dataTransfer.name,
            getWidgetOrder: async () => {
                return await this.getWidgetOrderByUrl(droppedSourceUrl);
            },
            iconUrl: VideoHandlers.DefaultThumbnailUri,
            getPreviewUrl: getThumbnailPromise,
            getThumbnailUrl: getThumbnailPromise,
            uploadables: [source]
        };

        return descriptor;
    }

    private buildThumbnail(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            var video = <HTMLVideoElement>document.createElement("video");
            var canvas = <HTMLCanvasElement>document.createElement("canvas");

            video.src = url;
            video.currentTime = VideoHandlers.ThumbnailTimeOffset;
            video.addEventListener("loadedmetadata", () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            }, false);

            var callback = function () {
                var context = canvas.getContext("2d");
                context.drawImage(video, 0, 0);

                try {
                    var url = canvas.toDataURL();
                    resolve(url);
                }
                catch (ex) {
                    resolve(VideoHandlers.DefaultThumbnailUri);
                }
                video.removeEventListener("timeupdate", callback, false);
            };
            video.addEventListener("timeupdate", callback, false);
        });
    }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        return await this.getWidgetOrderByConfig(VideoHandlers.DefaultVideoUri);
    }
}