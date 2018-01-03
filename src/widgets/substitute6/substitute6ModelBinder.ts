import { IModelBinder } from "@paperbits/common/editing/IModelBinder";
import { Contract } from "@paperbits/common/contract";
import { Substitute6Model } from "./substitute6Model";


export class Substitute6ModelBinder implements IModelBinder {
    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "substitute6";
    }

    public canHandleModel(model): boolean {
        return model instanceof Substitute6Model;
    }

    public async nodeToModel(sliderContract: Contract): Promise<Substitute6Model> {
        return new Substitute6Model();
    }

    public getConfig(model: any): Contract {
        let sliderContract: Contract = {
            type: "substitute6",
            kind: "block",
            size: model.size,
            style: model.style
        }

        return sliderContract;
    }
}
