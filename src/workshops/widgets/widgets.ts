import * as ko from "knockout";
import template from "./widgets.html";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { IWidgetOrder } from "@paperbits/common/editing/IWidgetOrder";
import { IWidgetService } from "@paperbits/common/widgets/IWidgetService";
import { WidgetItem } from "../../workshops/widgets/widgetItem";
import { LayoutEditor } from "../../editors/layout/layoutEditor";
import { Component } from "../../decorators/component";

@Component({
    selector: "widgets",
    template: template,
    injectable: "widgetsWorkshop"
})
export class WidgetsWorkshop {
    private readonly widgetService: IWidgetService;
    private readonly layoutEditor: LayoutEditor;
    private readonly viewManager: IViewManager;

    public readonly widgets: KnockoutObservable<Array<WidgetItem>>;
    public readonly working: KnockoutObservable<boolean>;

    constructor(widgetService: IWidgetService, layoutEditor: LayoutEditor, viewManager: IViewManager) {
        // initialization...
        this.widgetService = widgetService;
        this.layoutEditor = layoutEditor; //TODO: Review usage and remove;
        this.viewManager = viewManager;

        // rebinding...
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);

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

            widgetItem.css = `icon-${widgetOrder.name}`,
            widgetItem.displayName = widgetOrder.displayName;
            widgetItem.widgetOrder = widgetOrder;

            items.push(widgetItem);
        });

        this.widgets(items);
        this.working(false);
    }

    public onDragStart(item: WidgetItem): HTMLElement {
        this.viewManager.foldEverything();

        var widgetElement = item.widgetOrder.createWidget().element;

        item.element = widgetElement;
        return widgetElement;
    }

    public onDragEnd(item: WidgetItem): void {
        this.layoutEditor.onWidgetDragEnd(item, item.element);
    }
}