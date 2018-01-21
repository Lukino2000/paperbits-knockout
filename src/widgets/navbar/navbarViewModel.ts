import * as ko from "knockout";
import template from "./navbar.html";
import { NavbarItemViewModel } from "./../navbar/navbarItemViewModel";
import { NavbarModel } from "@paperbits/common/widgets/navbar/navbarModel";
import { NavbarItemModel } from "@paperbits/common/widgets/navbar/navbarItemModel";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { Component } from "../../decorators/component";


@Component({
    selector: "navbar",
    template: template
})
export class NavbarViewModel {
    public navigationRoot: KnockoutObservable<NavbarItemViewModel>;
    public pictureSourceUrl: KnockoutObservable<string>;

    constructor() {
        this.navigationRoot = ko.observable<NavbarItemViewModel>();
        this.pictureSourceUrl = ko.observable<string>();
    }
}