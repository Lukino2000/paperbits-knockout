import * as ko from "knockout";
import * as Utils from '@paperbits/common/utils';
import template from "./pictureCropper.html";
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { Component } from "../../decorators/component";
import * as Cropper from "cropperjs";

ko.bindingHandlers["cropper"] = {
    init: (imageElement: HTMLElement, valueAccessor) => {
        const observable = valueAccessor();

        const cropperInstance = new Cropper(imageElement, {
            aspectRatio: 1,
            viewMode: 1,
            resize: true,
            ready: () => {
                this.croppable = true;
            }
        });
    }
}

@Component({
    selector: "picture-cropper",
    template: template,
    injectable: "pictureCropper"
})
export class PictureCropper {
    constructor(private viewManager: IViewManager) {

    }

    public getRoundedCanvas(sourceCanvas): HTMLCanvasElement {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const width = sourceCanvas.width;
        const height = sourceCanvas.height;

        canvas.width = width;
        canvas.height = height;

        context.imageSmoothingEnabled = true;
        context.drawImage(sourceCanvas, 0, 0, width, height);
        context.globalCompositeOperation = 'destination-in';
        context.beginPath();
        context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
        context.fill();

        return canvas;
    }

    public crop(): void {
        const croppable = false;

        if (!croppable) {
            return;
        }

        // Crop
        // const croppedCanvas = cropperInstance.getCroppedCanvas();

        // // Round
        // const roundedCanvas = this.getRoundedCanvas(croppedCanvas);

        // // Show
        // const roundedImage = document.createElement("img");
        // roundedImage.src = roundedCanvas.toDataURL()
        // result.innerHTML = '';
        // result.appendChild(roundedImage);
    }

    public closeEditor(): void {
        this.viewManager.closeWidgetEditor();
    }
}
