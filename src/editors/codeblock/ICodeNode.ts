import { Contract } from "@paperbits/common/editing/contentNode";

export interface ICodeNode extends Contract {
    language: string;
    code: string;
    theme: string;
    isEditable: boolean;
}