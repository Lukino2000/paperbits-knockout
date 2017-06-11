import * as ko from "knockout";
import { IWidgetOrder } from "@paperbits/common/editing/IWidgetOrder";

export class WidgetItem {
    public title: string;
    public widgetOrder: IWidgetOrder;
    public element: HTMLElement;
    public hasFocus: KnockoutObservable<boolean>;

    constructor() {
        this.hasFocus = ko.observable<boolean>();
    }
}
