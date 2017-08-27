import { IModelBinder } from "@paperbits/common/editing/IModelBinder";
import { Contract } from "@paperbits/common/editing/contentNode";
import { Substitute1Model } from "./substitute1Model";


export class Substitute1ModelBinder implements IModelBinder {
    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "substitute1";
    }

    public canHandleModel(model): boolean {
        return model instanceof Substitute1Model;
    }

    public async nodeToModel(sliderContract: Contract): Promise<Substitute1Model> {
        return new Substitute1Model();
    }

    public getConfig(model: any): Contract {
        let sliderContract: Contract = {
            type: "substitute1",
            kind: "block",
            size: model.size,
            style: model.style
        }

        return sliderContract;
    }
}
