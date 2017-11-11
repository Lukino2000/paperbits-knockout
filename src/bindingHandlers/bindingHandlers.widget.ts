﻿import * as ko from "knockout";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { IEventManager } from "@paperbits/common/events/IEventManager";
import { GridEditor } from "../editors/grid/gridEditor";


export class WidgetBindingHandler {
    public constructor(viewManager: IViewManager, eventManager: IEventManager) {
        let componentLoadingOperationUniqueId = 0;

        ko.bindingHandlers["widget"] = {
            init(element, valueAccessor, ignored1, ignored2, bindingContext) {
                let currentViewModel,
                    currentLoadingOperationId,
                    disposeAssociatedComponentViewModel = () => {
                        let currentViewModelDispose = currentViewModel && currentViewModel["dispose"];
                        if (typeof currentViewModelDispose === "function") {
                            currentViewModelDispose.call(currentViewModel);
                        }
                        currentViewModel = null;
                        // Any in-flight loading operation is no longer relevant, so make sure we ignore its completion
                        currentLoadingOperationId = null;
                    },
                    originalChildNodes = makeArray(ko.virtualElements.childNodes(element));

                ko.utils.domNodeDisposal.addDisposeCallback(element, disposeAssociatedComponentViewModel);

                ko.computed(() => {
                    let componentOnCreateHandler;
                    let componentViewModel = ko.utils.unwrapObservable(valueAccessor());
                    let loadingOperationId = currentLoadingOperationId = ++componentLoadingOperationUniqueId;
                    let registration = ko.components["registry"].find(x => componentViewModel instanceof x.constructor);

                    if (!registration) {
                        throw `Could not find component registration for view model: ${componentViewModel}`;
                    }

                    let componentName = registration.name;

                    ko.components.get(componentName, componentDefinition => {
                        // If this is not the current load operation for this element, ignore it.
                        if (currentLoadingOperationId !== loadingOperationId) {
                            return;
                        }

                        // Clean up previous state
                        disposeAssociatedComponentViewModel();

                        // Instantiate and bind new component. Implicitly this cleans any old DOM nodes.
                        if (!componentDefinition) {
                            throw new Error('Unknown component \'' + componentName + '\'');
                        }
                        let root = cloneTemplateIntoElement(componentName, componentDefinition, element, !!(<any>componentDefinition).shadow);

                        let childBindingContext = bindingContext['createChildContext'](componentViewModel, /* dataItemAlias */ undefined, ctx => {
                            ctx["$component"] = componentViewModel;
                            ctx["$componentTemplateNodes"] = originalChildNodes;
                        });

                        currentViewModel = componentViewModel;
                        ko.applyBindingsToDescendants(childBindingContext, root);

                        if (componentOnCreateHandler) {
                            componentOnCreateHandler(componentViewModel, element);
                        }

                        let correctedElement = element;

                        if (correctedElement.nodeName == "#comment") {
                            do {
                                correctedElement = correctedElement.nextSibling;
                            }
                            while (correctedElement != null && correctedElement.nodeName == "#comment")
                        }

                        if (correctedElement) {
                            correctedElement["attachedViewModel"] = componentViewModel;

                            if (correctedElement.nodeName == "A") {
                                correctedElement.onclick = (event) => {
                                    event.preventDefault();
                                    event.stopImmediatePropagation();
                                }
                            }

                            GridEditor.attachWidgetDragEvents(correctedElement, viewManager, eventManager);
                        }
                    });
                }, null, { disposeWhenNodeIsRemoved: element });

                return { 'controlsDescendantBindings': true };
            }
        };

        ko.virtualElements.allowedBindings['widget'] = true;

        const makeArray = (arrayLikeObject) => {
            let result = [];
            for (let i = 0, j = arrayLikeObject.length; i < j; i++) {
                result.push(arrayLikeObject[i]);
            };
            return result;
        };

        const cloneNodes = (nodesArray, shouldCleanNodes) => {
            for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i++) {
                var clonedNode = nodesArray[i].cloneNode(true);
                newNodesArray.push(shouldCleanNodes ? ko.cleanNode(clonedNode) : clonedNode);
            }
            return newNodesArray;
        };

        function cloneTemplateIntoElement(componentName, componentDefinition, element, useShadow: boolean): HTMLElement {
            const template = componentDefinition['template'];

            if (!template) {
                return element;
            }

            const clonedNodesArray = cloneNodes(template, false);
            ko.virtualElements.setDomNodeChildren(element, clonedNodesArray);
            return element;
        }

        function createViewModel(componentDefinition, element, originalChildNodes, componentParams) {
            const componentViewModelFactory = componentDefinition['createViewModel'];
            return componentViewModelFactory
                ? componentViewModelFactory.call(componentDefinition, componentParams, { 'element': element, 'templateNodes': originalChildNodes })
                : componentParams; // Template-only component
        }
    }
}