import { IModelBinder } from "@paperbits/common/editing/IModelBinder";
import { Contract } from "@paperbits/common/editing/contentNode";
import { Substitute7Model } from "./substitute7Model";


export class Substitute7ModelBinder implements IModelBinder {
    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "substitute7";
    }

    public canHandleModel(model): boolean {
        return model instanceof Substitute7Model;
    }

    public async nodeToModel(sliderContract: Contract): Promise<Substitute7Model> {
        return new Substitute7Model();
    }

    public getConfig(model: any): Contract {
        let sliderContract: Contract = {
            type: "substitute7",
            kind: "block",
            size: model.size,
            style: model.style
        }

        return sliderContract;
    }
}
