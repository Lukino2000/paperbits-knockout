import * as ko from "knockout";
import { IEditorSession } from "@paperbits/common/ui/IEditorSession";
import { PermalinkService } from "@paperbits/common/permalinks/permalinkService";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { INavigationService } from "@paperbits/common/navigation/INavigationService";
import { NavigationTreeNode } from "../../workshops/navigation/navigationTreeNode";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";

export class NavigationDetailsWorkshop {
    private navigationService: INavigationService;

    public readonly hyperlinkTitle: KnockoutObservable<string>;
    public readonly hyperlink: KnockoutObservable<HyperlinkModel>;

    public viewManager: IViewManager;
    public node: NavigationTreeNode;


    constructor(navigationTreeNode: NavigationTreeNode, navigationService: INavigationService, viewManager: IViewManager) {
        this.node = navigationTreeNode;

        // initialization...
        this.navigationService = navigationService;
        this.viewManager = viewManager;

        // rebinding...
        this.deleteNavigationItem = this.deleteNavigationItem.bind(this);
        this.onHyperlinkChange = this.onHyperlinkChange.bind(this);

        this.hyperlink = navigationTreeNode.hyperlink;

        let label;

        if (this.hyperlink) {
            label = navigationTreeNode.hyperlink().title;
        }
        else {
            label = "Add a link...";
        }
        this.hyperlinkTitle = ko.observable<string>(label);
    }

    public onHyperlinkChange(hyperlink: HyperlinkModel): void {
        if (hyperlink) {
            this.hyperlinkTitle(hyperlink.title);
            this.hyperlink(hyperlink);
            this.node.hyperlink(hyperlink);
        }
        else {
            this.hyperlinkTitle("Add a link...");
        }
    }

    public deleteNavigationItem() {
        this.node.remove();
        this.viewManager.closeWorkshop("navigation-details-workshop");
    }
}