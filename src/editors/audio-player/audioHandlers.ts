import * as ko from "knockout";
import { AudioPlayerViewModel } from "../../widgets/audio-player/audioViewModel";
import { AudioPlayerModelBinder } from "@paperbits/common/widgets/audio-player/audioPlayerModelBinder";
import { AudioPlayerContract } from "@paperbits/common/widgets/audio-player/audioPlayerContract";
import { IWidgetFactoryResult } from "@paperbits/common/editing";
import { IWidgetBinding } from "@paperbits/common/editing";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { IWidgetOrder } from "@paperbits/common/editing";
import { IContentDropHandler } from "@paperbits/common/editing";
import { IWidgetHandler } from "@paperbits/common/editing";
import { IDataTransfer } from "@paperbits/common/editing";
import { IContentDescriptor } from "@paperbits/common/editing";
import { MediaHandlers } from "../../editors/mediaHandlers";


export class AudioHandlers extends MediaHandlers implements IWidgetHandler, IContentDropHandler {
    private readonly audioPlayerModelBinder: AudioPlayerModelBinder;

    private static DefaultAudioUri = "http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_640x360.m4v";
    private static DefaultThumbnailUri = "data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%20standalone%3D%22no%22%3F%3E%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2270%22%20height%3D%2270%22%20version%3D%221.1%22%3E%3Crect%20width%3D%222%22%20height%3D%224%22%20x%3D%221%22%20y%3D%2233%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%226%22%20x%3D%224%22%20y%3D%2232%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%224%22%20x%3D%227%22%20y%3D%2233%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%222%22%20x%3D%2210%22%20y%3D%2234%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%228%22%20x%3D%2213%22%20y%3D%2231%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2228%22%20x%3D%2216%22%20y%3D%2221%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2240%22%20x%3D%2219%22%20y%3D%2215%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2230%22%20x%3D%2222%22%20y%3D%2220%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2262%22%20x%3D%2225%22%20y%3D%224%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2246%22%20x%3D%2228%22%20y%3D%2212%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2254%22%20x%3D%2231%22%20y%3D%228%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2238%22%20x%3D%2234%22%20y%3D%2216%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2214%22%20x%3D%2237%22%20y%3D%2228%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%226%22%20x%3D%2240%22%20y%3D%2232%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2228%22%20x%3D%2243%22%20y%3D%2221%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2236%22%20x%3D%2246%22%20y%3D%2217%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2224%22%20x%3D%2249%22%20y%3D%2223%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%228%22%20x%3D%2252%22%20y%3D%2231%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%222%22%20x%3D%2255%22%20y%3D%2234%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%228%22%20x%3D%2258%22%20y%3D%2231%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%224%22%20x%3D%2261%22%20y%3D%2233%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%224%22%20x%3D%2264%22%20y%3D%2233%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%222%22%20x%3D%2267%22%20y%3D%2234%22%20%2F%3E%3C%2Fsvg%3E%0A";
    private static ThumbnailTimeOffset = 60;

    constructor(audioPlayerModelBinder: AudioPlayerModelBinder) {
        super(["audio/webm", "video/webm", "audio/mp4", "audio/mp3", "video/mp4", "audio/ogg", "video/ogg", "application/ogg"], [".webm", ".mp4", ".m4a", ".mp3", ".m4p", ".m4b", ".m4r", ".m4v", ".ogg", ".oga", ".ogv", ".ogx", ".ogm"]);
        this.audioPlayerModelBinder = audioPlayerModelBinder;
    }

    private getWidgetOrderByConfig(sourceUrl: string): IWidgetOrder {
        const pictureWidgetModel: IWidgetBinding = {
            name: "paperbits-audio-player",
            params: {},
            oncreate: (audioPlayerModel: AudioPlayerViewModel) => {
                audioPlayerModel.sourceUrl(sourceUrl);
                audioPlayerModel.controls(true);
                audioPlayerModel.autoplay(false);
            },
            nodeType: "audio-player"
        };

        const widgetOrder: IWidgetOrder = {
            name: "audio-player",
            displayName: "Audio player",

            createWidget: () => {
                const htmlElement = document.createElement("widget");

                htmlElement["attachedModel"] = pictureWidgetModel.model;
                ko.applyBindingsToNode(htmlElement, { component: { name: pictureWidgetModel.name, oncreate: pictureWidgetModel.oncreate } })

                return { element: htmlElement }
            },
            createModel: async () => {
                return pictureWidgetModel.model;
            }
        }

        return widgetOrder;
    }

    public getWidgetOrder(): Promise<IWidgetOrder> {
        return Promise.resolve(this.getWidgetOrderByConfig(AudioHandlers.DefaultAudioUri));
    }

    public getContentDescriptorFromMedia(media: MediaContract): IContentDescriptor {
        const getWidgetOrderFunction: () => Promise<IWidgetOrder> = () => {
            return new Promise<IWidgetOrder>(async (resolve, reject) => {
                const config: AudioPlayerContract = {
                    object: "block",
                    type: "audio-player",
                    sourceKey: media.permalinkKey,
                    controls: true,
                    autoplay: false
                }

                const model = await this.audioPlayerModelBinder.nodeToModel(config);
              
                const widgetOrder: IWidgetOrder = {
                    name: "audio-player",
                    displayName: "Audio player",
                    createModel: async () => {
                        return model;
                    }
                }

                resolve(widgetOrder);
            });
        }

        return {
            title: "Audio recording",
            description: media.description,
            getWidgetOrder: getWidgetOrderFunction
        };
    }

    public getContentDescriptorFromDataTransfer(dataTransfer: IDataTransfer): IContentDescriptor {
        if (!this.matches(dataTransfer)) {
            return null;
        }

        const source = dataTransfer.source;
        let droppedSourceUrl: string;

        if (source instanceof File) {
            droppedSourceUrl = URL.createObjectURL(source);
        }
        else {
            droppedSourceUrl = source;
        }

        const descriptor: IContentDescriptor = {
            title: "Audio",
            description: dataTransfer.name,
            iconUrl: AudioHandlers.DefaultThumbnailUri,
            getWidgetOrder: async () => {
                return await this.getWidgetOrderByConfig(droppedSourceUrl);
            },
            uploadables: [source]
        };

        return descriptor;
    }
}