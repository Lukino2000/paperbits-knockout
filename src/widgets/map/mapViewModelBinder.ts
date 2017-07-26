import { MapModel } from "@paperbits/common/widgets/models/mapModel";
import { MapViewModel } from "./mapViewModel";


export class MapViewModelBinder {
    public modelToViewModel(model: MapModel, readonly: boolean, viewModel?: MapViewModel): MapViewModel {
        if (!viewModel) {
            viewModel = new MapViewModel();
        }

        viewModel.caption(model.caption);
        viewModel.layout(model.layout);
        viewModel.location(model.location);
        viewModel.zoomControl(model.zoomControl);

        viewModel["attachedWidgetModel"] = {
            readonly: readonly,
            model: model,
            editor: "paperbits-map-editor",
            applyChanges: () => {
                this.modelToViewModel(model, readonly, viewModel);
            }
        }

        return viewModel;
    }

    public canHandleModel(model: MapModel): boolean {
        return model instanceof MapModel;
    }
}