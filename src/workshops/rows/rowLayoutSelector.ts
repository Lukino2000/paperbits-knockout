import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { ColumnModel } from "@paperbits/common/widgets/models/columnModel";
import { RowModel } from "@paperbits/common/widgets/models/rowModel";

export class RowLayoutSelector implements IResourceSelector<RowModel> {
    public readonly onResourceSelected: (rowModel: RowModel) => void;
    public readonly rowConfigs = [[12], [6, 6], [4, 4, 4], [3, 3, 3, 3], [8, 4], [4, 8], [3, 9], [9, 3], [6, 3, 3], [3, 3, 6], [3, 6, 3]];

    constructor(onSelect: (rowModel: RowModel) => void) {
        this.selectRowLayout = this.selectRowLayout.bind(this);
        this.onResourceSelected = onSelect;
    }

    public selectRowLayout(columnSizes: number[]): void {
        let rowModel = new RowModel();

        columnSizes.forEach(size => {
            let column = new ColumnModel();
            column.sizeSm = size;
            column.sizeMd = size;
            column.sizeLg = size;
            rowModel.columns.push(column);
        });

        if (this.onResourceSelected) {
            this.onResourceSelected(rowModel);
        }
    }
}