import * as ko from "knockout";
import { IBlock } from "@paperbits/common/blocks/IBlock";
import { Contract } from "@paperbits/common/editing/contentNode";


export class BlockItem {
    public key: string;
    public content: Contract;

    public hasFocus: KnockoutObservable<boolean>;
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;

    constructor(block: IBlock) {
        this.key = block.key;
        this.content = block.content;
        this.title = ko.observable<string>(block.title);
        this.description = ko.observable<string>(block.description);
        this.hasFocus = ko.observable<boolean>();
    }

    public toBlock(): IBlock {
        return {
            key: this.key,
            title: this.title(),
            description: this.description(),
            content: this.content
        }
    }
}