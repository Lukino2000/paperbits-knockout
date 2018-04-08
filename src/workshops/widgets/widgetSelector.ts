import * as ko from "knockout";
import template from "./widgetSelector.html";
import { WidgetItem } from "./widgetItem";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { IWidgetService } from "@paperbits/common/widgets/IWidgetService";
import { Component } from "../../decorators/component";


@Component({
    selector: "widget-selector",
    template: template,
    injectable: "widgetSelector"
})
export class WidgetSelector implements IResourceSelector<Object> {
    private readonly widgetService: IWidgetService;
    public readonly onResourceSelected: (widgetModel: Object) => void;

    public readonly widgets: KnockoutObservable<Array<WidgetItem>>;
    public readonly working: KnockoutObservable<boolean>;

    constructor(widgetService: IWidgetService, onSelect: (widgetModel: Object) => void) {
        // initialization...
        this.widgetService = widgetService;
        this.onResourceSelected = onSelect;

        // rebinding...
        this.selectWidget = this.selectWidget.bind(this);

        // setting up...
        this.working = ko.observable(true);
        this.widgets = ko.observable<Array<WidgetItem>>();

        this.loadWidgetOrders();
    }

    private async loadWidgetOrders(): Promise<void> {
        this.working(true);

        var items = new Array<WidgetItem>();

        let widgetOrders = await this.widgetService.getWidgetOrders();

        widgetOrders.forEach((widgetOrder) => {
            let widgetItem = new WidgetItem();

            widgetItem.css = `${widgetOrder.iconClass}`,
            widgetItem.displayName = widgetOrder.displayName;
            widgetItem.widgetOrder = widgetOrder;

            items.push(widgetItem);
        });

        this.widgets(items);
        this.working(false);
    }

    public async selectWidget(widgetItem: WidgetItem): Promise<void> {
        // TODO: We should switch Widget Orders from elements to models;

        //let widgetElement = widgetItem.widgetOrder.createWidget().element;
        //let widgetModel = widgetElement["attachedModel"];

        const model = await widgetItem.widgetOrder.createModel();

        this.onResourceSelected(model);
    }
}