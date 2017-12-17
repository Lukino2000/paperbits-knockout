import * as ko from "knockout";
import template from "./workshops.html";
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { Component } from "../decorators/component";
import { IUserService } from "@paperbits/common/user/IUserService";
import { IEditorSession } from "../../../paperbits-common/src/ui/IEditorSession";


@Component({
    selector: "workshops",
    template: template,
    injectable: "workshops"
})
export class Workshops {
    private readonly viewManager: IViewManager;
    private readonly userService: IUserService;

    public journey: KnockoutObservable<string>;
    public userPhotoUrl: KnockoutObservable<string>;


    constructor(viewManager: IViewManager, userService: IUserService) {
        this.viewManager = viewManager;
        this.userService = userService;

        this.closeWorkshop = this.closeWorkshop.bind(this);

        this.journey = ko.observable<string>();
        this.userPhotoUrl = ko.observable<string>(null);

        this.init();
    }

    private async init(): Promise<void> {
        const url = await this.userService.getUserPhotoUrl();
        this.userPhotoUrl(url);
    }

    public openLayouts(): void {
        this.viewManager.clearJourney();
        this.viewManager.openWorkshop("Layouts", "layouts")
    }

    public openPages(): void {
        this.viewManager.clearJourney();
        this.viewManager.openWorkshop("Pages", "pages");
    }

    public openBlogs(): void {
        this.viewManager.clearJourney();
        this.viewManager.openWorkshop("Blog", "blogs");
    }

    public openMedia(): void {
        this.viewManager.clearJourney();
        this.viewManager.openWorkshop("Media", "media");
    }

    public openNavigation(): void {
        this.viewManager.clearJourney();
        this.viewManager.openWorkshop("Navigation", "navigation");
    }

    public openSettings(): void {
        this.viewManager.clearJourney();
        this.viewManager.openWorkshop("Site settings", "settings");
    }

    public openProfile(): void {
       
    }

    public closeWorkshop(editorSession: IEditorSession): void {
        this.viewManager.closeWorkshop(editorSession);
    }
}