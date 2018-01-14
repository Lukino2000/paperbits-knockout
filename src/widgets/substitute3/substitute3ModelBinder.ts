import { IModelBinder } from "@paperbits/common/editing/IModelBinder";
import { Contract } from "@paperbits/common/contract";
import { Substitute3Model } from "./substitute3Model";


export class Substitute3ModelBinder implements IModelBinder {
    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "substitute3";
    }

    public canHandleModel(model): boolean {
        return model instanceof Substitute3Model;
    }

    public async nodeToModel(sliderContract: Contract): Promise<Substitute3Model> {
        return new Substitute3Model();
    }

    public getConfig(model: any): Contract {
        let sliderContract: Contract = {
            type: "substitute3",
            object: "block",
            size: model.size,
            style: model.style
        }

        return sliderContract;
    }
}
