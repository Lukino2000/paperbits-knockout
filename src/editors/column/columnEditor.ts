import * as ko from "knockout";
import { IMedia } from "@paperbits/common/media/IMedia";
import * as Utils from "@paperbits/common/core/utils";
import { ColumnViewModel } from "../../widgets/column/columnViewModel";
import { IMediaService } from "@paperbits/common/media/IMediaService";
import { ICreatedMedia } from "@paperbits/common/media/ICreatedMedia";
import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { IWidgetEditor } from "@paperbits/common/widgets/IWidgetEditor";
import { ColumnModel } from "@paperbits/common/widgets/models/columnModel";
import { IEventManager } from "@paperbits/common/events/IEventManager";

export class ColumnEditor implements IWidgetEditor {
    private readonly viewManager: IViewManager;

    private column: ColumnModel;
    private applyChangesCallback: () => void;

    private verticalAlignment: string;
    private horizontalAlignment: string;

    public readonly alignment: KnockoutObservable<string>;

    constructor(viewManager: IViewManager) {
        this.viewManager = viewManager;
        this.setWidgetModel = this.setWidgetModel.bind(this);

        this.alignment = ko.observable<string>();
        this.alignment.subscribe(this.onChange.bind(this));

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
            case "desktop":
                this.column.alignmentLg = this.alignment();
                break;

            case "tablet":
                this.column.alignmentMd = this.alignment();
                break;

            case "phone":
                this.column.alignmentSm = this.alignment();
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
            case "desktop":
                this.alignment(this.column.alignmentLg);
                break;

            case "tablet":
                this.alignment(this.column.alignmentMd);
                break;

            case "phone":
                this.alignment(this.column.alignmentSm);
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
