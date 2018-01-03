import { IModelBinder } from "@paperbits/common/editing/IModelBinder";
import { Contract } from "@paperbits/common/contract";
import { Substitute5Model } from "./substitute5Model";


export class Substitute5ModelBinder implements IModelBinder {
    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "substitute5";
    }

    public canHandleModel(model): boolean {
        return model instanceof Substitute5Model;
    }

    public async nodeToModel(sliderContract: Contract): Promise<Substitute5Model> {
        return new Substitute5Model();
    }

    public getConfig(model: any): Contract {
        let sliderContract: Contract = {
            type: "substitute5",
            kind: "block",
            size: model.size,
            style: model.style
        }

        return sliderContract;
    }
}
