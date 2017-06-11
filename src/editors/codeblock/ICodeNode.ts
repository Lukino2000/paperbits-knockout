import { ContentConfig } from "@paperbits/common/editing/contentNode";

export interface ICodeNode extends ContentConfig {
    language: string;
    code: string;
    theme: string;
    isEditable: boolean;
}