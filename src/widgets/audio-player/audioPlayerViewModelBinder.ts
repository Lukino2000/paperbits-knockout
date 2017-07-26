
import { AudioPlayerModel } from "@paperbits/common/widgets/models/audioPlayerModel";
import { AudioPlayerViewModel } from "./audioViewModel";


export class AudioPlayerViewModelBinder {
    public modelToViewModel(model: AudioPlayerModel, readonly: boolean, viewModel?: AudioPlayerViewModel): AudioPlayerViewModel {
        if (!viewModel) {
            viewModel = new AudioPlayerViewModel();
        }

        viewModel.sourceUrl(model.sourceUrl);
        viewModel.sourceKey(model.sourceKey);
        viewModel.controls(model.controls);
        viewModel.autoplay(model.autoplay);

        viewModel["attachedWidgetModel"] = {
            readonly: readonly,
            model: model,
            editor: "paperbits-audio-player-editor",
            applyChanges: () => {
                this.modelToViewModel(model, readonly, viewModel);
            }
        }

        return viewModel;
    }

    public canHandleModel(model: AudioPlayerModel): boolean {
        return model instanceof AudioPlayerModel;
    }
}