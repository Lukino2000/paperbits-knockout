import * as ko from "knockout";
import * as Utils from "@paperbits/common/core/utils";
import { TextblockModel } from "@paperbits/common/widgets/textblock/textblockModel";
import { TextblockModelBinder } from "@paperbits/common/widgets/textblock/textblockModelBinder";
import { IWidgetOrder } from "@paperbits/common/editing/IWidgetOrder";
import { IWidgetFactoryResult } from "@paperbits/common/editing/IWidgetFactoryResult";
import { IWidgetHandler } from "@paperbits/common/editing/IWidgetHandler";
import { TextblockViewModel } from "../../widgets/textblock/textblockViewModel";

export const nodeName = "paperbits-text";

export class TextblockHandlers implements IWidgetHandler {
    private readonly textblockModelBinder: TextblockModelBinder;

    constructor(textModelBinder: TextblockModelBinder) {
        this.textblockModelBinder = textModelBinder;
    }

    public async getWidgetOrderByConfig(): Promise<IWidgetOrder> {
        let textblockModel = new TextblockModel({
            "nodes": [
                {
                    "kind": "block",
                    "nodes": [
                        {
                            "kind": "text",
                            "text": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna."
                        }
                    ],
                    "type": "paragraph"
                }]
        });

        let widgetOrder: IWidgetOrder = {
            name: "text-block",
            displayName: "Text block",
            iconClass: "paperbits-edit-2",

            createWidget: () => {
                throw "Not implemented.";

                // let textblockWidgetModel = await this.textblockModelBinder.modelToWidgetModel(textblockModel);
                // let htmlElement = document.createElement("widget");
                // htmlElement.style.width = "25%";
                // ko.applyBindingsToNode(htmlElement, { widget: textblockWidgetModel });
                // htmlElement["attachedModel"] = textblockWidgetModel.model;
                // return { element: htmlElement }
            },
            createModel: () => {
                return textblockModel;
            }
        }

        return widgetOrder;
    }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        return await this.getWidgetOrderByConfig();
    }
}