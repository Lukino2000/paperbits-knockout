import { ProgressPromise } from '@paperbits/common/core/progressPromise';

export interface ICodeConfig {
    theme: string;
    lang?: string;
    code?: string;
    filename?: string;
    onload?: ProgressPromise<string>;
}