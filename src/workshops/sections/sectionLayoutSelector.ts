import template from "./sectionLayoutSelector.html";
import { Component } from "../../decorators/component";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { SectionModel } from "@paperbits/common/widgets/section/sectionModel";
import { ColumnModel } from "@paperbits/common/widgets/column/columnModel";
import { RowModel } from "@paperbits/common/widgets/row/rowModel";
import { SliderModel } from "@paperbits/common/widgets/slider/sliderModel";
import { BlockContract } from "@paperbits/common/blocks/BlockContract";
import { IBlockService } from "@paperbits/common/blocks/IBlockService";
import { ModelBinderSelector } from "@paperbits/common/widgets/modelBinderSelector";


@Component({
    selector: "section-layout-selector",
    template: template,
    injectable: "sectionLayoutSelector"
})
export class SectionLayoutSelector implements IResourceSelector<any> {
    public readonly onResourceSelected: (model) => void;
    private readonly modelBinderSelector: ModelBinderSelector;

    constructor(onSelect: (sectionModel: any) => void, modelBinderSelector: ModelBinderSelector) {
        this.onResourceSelected = onSelect;
        this.modelBinderSelector = modelBinderSelector;

        this.selectSectionLayout = this.selectSectionLayout.bind(this);
        this.onBlockSelected = this.onBlockSelected.bind(this);
    }

    public selectSectionLayout(layout: string): void {
        let sectionModel;

        if (layout === "slider") { // This will go away when blocks are implemented
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

    public async onBlockSelected(block: BlockContract): Promise<void> {
        const modelBinder = this.modelBinderSelector.getModelBinderByNodeType(block.content.type);
        const model = await modelBinder.nodeToModel(block.content);

        if (this.onResourceSelected) {
            this.onResourceSelected(model);
        }
    }
}