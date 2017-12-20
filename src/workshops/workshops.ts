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

    public userPhotoUrl: KnockoutObservable<string>;
    public resizing: KnockoutComputed<string>;

    constructor(viewManager: IViewManager, userService: IUserService) {
        this.viewManager = viewManager;
        this.userService = userService;

        this.closeWorkshop = this.closeWorkshop.bind(this);

        this.userPhotoUrl = ko.observable<string>(null);
        this.resizing = ko.pureComputed(() => this.viewManager.journeyName() ? "all" : "all suspended");

        this.loadUserProfile();
    }

    private async loadUserProfile(): Promise<void> {
        const url = await this.userService.getUserPhotoUrl();
        this.userPhotoUrl(url);
    }

    private openWorkshop(label: string, componentName: string): void {
        this.viewManager.clearJourney();
        this.viewManager.openWorkshop(label, componentName);
    }

    public openLayouts(): void {
        this.openWorkshop("Layouts", "layouts");
    }

    public openPages(): void {
        this.openWorkshop("Pages", "pages");
    }

    public openBlogs(): void {
        this.openWorkshop("Blog", "blogs");
    }

    public openMedia(): void {
        this.openWorkshop("Media", "media");
    }

    public openNavigation(): void {
        this.openWorkshop("Navigation", "navigation");
    }

    public openSettings(): void {
        this.openWorkshop("Site settings", "settings");
    }

    public openProfile(): void {
        // TODO:
    }

    public closeWorkshop(editorSession: IEditorSession): void {
        this.viewManager.closeWorkshop(editorSession);
    }
}