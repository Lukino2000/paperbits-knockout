import * as ko from "knockout";
import template from "./workshops.html";
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { Component } from "../decorators/component";
import { IUserService } from "@paperbits/common/user/IUserService";


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

        this.closeJourney = this.closeJourney.bind(this);

        this.journey = ko.observable<string>();
        this.userPhotoUrl = ko.observable<string>(null);

        this.init();
    }

    private async init(): Promise<void> {
        const url = await this.userService.getUserPhotoUrl();
        this.userPhotoUrl(url);
    }

    public openLayouts(): void {
        this.viewManager.newJourney("Layouts", "layouts");
        this.journey("layouts");
    }

    public openPages(): void {
        this.viewManager.newJourney("Pages", "pages");
        this.journey("pages");
    }

    public openBlogs(): void {
        this.viewManager.newJourney("Blog", "blogs");
        this.journey("blogs");
    }

    public openMedia(): void {
        this.viewManager.newJourney("Media", "media");
        this.journey("media");
    }

    public openNavigation(): void {
        this.viewManager.newJourney("Navigation", "navigation");
        this.journey("navigation");
    }

    public openSettings(): void {
        this.viewManager.newJourney("Site settings", "settings");
        this.journey("settings");
    }

    public openProfile(): void {
       
    }

    public closeJourney(): void {
        this.viewManager.clearJourney();
    }
}