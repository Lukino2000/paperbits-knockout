import { IModelBinder } from "@paperbits/common/editing/IModelBinder";
import { Contract } from "@paperbits/common/contract";
import { Substitute2Model } from "./substitute2Model";


export class Substitute2ModelBinder implements IModelBinder {
    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "substitute2";
    }

    public canHandleModel(model): boolean {
        return model instanceof Substitute2Model;
    }

    public async nodeToModel(sliderContract: Contract): Promise<Substitute2Model> {
        return new Substitute2Model();
    }

    public getConfig(model: any): Contract {
        let sliderContract: Contract = {
            type: "substitute2",
            object: "block",
            size: model.size,
            style: model.style
        }

        return sliderContract;
    }
}
