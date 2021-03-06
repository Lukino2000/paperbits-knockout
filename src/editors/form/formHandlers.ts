﻿import * as ko from "knockout";
import { IWidgetBinding } from "@paperbits/common/editing";
import * as Utils from "@paperbits/common/utils";
import { IWidgetOrder } from '@paperbits/common/editing';
import { IContentDropHandler } from '@paperbits/common/editing';
import { IContentDescriptor } from '@paperbits/common/editing';
import { IWidgetHandler } from '@paperbits/common/editing';
import { IWidgetFactoryResult } from '@paperbits/common/editing';
import { FormModelBinder } from "@paperbits/common/widgets/form/formModelBinder";
import { Contract } from "@paperbits/common/contract";


export class FormHandlers implements IWidgetHandler {
    private readonly formModelBinder: FormModelBinder;

    constructor(formModelBinder: FormModelBinder) {
        this.formModelBinder = formModelBinder;
    }

    private async prepareWidgetOrder(config: Contract): Promise<IWidgetOrder> {
        let model = await this.formModelBinder.nodeToModel(config);

        let factoryFunction: () => IWidgetFactoryResult = () => {
            throw "Not implemented.";
        }

        let widgetOrder: IWidgetOrder = {
            name: "form",
            displayName: "Form",
            iconClass: "paperbits-form",
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
            type: "form",
            label: "Form",
            style: "default"
        }
        return await this.prepareWidgetOrder(config);
    }

    public getWidgetOrder(): Promise<IWidgetOrder> {
        return Promise.resolve(this.getWidgetOrderByConfig());
    }
}