import * as ko from "knockout";
import { IWidgetBinding } from "@paperbits/common/editing/IWidgetBinding";
import * as Utils from "@paperbits/common/utils";
import { IWidgetOrder } from '@paperbits/common/editing/IWidgetOrder';
import { IContentDropHandler } from '@paperbits/common/editing/IContentDropHandler';
import { IContentDescriptor } from '@paperbits/common/editing/IContentDescriptor';
import { IWidgetHandler } from '@paperbits/common/editing/IWidgetHandler';
import { IWidgetFactoryResult } from '@paperbits/common/editing/IWidgetFactoryResult';
import { TestimonialsModelBinder } from "../../widgets/testimonials/testimonialsModelBinder";
import { Contract } from "@paperbits/common/contract";


export class TestimonialsHandlers implements IWidgetHandler {
    private readonly testimonialsModelBinder: TestimonialsModelBinder;

    constructor(testimonialsModelBinder: TestimonialsModelBinder) {
        this.testimonialsModelBinder = testimonialsModelBinder;
    }

    private async prepareWidgetOrder(config: Contract): Promise<IWidgetOrder> {
        let model = await this.testimonialsModelBinder.nodeToModel(config);

        let factoryFunction: () => IWidgetFactoryResult = () => {
            throw "Not implemented.";
        }

        let widgetOrder: IWidgetOrder = {
            name: "testimonials",
            displayName: "Testimonials",
            iconClass: "paperbits-testimonials",
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
            type: "testimonials",
            label: "Testimonials",
            style: "default"
        }
        return await this.prepareWidgetOrder(config);
    }

    public getWidgetOrder(): Promise<IWidgetOrder> {
        return Promise.resolve(this.getWidgetOrderByConfig());
    }
}