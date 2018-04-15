import template from "./addBlockDialog.html";
import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { BlockContract } from '@paperbits/common/blocks/blockContract';
import { IPermalink } from '@paperbits/common/permalinks/IPermalink';
import { IPermalinkService } from '@paperbits/common/permalinks';
import { IBlockService } from '@paperbits/common/blocks/IBlockService';
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { SectionModelBinder } from "@paperbits/common/widgets/section/sectionModelBinder";
import { SectionModel } from "@paperbits/common/widgets/section/sectionModel";
import { Component } from "../../decorators/component";


@Component({
    selector: "add-block-dialog",
    template: template,
    injectable: "addBlockDialog"
})
export class AddBlockDialog {
    public readonly working: KnockoutObservable<boolean>;
    public readonly name: KnockoutObservable<string>;

    constructor(
        private readonly viewManager: IViewManager,
        private readonly blockService: IBlockService,
        private readonly sectionModelBinder: SectionModelBinder,
        private readonly sectionModel: SectionModel
    ) {
        this.addBlock = this.addBlock.bind(this);

        this.working = ko.observable(false);
        this.name = ko.observable<string>();
        this.name.extend({ required: true });
    }

    public async addBlock(): Promise<void> {
        const content = this.sectionModelBinder.getConfig(this.sectionModel);

        await this.blockService.createBlock(this.name(), "", content);

        this.closeEditor();
    }

    public closeEditor(): void {
        this.viewManager.closeWidgetEditor();
    }
}