import template from "./rowLayoutSelector.html";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { ColumnModel } from "@paperbits/common/widgets/column/columnModel";
import { RowModel } from "@paperbits/common/widgets/row/rowModel";
import { Component } from "../../decorators/component";


export interface ColumnSize {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    display?: number;
}

@Component({
    selector: "row-layout-selector",
    template: template,
    injectable: "rowLayoutSelector"
})
export class RowLayoutSelector implements IResourceSelector<RowModel> {
    public readonly onResourceSelected: (rowModel: RowModel) => void;
    public readonly rowConfigs: ColumnSize[][] = [
        [{ xs: 12 }],
        [{ xs: 12, md: 6 }, { xs: 12, md: 6 }],
        [{ xs: 12, md: 4 }, { xs: 12, md: 4 }, { xs: 12, md: 4 }],
        [{ xs: 12, md: 3 }, { xs: 12, md: 3 }, { xs: 12, md: 3 }, { xs: 12, md: 3 }],
        [{ xs: 12, md: 8 }, { xs: 12, md: 4 }], [{ xs: 12, md: 4 }, { xs: 12, md: 8 }],
        [{ xs: 12, md: 3 }, { xs: 12, md: 9 }], [{ xs: 12, md: 9 }, { xs: 12, md: 3 }],
        [{ xs: 12, md: 6 }, { xs: 12, md: 3 }, { xs: 12, md: 3 }],
        [{ xs: 12, md: 3 }, { xs: 12, md: 3 }, { xs: 12, md: 6 }],
        [{ xs: 12, md: 3 }, { xs: 12, md: 6 }, { xs: 12, md: 3 }]
    ];

    constructor(onSelect: (rowModel: RowModel) => void) {
        this.selectRowLayout = this.selectRowLayout.bind(this);
        this.onResourceSelected = onSelect;
    }

    public selectRowLayout(columnSizes: ColumnSize[]): void {
        let rowModel = new RowModel();

        columnSizes.forEach(size => {
            let column = new ColumnModel();
            column.sizeXs = size.xs;
            column.sizeSm = size.sm;
            column.sizeMd = size.md;
            column.sizeLg = size.lg;
            column.sizeXl = size.xl;
            rowModel.columns.push(column);
        });

        if (this.onResourceSelected) {
            this.onResourceSelected(rowModel);
        }
    }
}