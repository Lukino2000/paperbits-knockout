import * as ko from "knockout";
import template from "./navigation.html";
import { INavigationService } from "@paperbits/common/navigation/INavigationService";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { NavigationItemContract } from "@paperbits/common/navigation/NavigationItemContract";
import { NavigationTree } from "../../workshops/navigation/navigationTree";
import { NavigationItemViewModel } from "../../workshops/navigation/navigationItemViewModel";
import { Component } from "../../decorators/component";


@Component({
    selector: "navigation",
    template: template,
    injectable: "navigationWorkshop"
})
export class NavigationWorkshop {
    private navigationService: INavigationService;
    private readonly permalinkService: IPermalinkService;
    private selectedNavigationItem: KnockoutObservable<NavigationItemViewModel>;

    public viewManager: IViewManager;
    public navigationItemsTree: KnockoutObservable<NavigationTree>;

    constructor(navigationService: INavigationService, permalinkService: IPermalinkService, viewManager: IViewManager) {
        // initialization...
        this.navigationService = navigationService;
        this.permalinkService = permalinkService;
        this.viewManager = viewManager;

        // rebinding...
        this.onNavigationUpdate = this.onNavigationUpdate.bind(this);
        this.onNavigationItemLoaded = this.onNavigationItemLoaded.bind(this);
        this.selectNavigationItem = this.selectNavigationItem.bind(this);
        this.navigationItemsTree = ko.observable<NavigationTree>();
        this.selectedNavigationItem = ko.observable<NavigationItemViewModel>();

        this.searchNavigationItems();
    }

    private async searchNavigationItems(): Promise<void> {
        let navitems = await this.navigationService.getNavigationItems();
        this.onNavigationItemLoaded(navitems);
    }

    public onNavigationUpdate(topLevelMenus: Array<NavigationItemContract>): void {
        this.navigationService.updateNavigationItem(topLevelMenus[0]); //TODO: For now user can have only one menu
    }

    private onNavigationItemLoaded(navigationItems: Array<NavigationItemContract>): void {
        var navigationTree = new NavigationTree(navigationItems);
        this.navigationItemsTree(navigationTree);

        navigationTree.onUpdate.subscribe(this.onNavigationUpdate);
    }

    public addNavigationItem(): void {
        var newNode = this.navigationItemsTree().addNode("< New >");

        this.selectNavigationItem(newNode);
    }

    public isNodeSelected(): boolean {
        return !!(this.navigationItemsTree() && this.navigationItemsTree().focusedNode());
    }

    public async selectNavigationItem(navigationItem: NavigationItemViewModel): Promise<void> {
        this.selectedNavigationItem(navigationItem);
        
        this.viewManager.openViewAsWorkshop("Navigation item", "navigation-details-workshop", {
            navigationItem: navigationItem,
            onDeleteCallback: () => {
                this.searchNavigationItems();
            }
        });
    }
}
