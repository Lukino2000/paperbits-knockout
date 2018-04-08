import * as ko from "knockout";
import { IWidgetBinding } from "@paperbits/common/editing/IWidgetBinding";
import { IWidgetOrder } from '@paperbits/common/editing/IWidgetOrder';
import { IContentDropHandler } from '@paperbits/common/editing/IContentDropHandler';
import { IContentDescriptor } from '@paperbits/common/editing/IContentDescriptor';
import { IWidgetHandler } from '@paperbits/common/editing/IWidgetHandler';
import { IWidgetFactoryResult } from '@paperbits/common/editing/IWidgetFactoryResult';
import { Contract } from "@paperbits/common/contract";
import { ContentTableModelBinder } from "@paperbits/common/widgets/content-table/contentTableModelBinder";
import { IViewManager } from "@paperbits/common/ui/IViewManager";

export class ContentTableHandlers implements IWidgetHandler {
    private readonly viewManager: IViewManager;
    private readonly modelBinder: ContentTableModelBinder;

    constructor(contentTableModelBinder: ContentTableModelBinder, viewManager: IViewManager) {
        this.viewManager = viewManager;
        this.modelBinder = contentTableModelBinder;
    }

    private async getWidgetOrderByConfig(): Promise<IWidgetOrder> {


        let factoryFunction: () => IWidgetFactoryResult = () => {
            throw "Not implemented.";
        }

        let widgetOrder: IWidgetOrder = {
            name: "content-table",
            displayName: "Table of contents",
            iconClass: "paperbits-content-table",
            createWidget: factoryFunction,
            createModel: async () => {
                const currentPage = await this.viewManager.getCurrentPage();
                const config = {
                    object: "block",
                    type: "content-table",
                    title: "Table of contents",
                    targetPermalinkKey: currentPage.permalinkKey
                };
                let model = await this.modelBinder.nodeToModel(config);

                return model;
            }
        }

        return widgetOrder;
    }

    public getWidgetOrder(): Promise<IWidgetOrder> {
        return Promise.resolve(this.getWidgetOrderByConfig());
    }
}