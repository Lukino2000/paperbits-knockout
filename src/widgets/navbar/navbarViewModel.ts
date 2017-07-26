import * as ko from "knockout";
import * as template from "./navbar.html";
import { NavbarItemViewModel } from "./../navbar/navbarItemViewModel";
import { NavbarModel } from "@paperbits/common/widgets/models/navbarModel";
import { NavbarItemModel } from "@paperbits/common/widgets/models/navbarItemModel";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { Component } from "../../decorators/component";


@Component({
    selector: "navbar",
    template: template,
    injectable: "navbar"
})
export class NavbarViewModel {
    public root: KnockoutObservable<NavbarItemViewModel>;
    public alignRight: KnockoutObservable<boolean>;

    constructor() {
        this.root = ko.observable<NavbarItemViewModel>();
        this.alignRight = ko.observable<boolean>(false);
    }
}