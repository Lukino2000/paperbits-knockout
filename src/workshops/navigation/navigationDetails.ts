import * as ko from "knockout";
import template from "./navigationDetails.html";
import { IEditorSession } from "@paperbits/common/ui/IEditorSession";
import { PermalinkService } from "@paperbits/common/permalinks/permalinkService";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { INavigationService } from "@paperbits/common/navigation/INavigationService";
import { NavigationTreeNode } from "../../workshops/navigation/navigationTreeNode";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";
import { Component } from "../../decorators/component";


@Component({
    selector: "navigation-details-workshop",
    template: template,
    injectable: "navigationDetailsWorkshop"
})
export class NavigationDetailsWorkshop {
    private navigationService: INavigationService;

    public readonly hyperlinkTitle: KnockoutComputed<string>;
    public readonly hyperlink: KnockoutObservable<HyperlinkModel>;
    public readonly viewManager: IViewManager;
    public readonly node: NavigationTreeNode;

    constructor(navigationTreeNode: NavigationTreeNode, navigationService: INavigationService, viewManager: IViewManager) {
        this.node = navigationTreeNode;

        // initialization...
        this.navigationService = navigationService;
        this.viewManager = viewManager;

        // rebinding...
        this.deleteNavigationItem = this.deleteNavigationItem.bind(this);
        this.onHyperlinkChange = this.onHyperlinkChange.bind(this);

        this.hyperlink = navigationTreeNode.hyperlink;

        this.hyperlinkTitle = ko.pureComputed<string>(() => {
            const hyperlink = this.hyperlink();

            if (hyperlink) {
                //return `${hyperlink.type}: ${hyperlink.title}`;

                return `${hyperlink.title}`;
            }

            return "Click to select a link...";
        });
    }

    public onHyperlinkChange(hyperlink: HyperlinkModel): void {
        this.hyperlink(hyperlink);
        this.node.hyperlink(hyperlink);
    }

    public deleteNavigationItem() {
        this.node.remove();
        this.viewManager.closeWorkshop("navigation-details-workshop");
    }
}