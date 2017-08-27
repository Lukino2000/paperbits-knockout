import { YoutubePlayerModel } from "@paperbits/common/widgets/youtube-player/youtubePlayerModel";
import { YoutubePlayerViewModel } from "./youtubePlayerViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";


export class YoutubePlayerViewModelBinder implements IViewModelBinder {
    public modelToViewModel(model: YoutubePlayerModel, readonly: boolean, viewModel?: YoutubePlayerViewModel): YoutubePlayerViewModel {
        if (!viewModel) {
            viewModel = new YoutubePlayerViewModel();
        }

        viewModel.videoId(model.videoId);

        viewModel["widgetBinding"] = {
            readonly: readonly,
            model: model,
            editor: "paperbits-youtube-player-editor",
            applyChanges: () => {
                this.modelToViewModel(model, readonly, viewModel);
            }
        }

        return viewModel;
    }

    public canHandleModel(model: YoutubePlayerModel): boolean {
        return model instanceof YoutubePlayerModel;
    }
}