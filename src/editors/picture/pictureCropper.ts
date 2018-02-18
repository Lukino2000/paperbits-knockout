import * as ko from "knockout";
import * as Utils from '@paperbits/common/utils';
import template from "./pictureCropper.html";
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { Component } from "../../decorators/component";


@Component({
    selector: "picture-cropper",
    template: template,
    injectable: "pictureCropper"
})
export class PictureCropper {
    constructor(private viewManager: IViewManager) {
    
    }

    public closeEditor(): void {
        this.viewManager.closeWidgetEditor();
    }
}
