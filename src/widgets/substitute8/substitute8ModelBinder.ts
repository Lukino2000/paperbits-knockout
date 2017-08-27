import { IModelBinder } from "@paperbits/common/editing/IModelBinder";
import { Contract } from "@paperbits/common/editing/contentNode";
import { Substitute8Model } from "./substitute8Model";


export class Substitute8ModelBinder implements IModelBinder {
    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "substitute8";
    }

    public canHandleModel(model): boolean {
        return model instanceof Substitute8Model;
    }

    public async nodeToModel(sliderContract: Contract): Promise<Substitute8Model> {
        return new Substitute8Model();
    }

    public getConfig(model: any): Contract {
        let sliderContract: Contract = {
            type: "substitute8",
            kind: "block",
            size: model.size,
            style: model.style
        }

        return sliderContract;
    }
}
