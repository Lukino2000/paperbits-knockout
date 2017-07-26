﻿import * as ko from "knockout";
import { IWidgetModel } from "@paperbits/common/editing/IWidgetModel";
import * as Utils from '@paperbits/common/core/utils';
import { IWidgetOrder } from '@paperbits/common/editing/IWidgetOrder';
import { IContentDropHandler } from '@paperbits/common/editing/IContentDropHandler';
import { IContentDescriptor } from '@paperbits/common/editing/IContentDescriptor';
import { IWidgetHandler } from '@paperbits/common/editing/IWidgetHandler';
import { IWidgetFactoryResult } from '@paperbits/common/editing/IWidgetFactoryResult';
import { ButtonModelBinder } from "@paperbits/common/widgets/buttonModelBinder";
import { ContentConfig } from "@paperbits/common/editing/contentNode";


export class ButtonHandlers implements IWidgetHandler {
    private readonly buttonModelBinder: ButtonModelBinder;

    constructor(buttonModelBinder: ButtonModelBinder) {
        this.buttonModelBinder = buttonModelBinder;
    }

    private async prepareWidgetOrder(config: ContentConfig): Promise<IWidgetOrder> {
        let model = await this.buttonModelBinder.nodeToModel(config);
        

        let factoryFunction: () => IWidgetFactoryResult = () => {
            throw "Not implemented.";

            //let widgetModel = await this.buttonModelBinder.modelToWidgetModel(model);
            // let htmlElement = document.createElement("widget");
            // htmlElement.style.width = "150px";
            // htmlElement.style.height = "100px";
            // ko.applyBindingsToNode(htmlElement, { widget: widgetModel })
            // htmlElement["attachedModel"] = widgetModel.model;
            // return { element: htmlElement };
        }

        let widgetOrder: IWidgetOrder = {
            title: "Button",
            createWidget: factoryFunction,
            createModel: () => {
                return model;
            }
        }

        return widgetOrder;
    }

    private async getWidgetOrderByConfig(): Promise<IWidgetOrder> {
        let config: ContentConfig = {
            kind: "block",
            type: "button",
            label: "Button",
            style: "default"
        }
        return await this.prepareWidgetOrder(config);
    }

    public getWidgetOrder(): Promise<IWidgetOrder> {
        return Promise.resolve(this.getWidgetOrderByConfig());
    }
}