import * as ko from "knockout";
import * as Utils from '@paperbits/common/utils';
import ILazy = Utils.ILazy;
import { ICreatedMedia } from "@paperbits/common/media/ICreatedMedia";
import { IWidgetFactoryResult } from "@paperbits/common/editing";
import { NavbarModel } from "@paperbits/common/widgets/navbar/navbarModel";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { IWidgetBinding } from "@paperbits/common/editing";
import { IWidgetOrder } from '@paperbits/common/editing';
import { IContentDropHandler } from '@paperbits/common/editing';
import { MediaHandlers } from '../../editors/mediaHandlers';
import { IWidgetHandler } from '@paperbits/common/editing';
import { IDataTransfer } from '@paperbits/common/editing';
import { IContentDescriptor } from '@paperbits/common/editing';
import { PromiseToDelayedComputed } from '../../core/task';
import { NavbarModelBinder } from "@paperbits/common/widgets/navbar/navbarModelBinder";
import { Contract } from "@paperbits/common/contract";


export class NavbarHandlers implements IWidgetHandler {
    private readonly navbarModelBinder: NavbarModelBinder;

    constructor(navbarModelBinder: NavbarModelBinder) {
        this.navbarModelBinder = navbarModelBinder;
    }

    private async getWidgetOrderByConfig(): Promise<IWidgetOrder> {
        const node = {
            object: "block",
            type: "navbar",
            rootKey: "navigationItems/main" // TODO: This is temporary, until multiple menus support is implemented.
        };

        const model = await this.navbarModelBinder.nodeToModel(node);

        const widgetOrder: IWidgetOrder = {
            name: "navbar",
            displayName: "Navigation bar",
            iconClass: "paperbits-menu-34",
            createWidget: () => {
                throw "Not implemented.";
            },
            createModel: async () => {
                return model;
            }
        }

        return widgetOrder;
    }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        return await this.getWidgetOrderByConfig();
    }
}