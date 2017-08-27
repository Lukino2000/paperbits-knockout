import { VideoPlayerModel } from "@paperbits/common/widgets/video-player/videoPlayerModel";
import { VideoPlayerViewModel } from "./videoPlayerViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";


export class VideoPlayerViewModelBinder implements IViewModelBinder {
    public modelToViewModel(model: VideoPlayerModel, readonly: boolean, viewModel?: VideoPlayerViewModel): VideoPlayerViewModel {
        if (!viewModel) {
            viewModel = new VideoPlayerViewModel();
        }

        viewModel.sourceUrl(model.sourceUrl);
        viewModel.controls(model.controls);
        viewModel.autoplay(model.autoplay);

        viewModel["widgetBinding"] = {
            readonly: readonly,
            model: model,
            editor: "paperbits-video-player-editor",
            applyChanges: () => {
                this.modelToViewModel(model, readonly, viewModel);
            }
        }

        return viewModel;
    }

    public canHandleModel(model: VideoPlayerModel): boolean {
        return model instanceof VideoPlayerModel;
    }
}