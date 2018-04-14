import * as ko from "knockout";
import template from "./form.html";
import { ButtonModel } from "@paperbits/common/widgets/button/buttonModel";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { Component } from "../../decorators/component";


@Component({
    selector: "paperbits-form",
    template: template
})
export class FormViewModel { }