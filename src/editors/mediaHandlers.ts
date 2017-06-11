import * as ko from "knockout";
import { IMediaItem } from '@paperbits/common/media/IMediaItem';
import { IContentDropHandler } from '@paperbits/common/editing/IContentDropHandler';
import { IDataTransfer } from '@paperbits/common/editing/IDataTransfer';
import { IContentDescriptor } from '@paperbits/common/editing/IContentDescriptor';
import { IWidgetFactoryResult } from '@paperbits/common/editing/IWidgetFactoryResult';

export abstract class MediaHandlers implements IContentDropHandler {
    private mediaTypePrefixes: string[];
    private fileExtensions: string[];

    constructor(mediaTypePrefixes: string[], fileExtensions: string[]) {
        this.mediaTypePrefixes = mediaTypePrefixes;
        this.fileExtensions = fileExtensions;
    }

    protected matches(dataTransfer: IDataTransfer): boolean {
        if (dataTransfer.mimeType && !this.mediaTypePrefixes.some(m => dataTransfer.mimeType.startsWith(m))) {
            return false;
        }

        if (dataTransfer.name && !this.fileExtensions.some(e => dataTransfer.name.endsWith(e))) {
            return false;
        }

        return true;
    }

    public getContentDescriptorFromDataTransfer(item: IMediaItem): IContentDescriptor {
        return null;
    }

    // protected toWidgetFactoryResult<TViewModel>(element: HTMLElement, onFileUploaded?: (viewModel: TViewModel, source: File | string, uploadedUrl: string) => void): IWidgetFactoryResult {
    //     var result: IWidgetFactoryResult = {
    //         element: element,
    //         onMediaUploadedCallback: (source: File | string, uploadedFileUrl: string) => {
    //             var viewModel = <TViewModel>ko.dataFor(element.children[0]);
    //             onFileUploaded(viewModel, source, uploadedFileUrl);
    //         }
    //     };

    //     return result;
    // }
}