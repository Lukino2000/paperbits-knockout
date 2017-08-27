import * as ko from "knockout";
import * as template from "./columnEditor.html";
import * as Utils from "@paperbits/common/core/utils";
import { IMedia } from "@paperbits/common/media/IMedia";
import { ColumnViewModel } from "../../widgets/column/columnViewModel";
import { IMediaService } from "@paperbits/common/media/IMediaService";
import { ICreatedMedia } from "@paperbits/common/media/ICreatedMedia";
import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { IWidgetEditor } from "@paperbits/common/widgets/IWidgetEditor";
import { ColumnModel } from "@paperbits/common/widgets/column/columnModel";
import { IEventManager } from "@paperbits/common/events/IEventManager";
import { Component } from "../../decorators/component";


@Component({
    selector: "layout-column-editor",
    template: template,
    injectable: "columnEditor"
})
export class ColumnEditor implements IWidgetEditor {
    private readonly viewManager: IViewManager;

    private column: ColumnModel;
    private applyChangesCallback: () => void;
    private verticalAlignment: string;
    private horizontalAlignment: string;

    public readonly alignment: KnockoutObservable<string>;
    public readonly order: KnockoutObservable<number>;

    constructor(viewManager: IViewManager) {
        this.viewManager = viewManager;
        this.setWidgetModel = this.setWidgetModel.bind(this);

        this.alignment = ko.observable<string>();
        this.alignment.subscribe(this.onChange.bind(this));

        this.order = ko.observable<number>();
        this.order.subscribe(this.onChange.bind(this));

        this.topLeft.bind(this);
        this.top.bind(this);
        this.topRight.bind(this);
        this.left.bind(this);
        this.center.bind(this);
        this.right.bind(this);
        this.bottomLeft.bind(this);
        this.bottom.bind(this);
        this.bottomRight.bind(this);
    }

    /**
     * Collecting changes from the editor UI and invoking callback method.
     */
    private onChange(): void {
        if (!this.applyChangesCallback) {
            return;
        }

        let viewport = this.viewManager.getViewport();

        switch (viewport) {
            case "xl":
                this.column.alignmentXl = this.alignment();
                this.column.orderXl = this.order();
                break;
                
            case "lg":
                this.column.alignmentLg = this.alignment();
                this.column.orderLg = this.order();
                break;

            case "md":
                this.column.alignmentMd = this.alignment();
                this.column.orderMd = this.order();
                break;

            case "sm":
                this.column.alignmentSm = this.alignment();
                this.column.orderSm = this.order();
                break;

            case "xs":
                this.column.alignmentXs = this.alignment();
                this.column.orderXs = this.order();
                break;

            default:
                throw "Unknown viewport";
        }

        this.applyChangesCallback();
    }

    public alignContent(alignment: string): void {
        this.alignment(alignment);
    }

    private align(): void {
        this.alignment(`${this.verticalAlignment} ${this.horizontalAlignment}`);
    }

    public setWidgetModel(column: ColumnModel, applyChangesCallback?: () => void): void {
        this.column = column;

        let viewport = this.viewManager.getViewport();

        switch (viewport) {
            case "xl":
                this.alignment(this.column.alignmentXl);
                this.order(this.column.orderXl);
                break;

            case "lg":
                this.alignment(this.column.alignmentLg);
                this.order(this.column.orderLg);
                break;

            case "md":
                this.alignment(this.column.alignmentMd);
                this.order(this.column.orderMd);
                break;

            case "sm":
                this.alignment(this.column.alignmentSm);
                this.order(this.column.orderSm);
                break;

            case "xs":
                this.alignment(this.column.alignmentXs);
                this.order(this.column.orderXs);
                break;

            default:
                throw "Unknown viewport";
        }

        this.applyChangesCallback = applyChangesCallback;
    }

    public toggleHorizontal(): void {
        switch (this.horizontalAlignment) {
            case "center":
                this.horizontalAlignment = "around";
                break;
            case "around":
                this.horizontalAlignment = "between";
                break;
            case "between":
                this.horizontalAlignment = "center";
                break;
        }
    }

    public toggleVertical(): void {
        switch (this.verticalAlignment) {
            case "middle":
                this.verticalAlignment = "around";
                break;
            case "around":
                this.verticalAlignment = "between";
                break;
            case "between":
                this.verticalAlignment = "middle";
                break;
        }
    }

    public topLeft(): void {
        this.verticalAlignment = "top";
        this.horizontalAlignment = "start";
        this.align();
    }

    public top(): void {
        if (this.verticalAlignment === "top" && (this.horizontalAlignment === "center" || this.horizontalAlignment === "around" || this.horizontalAlignment === "between")) {
            this.toggleHorizontal();
        }
        else {
            this.verticalAlignment = "top";
            this.horizontalAlignment = "center";
        }
        this.align();
    }

    public topRight(): void {
        this.verticalAlignment = "top";
        this.horizontalAlignment = "end";
        this.align();
    }

    public left(): void {
        // if (this.horizontalAlignment === "start") {  // This would work only with changing flex direction
        //     this.toggleVertical();
        // }
        // else {
        //     this.verticalAlignment = "middle";
        //     this.horizontalAlignment = "start";
        // }

        this.verticalAlignment = "middle";
        this.horizontalAlignment = "start";
        this.align();
    }

    public center(): void {
        if (this.verticalAlignment === "middle" && (this.horizontalAlignment === "center" || this.horizontalAlignment === "around" || this.horizontalAlignment === "between")) {
            this.toggleHorizontal();
        }
        else {
            this.verticalAlignment = "middle";
            this.horizontalAlignment = "center";
        }

        this.align();
    }

    public right(): void {
        // if (this.horizontalAlignment === "end") {
        //     this.toggleVertical();
        // }
        // else {
        //     this.verticalAlignment = "middle";
        //     this.horizontalAlignment = "end";
        // }

        this.verticalAlignment = "middle";
        this.horizontalAlignment = "end";
        this.align();
    }

    public bottomLeft(): void {
        this.verticalAlignment = "bottom";
        this.horizontalAlignment = "start";
        this.align();
    }

    public bottom(): void {
        if (this.verticalAlignment === "bottom" && (this.horizontalAlignment === "center" || this.horizontalAlignment === "around" || this.horizontalAlignment === "between")) {
            this.toggleHorizontal();
        }
        else {
            this.verticalAlignment = "bottom";
            this.horizontalAlignment = "center";
        }
        this.align();
    }

    public bottomRight(): void {
        this.verticalAlignment = "bottom";
        this.horizontalAlignment = "end";
        this.align();
    }
}
