import * as ko from "knockout";
import { IWidgetBinding } from "@paperbits/common/editing/IWidgetBinding";
import * as Utils from "@paperbits/common/utils";
import { IWidgetOrder } from '@paperbits/common/editing/IWidgetOrder';
import { IContentDropHandler } from '@paperbits/common/editing/IContentDropHandler';
import { IContentDescriptor } from '@paperbits/common/editing/IContentDescriptor';
import { IWidgetHandler } from '@paperbits/common/editing/IWidgetHandler';
import { IWidgetFactoryResult } from '@paperbits/common/editing/IWidgetFactoryResult';
import { ButtonModelBinder } from "@paperbits/common/widgets/button/buttonModelBinder";
import { Contract } from "@paperbits/common/contract";


export class ButtonHandlers implements IWidgetHandler {
    private readonly buttonModelBinder: ButtonModelBinder;

    constructor(buttonModelBinder: ButtonModelBinder) {
        this.buttonModelBinder = buttonModelBinder;
    }

    private async prepareWidgetOrder(config: Contract): Promise<IWidgetOrder> {
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
            name: "button",
            displayName: "Button",
            iconClass: "paperbits-button-2",
            createWidget: factoryFunction,
            createModel: () => {
                return model;
            }
        }

        return widgetOrder;
    }

    private async getWidgetOrderByConfig(): Promise<IWidgetOrder> {
        let config: Contract = {
            object: "block",
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