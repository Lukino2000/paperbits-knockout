import * as ko from "knockout";
import template from "./navigationDetails.html";
import { IView } from "@paperbits/common/ui/IView";
import { PermalinkService } from "@paperbits/common/permalinks/permalinkService";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { INavigationService } from "@paperbits/common/navigation/INavigationService";
import { NavigationItemViewModel } from "../../workshops/navigation/navigationItemViewModel";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";
import { Component } from "../../decorators/component";


@Component({
    selector: "navigation-details-workshop",
    template: template,
    injectable: "navigationDetailsWorkshop"
})
export class NavigationDetailsWorkshop {
    private readonly onDeleteCallback: () => void;

    public readonly hyperlinkTitle: KnockoutComputed<string>;
    public readonly hyperlink: KnockoutObservable<HyperlinkModel>;
    public readonly navigationItem: NavigationItemViewModel;

    constructor(
        private readonly navigationService: INavigationService,
        private readonly viewManager: IViewManager,
        params
    ) {

        // initialization...
        this.navigationItem = params.navigationItem;
        this.onDeleteCallback = params.onDeleteCallback;

        // rebinding...
        this.deleteNavigationItem = this.deleteNavigationItem.bind(this);
        this.onHyperlinkChange = this.onHyperlinkChange.bind(this);

        this.hyperlink = this.navigationItem.hyperlink;

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
        this.navigationItem.hyperlink(hyperlink);
    }

    public deleteNavigationItem(): void {
        this.navigationItem.remove();

        this.viewManager.notifySuccess("Navigation", `Navigation item "${this.navigationItem.label()}" was deleted.`);
        this.viewManager.closeWorkshop("navigation-details-workshop");

        if (this.onDeleteCallback) {
            this.onDeleteCallback()
        }
    }
}