import * as ko from "knockout";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { IPermalink } from '@paperbits/common/permalinks/IPermalink';
import { IPermalinkService } from '@paperbits/common/permalinks';
import { LayoutContract } from "@paperbits/common/layouts/layoutContract";
import { ILayoutService } from "@paperbits/common/layouts";
import { LayoutItem } from "./layoutItem";


export class LayoutSelector implements IResourceSelector<LayoutContract> {
    private readonly layoutService: ILayoutService;
    private readonly permalinkService: IPermalinkService;

    public readonly searchPattern: KnockoutObservable<string>;
    public readonly layouts: KnockoutObservableArray<LayoutItem>;
    public readonly working: KnockoutObservable<boolean>;

    public selectedLayout: KnockoutObservable<LayoutItem>;
    public onResourceSelected: (layout: LayoutContract) => void;

    constructor(layoutService: ILayoutService, permalinkService: IPermalinkService, onSelect: (media: LayoutContract) => void) {
        this.layoutService = layoutService;
        this.permalinkService = permalinkService;

        this.selectLayout = this.selectLayout.bind(this);
        this.onResourceSelected = onSelect;

        this.layouts = ko.observableArray<LayoutItem>();
        this.selectedLayout = ko.observable<LayoutItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchLayouts);
        this.working = ko.observable(true);

        // setting up...
        this.layouts = ko.observableArray<LayoutItem>();
        this.selectedLayout = ko.observable<LayoutItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchLayouts);
        this.working = ko.observable(true);

        this.searchLayouts();
    }

    public async searchLayouts(searchPattern: string = ""): Promise<void> {
        this.working(true);

        let layouts = await this.layoutService.search(searchPattern);
        let layoutItems = layouts.map(layout => new LayoutItem(layout));
        this.layouts(layoutItems);
        this.working(false);
    }

    public async selectLayout(layout: LayoutItem): Promise<void> {
        this.selectedLayout(layout);

        if (this.onResourceSelected) {
            this.onResourceSelected(layout.toLayout());
        }
    }
}