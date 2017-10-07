import template from "./sectionLayoutSelector.html";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { SectionModel } from "@paperbits/common/widgets/section/sectionModel";
import { ColumnModel } from "@paperbits/common/widgets/column/columnModel";
import { RowModel } from "@paperbits/common/widgets/row/rowModel";
import { Component } from "../../decorators/component";
import { SliderModel } from "@paperbits/common/widgets/slider/sliderModel";


@Component({
    selector: "section-layout-selector",
    template: template,
    injectable: "sectionLayoutSelector"
})
export class SectionLayoutSelector implements IResourceSelector<any> {
    public readonly onResourceSelected: (model) => void;

    constructor(onSelect: (sectionModel: any) => void) {
        this.selectSectionLayout = this.selectSectionLayout.bind(this);
        this.onResourceSelected = onSelect;
    }

    public selectSectionLayout(layout: string): void {
        let sectionModel;

        if (layout === "slider") {
            sectionModel = new SliderModel();
        }
        else {
            sectionModel = new SectionModel();
            sectionModel.layout = layout;
        }

        if (this.onResourceSelected) {
            this.onResourceSelected(sectionModel);
        }
    }
}