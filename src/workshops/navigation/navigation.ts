import * as ko from "knockout";
import { INavigationService } from "@paperbits/common/navigation/INavigationService";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { INavigationItem } from "@paperbits/common/navigation/INavigationItem";
import { NavigationTree } from "../../workshops/navigation/navigationTree";
import { NavigationTreeNode } from "../../workshops/navigation/navigationTreeNode";


export class NavigationWorkshop {
    private navigationService: INavigationService;
    private readonly permalinkService: IPermalinkService;
    private selectedNavigationItem: KnockoutObservable<NavigationTreeNode>;

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
        this.selectedNavigationItem = ko.observable<NavigationTreeNode>();

        this.init();
    }

    private async init(): Promise<void> {
        let navitems = await this.navigationService.getNavigationItems();
        this.onNavigationItemLoaded(navitems);
    }

    public onNavigationUpdate(topLevelMenus: Array<INavigationItem>): void {
        this.navigationService.updateNavigationItem(topLevelMenus[0]); //TODO: For now user can have only one menu
    }

    private onNavigationItemLoaded(navigationItems: Array<INavigationItem>): void {
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

    public async selectNavigationItem(navigationItem: NavigationTreeNode): Promise<void> {
        let hyperlink = navigationItem.hyperlink();

        // console.log("select");
        // console.log(hyperlink);

        // if (hyperlink && !url) {
        //     let permalink = await this.permalinkService.getPermalinkByKey(hyperlink);
        //     navigationItem.url(permalink ? permalink.uri : null);
        //     this.selectedNavigationItem(navigationItem);
        //     this.viewManager.openWorkshop("navigation-details-workshop", navigationItem);

        // } else {
        //     this.selectedNavigationItem(navigationItem);
        //     this.viewManager.openWorkshop("navigation-details-workshop", navigationItem);
        // }

        this.selectedNavigationItem(navigationItem);
        this.viewManager.openWorkshop("navigation-details-workshop", navigationItem);
    }
}
