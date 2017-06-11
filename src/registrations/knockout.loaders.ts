import * as ko from "knockout";
import * as $ from "jquery";
import { IRegistration } from '@paperbits/common/injection/IRegistration';
import { IInjector } from '@paperbits/common/injection/IInjector';
import { XmlHttpRequestClient } from "@paperbits/common/http/xmlHttpRequestClient";


export class KnockoutRegistrationLoaders implements IRegistration {
    public register(injector: IInjector): void {
        var injectableComponentLoader = {
            loadViewModel(name, config, callback) {
                if (config.injectable) {
                    var viewModelConstructor = (params) => {
                        var resolvedInjectable: any = injector.resolve(config.injectable);

                        if (resolvedInjectable.factory) {
                            return resolvedInjectable.factory(injector, params);
                        }

                        return resolvedInjectable;
                    };

                    ko.components.defaultLoader.loadViewModel(name, viewModelConstructor, callback);
                }
                else {
                    // Unrecognized config format. Let another loader handle it.
                    callback(null);
                }
            },

            loadTemplate(name: string, templateConfig: any, callback: (result: Node[]) => void) {
                let templatesBasePath = "/scripts/templates";

                if (templateConfig.fromUrl) {
                    var fullUrl = `${templatesBasePath}/${templateConfig.fromUrl}`;

                    $.get(fullUrl, markupString => {
                        // We need an array of DOM nodes, not a string.
                        // We can use the default loader to convert to the
                        // required format.
                        ko.components.defaultLoader.loadTemplate(name, markupString, callback);
                    });
                } else {
                    // Unrecognized config format. Let another loader handle it.
                    callback(null);
                }
            },

            loadComponent(componentName: string, config: any, callback: (definition: KnockoutComponentTypes.Definition) => void) {
                var callbackWrapper: (result: KnockoutComponentTypes.Definition) => void = (resultWrapper: KnockoutComponentTypes.Definition) => {

                    var createViewModelWrapper: (params: any, options: { element: Node; }) => any = (params: any, options: { element: Node; }) => {
                        if (config.preprocess) {
                            config.preprocess(options.element, params);
                        }

                        var viewModel = resultWrapper.createViewModel(params, options);

                        if (config.postprocess) {
                            config.postprocess(options.element, viewModel);
                        }

                        return viewModel;
                    }

                    var definitionWrapper: KnockoutComponentTypes.Definition = {
                        template: resultWrapper.template,
                        createViewModel: createViewModelWrapper
                    };

                    (<any>definitionWrapper).shadow = config.template && config.template.shadow;

                    callback(definitionWrapper);
                }

                ko.components.defaultLoader.loadComponent(componentName, config, callbackWrapper);
            },
        };

        ko.components.loaders.unshift(injectableComponentLoader);
    }
}