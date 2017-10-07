import * as ko from "knockout";
import template from "./workshops.html";
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { Component } from "../decorators/component";


@Component({
    selector: "workshops",
    template: template,
    injectable: "workshops"
})
export class Workshops {
    private readonly viewManager: IViewManager;

    public journey: KnockoutObservable<string>;
    public dragging: KnockoutObservable<boolean>;

    constructor(viewManager: IViewManager) {
        this.viewManager = viewManager;

        this.closeJourney = this.closeJourney.bind(this);

        this.journey = ko.observable<string>();
        this.dragging = ko.observable<boolean>(false);
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

    public openWidgets(): void {
        this.viewManager.newJourney("Widgets", "widgets");
        this.journey("widgets");
    }

    public closeJourney(): void {
        this.viewManager.clearJourney();
    }
}