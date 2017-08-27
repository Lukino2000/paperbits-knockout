import { IModelBinder } from "@paperbits/common/editing/IModelBinder";
import { Contract } from "@paperbits/common/editing/contentNode";
import { Substitute4Model } from "./substitute4Model";


export class Substitute4ModelBinder implements IModelBinder {
    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "substitute4";
    }

    public canHandleModel(model): boolean {
        return model instanceof Substitute4Model;
    }

    public async nodeToModel(sliderContract: Contract): Promise<Substitute4Model> {
        return new Substitute4Model();
    }

    public getConfig(model: any): Contract {
        let sliderContract: Contract = {
            type: "substitute4",
            kind: "block",
            size: model.size,
            style: model.style
        }

        return sliderContract;
    }
}
