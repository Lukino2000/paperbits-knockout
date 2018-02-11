import template from "./tooltip.html";
import { Component } from "../decorators/component";

@Component({
    selector: "tooltip",
    template: template,
    injectable: "tooltip"
})
export class Tooltip {
    constructor(private readonly text: string) { }
}