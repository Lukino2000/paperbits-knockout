import * as ko from "knockout";

export interface ComponentConfig {
    selector: string;
    template: any;
    injectable: string;
    postprocess?: (element: Node, viewModel) => void;
}

export function Component(config: ComponentConfig) {
    return function (target: Function) {
        ko.components.register(config.selector, {
            template: config.template,
            viewModel: { injectable: config.injectable },
            postprocess: config.postprocess
        });
    };
} 