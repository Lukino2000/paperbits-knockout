﻿import * as ko from "knockout";
import { IWidgetBinding } from "@paperbits/common/editing";
import * as Utils from '@paperbits/common/utils';
import { IWidgetOrder } from '@paperbits/common/editing';
import { IContentDropHandler } from '@paperbits/common/editing';
import { IContentDescriptor } from '@paperbits/common/editing';
import { IWidgetHandler } from '@paperbits/common/editing';
import { IWidgetFactoryResult } from '@paperbits/common/editing';
import { SliderModelBinder } from "@paperbits/common/widgets/slider/sliderModelBinder";
import { Contract } from "@paperbits/common/contract";


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
            name: "slider",
            displayName: "Slider",
            createWidget: factoryFunction,
            createModel: async () => {
                return model;
            }
        }

        return widgetOrder;
    }

    private async getWidgetOrderByConfig(): Promise<IWidgetOrder> {
        let config: Contract = {
            object: "block",
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