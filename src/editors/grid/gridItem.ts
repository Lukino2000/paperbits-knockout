import { IContextualEditor } from "@paperbits/common/ui/IContextualEditor";

export interface GridItem {
    type: any,
    highlightedColor: string,
    name: string,
    getContextualEditor?: (element, half) => IContextualEditor,
    displayName: string
}