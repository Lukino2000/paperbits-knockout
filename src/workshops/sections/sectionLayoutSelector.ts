import * as template from "./sectionLayoutSelector.html";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { SectionModel } from "@paperbits/common/widgets/models/sectionModel";
import { ColumnModel } from "@paperbits/common/widgets/models/columnModel";
import { RowModel } from "@paperbits/common/widgets/models/rowModel";
import { Component } from "../../decorators/component";


@Component({
    selector: "section-layout-selector",
    template: template,
    injectable: "sectionLayoutSelector"
})
export class SectionLayoutSelector implements IResourceSelector<SectionModel> {
    public readonly onResourceSelected: (rowModel: SectionModel) => void;

    constructor(onSelect: (sectionModel: SectionModel) => void) {
        this.selectSectionLayout = this.selectSectionLayout.bind(this);
        this.onResourceSelected = onSelect;
    }

    public selectSectionLayout(layout: string): void {
        let sectionModel = new SectionModel();

        sectionModel.layout = layout;

        if (this.onResourceSelected) {
            this.onResourceSelected(sectionModel);
        }
    }
}