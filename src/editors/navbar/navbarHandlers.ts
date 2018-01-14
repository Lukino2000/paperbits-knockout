import * as ko from "knockout";
import * as Utils from '@paperbits/common/utils';
import ILazy = Utils.ILazy;
import { ICreatedMedia } from "@paperbits/common/media/ICreatedMedia";
import { IWidgetFactoryResult } from "@paperbits/common/editing/IWidgetFactoryResult";
import { NavbarModel } from "@paperbits/common/widgets/navbar/navbarModel";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { IWidgetBinding } from "@paperbits/common/editing/IWidgetBinding";
import { IWidgetOrder } from '@paperbits/common/editing/IWidgetOrder';
import { IContentDropHandler } from '@paperbits/common/editing/IContentDropHandler';
import { MediaHandlers } from '../../editors/mediaHandlers';
import { IWidgetHandler } from '@paperbits/common/editing/IWidgetHandler';
import { IDataTransfer } from '@paperbits/common/editing/IDataTransfer';
import { IContentDescriptor } from '@paperbits/common/editing/IContentDescriptor';
import { PromiseToDelayedComputed } from '../../core/task';
import { NavbarModelBinder } from "@paperbits/common/widgets/navbar/navbarModelBinder";
import { Contract } from "@paperbits/common/contract";


export class NavbarHandlers implements IWidgetHandler {
    private readonly navbarModelBinder: NavbarModelBinder;

    constructor(navbarModelBinder: NavbarModelBinder) {
        this.navbarModelBinder = navbarModelBinder;
    }

    private async getWidgetOrderByConfig(): Promise<IWidgetOrder> {


        let node = {
            object: "block",
            type: "navbar",
            rootKey: "navigationItems/main" // TODO: This is temporary, until multiple menus support is implemented.
        };

        let model = await this.navbarModelBinder.nodeToModel(node);


        let widgetOrder: IWidgetOrder = {
            name: "navbar",
            displayName: "Navigation bar",
            iconClass: "paperbits-menu-34",
            createWidget: () => {
                throw "Not implemented.";

                // let widgetModel = await this.navbarModelBinder.modelToWidgetModel(model);
                // let htmlElement = document.createElement("widget");
                // htmlElement.style.width = "150px";

                // ko.applyBindingsToNode(htmlElement, { widget: widgetModel });
                // htmlElement["attachedModel"] = widgetModel.model;

                // return {
                //     element: htmlElement
                // }
            },
            createModel: () => {
                return model;
            }
        }

        return widgetOrder;
    }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        return await this.getWidgetOrderByConfig();
    }
}