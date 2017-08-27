import * as ko from "knockout";
import { IWidgetBinding } from "@paperbits/common/editing/IWidgetBinding";
import * as Utils from '@paperbits/common/core/utils';
import { IWidgetOrder } from '@paperbits/common/editing/IWidgetOrder';
import { IContentDropHandler } from '@paperbits/common/editing/IContentDropHandler';
import { IContentDescriptor } from '@paperbits/common/editing/IContentDescriptor';
import { IWidgetHandler } from '@paperbits/common/editing/IWidgetHandler';
import { IWidgetFactoryResult } from '@paperbits/common/editing/IWidgetFactoryResult';
import { SliderModelBinder } from "@paperbits/common/widgets/slider/sliderModelBinder";
import { Contract } from "@paperbits/common/editing/contentNode";


export class SliderHandlers implements IWidgetHandler {
    private readonly sliderModelBinder: SliderModelBinder;

    constructor(sliderModelBinder: SliderModelBinder) {
        this.sliderModelBinder = sliderModelBinder;
    }

    private async prepareWidgetOrder(config: Contract): Promise<IWidgetOrder> {
        let model = await this.sliderModelBinder.nodeToModel(config);
        

        let factoryFunction: () => IWidgetFactoryResult = () => {
            throw "Not implemented.";

            //let widgetModel = await this.sliderModelBinder.modelToWidgetModel(model);
            // let htmlElement = document.createElement("widget");
            // htmlElement.style.width = "150px";
            // htmlElement.style.height = "100px";
            // ko.applyBindingsToNode(htmlElement, { widget: widgetModel })
            // htmlElement["attachedModel"] = widgetModel.model;
            // return { element: htmlElement };
        }

        let widgetOrder: IWidgetOrder = {
            title: "Slider",
            createWidget: factoryFunction,
            createModel: () => {
                return model;
            }
        }

        return widgetOrder;
    }

    private async getWidgetOrderByConfig(): Promise<IWidgetOrder> {
        let config: Contract = {
            kind: "block",
            type: "slider",
            label: "Slider",
            style: "default"
        }
        return await this.prepareWidgetOrder(config);
    }

    public getWidgetOrder(): Promise<IWidgetOrder> {
        return Promise.resolve(this.getWidgetOrderByConfig());
    }
}