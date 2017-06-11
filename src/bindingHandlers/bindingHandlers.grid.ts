import * as ko from "knockout";
import { PageModelBinder } from "@paperbits/common/widgets/pageModelBinder";
import { PageModel } from "@paperbits/common/widgets/models/pageModel";
import { IContextualEditor } from "@paperbits/common/ui/IContextualEditor";
import { RowModel } from "@paperbits/common/widgets/models/rowModel";
import { ColumnModel } from "@paperbits/common/widgets/models/columnModel";
import { SectionModel } from "@paperbits/common/widgets/models/sectionModel";
import { IWidgetModel } from "@paperbits/common/editing/IWidgetModel";
import { SectionModelBinder } from "@paperbits/common/widgets/sectionModelBinder";
import { IEditorSession } from "@paperbits/common/ui/IEditorSession";
import { IWidgetEditor } from "@paperbits/common/widgets/IWidgetEditor";
import { IViewManager, ViewManagerMode } from "@paperbits/common/ui/IViewManager";
import { PagePlaceholderModel } from "@paperbits/common/widgets/models/pagePlaceholderModel";
import { LayoutModel } from "@paperbits/common/widgets/models/layoutModel";
import { LayoutModelBinder } from "@paperbits/common/widgets/layoutModelBinder";
import { IModel } from "@paperbits/common/widgets/models/IModel";
import { IHighlightConfig } from "@paperbits/common/ui/IHighlightConfig";
import { LayoutEditor } from "../editors/layout/layoutEditor";

interface Quadrant {
    vertical: string;
    horizontal: string;
}

function getParentElementWithModel<T>(element: HTMLElement): HTMLElement {
    let parent = element.parentElement;

    if (!parent) {
        return null;
    }

    let model = parent["attachedModel"];

    if (model) {
        return parent;
    }

    return getParentElementWithModel(parent);
}

class GridEditor {
    private readonly viewManager: IViewManager
    private readonly ownerDocument: Document;

    private activeSectionElement: HTMLElement;
    private activeSectionHalf: string;
    private activePagePlaceholderElement: HTMLElement;
    private activePagePlaceholderHalf: string;
    private activeRowElement: HTMLElement;
    private activeRowHalf: string;
    private activeColumnElement: HTMLElement;
    private activeHighlightedElement: HTMLElement;
    private scrolling: boolean;
    private scrollTimeout: any;
    private renderTimeout: any;
    private pointerX: number;
    private pointerY: number;
    private selectedWidget: HTMLElement;
    private selectedWidgetContextualEditor: IContextualEditor;

    constructor(viewManager: IViewManager, ownerDocument: Document) {
        this.viewManager = viewManager;
        this.ownerDocument = ownerDocument;

        this.rerenderEditors = this.rerenderEditors.bind(this);
        this.onPointerDown = this.onPointerDown.bind(this);
        this.attach = this.attach.bind(this);
        this.detach = this.detach.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    private isModelBeingEdited(widgetModel: IWidgetModel): boolean {
        let session = this.viewManager.getWidgetEditorSession();

        if (!session) {
            return false;
        }

        if (session.component.name !== widgetModel.editor) {
            return false;
        }

        return true;
    }

    private isModelSelected(widgetModel: IWidgetModel): boolean {
        let selectedElement = this.viewManager.getSelectedElement();

        if (!selectedElement) {
            return false;
        }

        let selectedWidgetModel = selectedElement.element["attachedWidgetModel"];

        if (widgetModel != selectedWidgetModel) {
            return false;
        }

        return true;
    }

    public onPointerDown(event: PointerEvent): void {
        if (this.viewManager.mode !== ViewManagerMode.edit &&
            this.viewManager.mode !== ViewManagerMode.select &&
            this.viewManager.mode !== ViewManagerMode.configure) {
            return;
        }

        let elements = this.getUnderlyingElements();
        let element = elements.find(element => element["attachedWidgetModel"] != undefined);

        if (!element) {
            return;
        }

        this.selectedWidget = null;

        let attachedWidgetModel = <IWidgetModel>element["attachedWidgetModel"];

        if (!attachedWidgetModel) {
            return;
        }



        if (attachedWidgetModel.readonly) {
            return;
        }

        if (this.isModelBeingEdited(attachedWidgetModel)) {
            return;
        }

        if (this.isModelSelected(attachedWidgetModel)) {
            this.setWidgetEditorSession(attachedWidgetModel);
        }
        else {
            let attachedModel = <IWidgetModel>element["attachedModel"];
            let contextualEditor;

            if (attachedModel instanceof PagePlaceholderModel) {
                //contextualEditor = this.getPagePlaceholderContextualEditor();
            }
            else if (attachedModel instanceof SectionModel) {
                contextualEditor = this.getSectionContextualEditor(element, "top", null, null);
            }
            else if (attachedModel instanceof RowModel) {
                contextualEditor = this.getRowContextualEditor(element, "top");
            }
            else if (attachedModel instanceof ColumnModel) {
                contextualEditor = this.getColumnContextualEditor(element);
            }
            else {
                contextualEditor = this.getWidgetContextualEditor(element);
            }

            if (!contextualEditor) {
                return;
            }

            let config: IHighlightConfig = {
                element: element,
                color: contextualEditor.color
            }

            this.viewManager.setSelectedElement(config, contextualEditor);
            this.selectedWidget = element;
            this.selectedWidgetContextualEditor = contextualEditor;


        }
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (event.keyCode === 46 && this.selectedWidgetContextualEditor && this.selectedWidgetContextualEditor.deleteCallback) {
            this.selectedWidgetContextualEditor.deleteCallback();
        }
    }

    private setWidgetEditorSession(attachedWidgetModel: IWidgetModel) {
        let editorSession: IEditorSession = {
            component: {
                name: attachedWidgetModel.editor,
                params: {},
                oncreate: (editorViewModel: IWidgetEditor) => {
                    editorViewModel.setWidgetModel(attachedWidgetModel.model, attachedWidgetModel.applyChanges);
                }
            },
            hideCloseButton: attachedWidgetModel.hideCloseButton
        }

        this.viewManager.setWidgetEditor(editorSession)
    }

    private onWindowScroll(): void {
        if (!this.scrolling) {
            this.cleanActiveElements();
        }

        this.scrolling = true;

        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }

        this.scrollTimeout = setTimeout(this.resetScrolling.bind(this), 400);
    }

    private resetScrolling(): void {
        this.scrolling = false;
        this.renderHighlightedElements();
    }

    private getUnderlyingElements(): HTMLElement[] {
        let elements: HTMLElement[];

        if (this.ownerDocument.elementsFromPoint) {
            elements = Array.prototype.slice.call(this.ownerDocument.elementsFromPoint(this.pointerX, this.pointerY));
        }
        else if (this.ownerDocument.msElementsFromPoint) {
            elements = Array.prototype.slice.call(this.ownerDocument.msElementsFromPoint(this.pointerX, this.pointerY));
        }
        else {
            throw `Method "elementsFromPoint" not supported by browser.`
        }

        return elements;
    }

    private renderHighlightedElements(): void {
        if (this.scrolling || this.viewManager.mode !== ViewManagerMode.edit) {
            return;
        }

        let elements = this.getUnderlyingElements();

        if (elements.length > 0) {
            if (elements.some(x =>
                x.classList.contains("editor") ||
                x.classList.contains("balloon") ||
                x.nodeName === "BUTTON")) {
                return;
            }
        }

        this.rerenderEditors(this.pointerX, this.pointerY, elements);
    }

    private pointerToClientQuadrant(pointerX: number, pointerY: number, element: HTMLElement): Quadrant {
        let rect = element.getBoundingClientRect();
        let clientX = pointerX - rect.left;
        let clientY = pointerY - rect.top;

        let vertical;
        let horizontal;

        if (clientX > rect.width / 2) {
            horizontal = "right";
        }
        else {
            horizontal = "left";
        }

        if (clientY > rect.height / 2) {
            vertical = "bottom";
        }
        else {
            vertical = "top";
        }

        return { vertical: vertical, horizontal: horizontal };
    }

    private onPointerMove(event: PointerEvent): void {
        this.pointerX = event.clientX;
        this.pointerY = event.clientY;

        this.renderHighlightedElements();
    }

    private cleanActiveElements(): void {
        this.viewManager.clearContextualEditors();
        this.activeColumnElement = null;
        this.activeRowElement = null;
        this.activeSectionElement = null;
        this.activeHighlightedElement = null;
        this.activePagePlaceholderElement = null;

        if (this.viewManager.mode != ViewManagerMode.configure) {
            this.viewManager.switchToEditing();
        }
    }

    private getPagePlaceholderContextualEditor(): IContextualEditor {
        let pagePlaceholderContextualEditor: IContextualEditor = {
            element: this.activePagePlaceholderElement,
            position: this.activePagePlaceholderHalf,
            color: "#2b87da",
            addTooltip: "Add section",
            component: {
                name: "section-layout-selector",
                params: {
                    onSelect: (newSectionModel: SectionModel) => {
                        let mainElement = getParentElementWithModel(this.activePagePlaceholderElement);
                        let mainModel = mainElement["attachedModel"];
                        let mainWidgetModel = <IWidgetModel>mainElement["attachedWidgetModel"];
                        let pagePlaceholderModel = <PagePlaceholderModel>this.activePagePlaceholderElement["attachedModel"];
                        let index = mainModel.sections.indexOf(pagePlaceholderModel);

                        if (this.activePagePlaceholderHalf === "bottom") {
                            index++;
                        }

                        mainModel.sections.splice(index, 0, newSectionModel);
                        mainWidgetModel.applyChanges();

                        this.viewManager.clearContextualEditors();
                    }
                }
            }
        }

        return pagePlaceholderContextualEditor;
    }

    private getSectionContextualEditor(activeSectionElement: HTMLElement, activeSectionHalf: string, activePagePlaceholderElement: HTMLElement, activePagePlaceholderHalf: string): IContextualEditor {
        let sectionContextualEditor: IContextualEditor = {
            element: activeSectionElement,
            position: activeSectionHalf,
            color: "#2b87da",
            addTooltip: "Add section",
            component: {
                name: "section-layout-selector",
                params: {
                    onSelect: (newSectionModel: SectionModel) => {
                        let sectionElement = activeSectionElement;
                        let sectionHalf = activeSectionHalf;

                        if (!sectionElement) {
                            sectionElement = activePagePlaceholderElement;
                        }

                        if (!sectionHalf) {
                            sectionHalf = activePagePlaceholderHalf;
                        }

                        let mainElement = getParentElementWithModel(sectionElement);
                        let mainModel = <PageModel>mainElement["attachedModel"];
                        let mainWidgetModel = <IWidgetModel>mainElement["attachedWidgetModel"];
                        let sectionModel = <SectionModel>sectionElement["attachedModel"];
                        let index = mainModel.sections.indexOf(sectionModel);

                        if (sectionHalf === "bottom") {
                            index++;
                        }

                        mainModel.sections.splice(index, 0, newSectionModel);
                        mainWidgetModel.applyChanges();

                        this.viewManager.clearContextualEditors();
                    }
                }
            },
            deleteTooltip: "Delete section",
            deleteCallback: () => {
                let mainElement = getParentElementWithModel(activeSectionElement);
                let mainModel = <PageModel>mainElement["attachedModel"];
                let mainWidgetModel = <IWidgetModel>mainElement["attachedWidgetModel"];
                let sectionModel = <SectionModel>activeSectionElement["attachedModel"];

                mainModel.sections.remove(sectionModel);
                mainWidgetModel.applyChanges();

                this.viewManager.clearContextualEditors();
            },
            settingsTooltip: "Edit section",
            settingsCallback: () => {
                let widgetModel = activeSectionElement["attachedWidgetModel"];
                let editorSession: IEditorSession = {
                    component: {
                        name: widgetModel.editor,
                        params: {},
                        oncreate: (editorViewModel: IWidgetEditor) => {
                            editorViewModel.setWidgetModel(widgetModel.model, widgetModel.applyChanges);
                        }
                    },
                    hideCloseButton: widgetModel.hideCloseButton
                }

                this.viewManager.setWidgetEditor(editorSession);
            }
        }

        return sectionContextualEditor;
    }

    private getEmptySectionContextualEditor(activeSectionElement: HTMLElement, activeSectionHalf: string): IContextualEditor {
        return {
            element: this.activeSectionElement,
            position: "center",
            color: "#29c4a9",
            addTooltip: "Add row",
            component: {
                name: "row-layout-selector",
                params: {
                    onSelect: (newRowModel: RowModel) => {
                        let sectionModel = <SectionModel>this.activeSectionElement["attachedModel"];
                        let sectionWidgetModel = <IWidgetModel>this.activeSectionElement["attachedWidgetModel"];

                        sectionModel.rows.push(newRowModel);
                        sectionWidgetModel.applyChanges();

                        this.cleanActiveElements();
                    }
                }
            }
        }
    }

    private getRowContextualEditor(activeRowElement: HTMLElement, activeRowHalf: string): IContextualEditor {
        let rowContextualEditor: IContextualEditor = {
            element: activeRowElement,
            position: activeRowHalf,
            color: "#29c4a9",
            addTooltip: "Add row",
            component: {
                name: "row-layout-selector",
                params: {
                    onSelect: (newRowModel: RowModel) => {
                        let sectionElement = getParentElementWithModel(activeRowElement);
                        let sectionModel = <SectionModel>sectionElement["attachedModel"];
                        let sectionWidgetModel = <IWidgetModel>sectionElement["attachedWidgetModel"];
                        let rowModel = <RowModel>activeRowElement["attachedModel"];
                        let index = sectionModel.rows.indexOf(rowModel);

                        if (this.activeRowHalf === "bottom") {
                            index++;
                        }

                        sectionModel.rows.splice(index, 0, newRowModel);
                        sectionWidgetModel.applyChanges();

                        this.cleanActiveElements();
                    }
                }
            },
            settingsCallback: null,
            deleteTooltip: "Delete row",
            deleteCallback: () => {
                let sectionElement = getParentElementWithModel(activeRowElement);
                let sectionModel = <SectionModel>sectionElement["attachedModel"];
                let sectionWidgetModel = <IWidgetModel>sectionElement["attachedWidgetModel"];
                let rowModel = <RowModel>activeRowElement["attachedModel"];

                sectionModel.rows.remove(rowModel);
                sectionWidgetModel.applyChanges();

                this.cleanActiveElements();
            }
        }

        return rowContextualEditor;
    }

    private getColumnContextualEditor(activeColumnElement: HTMLElement): IContextualEditor {
        let columnContextualEditor: IContextualEditor = {
            element: activeColumnElement,
            position: "center",
            color: "#4c5866",
            addTooltip: "Add widget",
            component: {
                name: "widget-selector",
                params: {
                    onSelect: (widgetModel: IModel) => {
                        let columnModel = <ColumnModel>activeColumnElement["attachedModel"];
                        let columnWidgetModel = <IWidgetModel>activeColumnElement["attachedWidgetModel"];

                        columnModel.widgets.push(widgetModel);
                        columnWidgetModel.applyChanges();

                        this.cleanActiveElements();
                    }
                }
            },
            deleteTooltip: null,
            deleteCallback: null,
            settingsTooltip: "Edit column",
            settingsCallback: () => {
                let widgetModel = activeColumnElement["attachedWidgetModel"];
                let editorSession: IEditorSession = {
                    component: {
                        name: widgetModel.editor,
                        params: {},
                        oncreate: (editorViewModel: IWidgetEditor) => {
                            editorViewModel.setWidgetModel(widgetModel.model, widgetModel.applyChanges);
                        }
                    },
                    hideCloseButton: widgetModel.hideCloseButton
                }

                this.viewManager.setWidgetEditor(editorSession);
            }
        }

        return columnContextualEditor;
    }

    private getWidgetContextualEditor(widgetElement: HTMLElement): IContextualEditor {
        let widgetContextualEditor: IContextualEditor = {
            element: widgetElement,
            position: "center",
            color: "#607d8b",
            addTooltip: null,
            component: null,
            deleteTooltip: "Delete widget",
            deleteCallback: () => {
                let parentRow = widgetElement.parentElement;
                let columnElement = widgetElement.parentElement;
                let sourceColumnModel = columnElement["attachedModel"];

                let rowElement = columnElement.parentElement;
                let sourceRowModel = rowElement["attachedModel"];
                let sourceRowWidgetModel = <IWidgetModel>rowElement["attachedWidgetModel"];

                let sectionElement = rowElement.parentElement.parentElement;
                let sourceSectionModel = sectionElement["attachedModel"];

                let widgetModel = widgetElement["attachedModel"];

                if (sourceColumnModel) {
                    sourceColumnModel.widgets.remove(widgetModel);
                }

                sourceRowWidgetModel.applyChanges();

                this.cleanActiveElements();
            },
            settingsTooltip: "Edit widget",
            settingsCallback: () => {
                let widgetModel = widgetElement["attachedWidgetModel"];
                let editorSession: IEditorSession = {
                    component: {
                        name: widgetModel.editor,
                        params: {},
                        oncreate: (editorViewModel: IWidgetEditor) => {
                            editorViewModel.setWidgetModel(widgetModel.model, widgetModel.applyChanges);
                        }
                    },
                    hideCloseButton: widgetModel.hideCloseButton
                }

                this.viewManager.setWidgetEditor(editorSession);
            }
        }

        return widgetContextualEditor;
    }

    public rerenderEditors(pointerX: number, pointerY: number, elements: HTMLElement[]): void {
        let highlightedElement: HTMLElement = null;
        let highlightedColor: string = null;
        let pagePlaceholderElement;
        let pagePlaceholderHalf;
        let sectionElement;
        let sectionHalf;
        let rowElement;
        let rowHalf;
        let columnElement;

        for (let i = elements.length - 1; i >= 0; i--) {
            let element = elements[i];
            let attachedModel = element["attachedModel"];
            let attachedWidgetModel = element["attachedWidgetModel"];

            if (attachedWidgetModel && attachedWidgetModel.readonly) {
                continue;
            }

            if (attachedModel) {
                if (attachedModel instanceof PagePlaceholderModel) {
                    highlightedElement = element;
                    highlightedColor = "#2b87da";
                    pagePlaceholderElement = element;
                    let quadrant = this.pointerToClientQuadrant(pointerX, pointerY, element);
                    pagePlaceholderHalf = quadrant.vertical
                }
                else if (attachedModel instanceof SectionModel) {
                    highlightedElement = element;
                    highlightedColor = "#2b87da";
                    sectionElement = element;
                    let quadrant = this.pointerToClientQuadrant(pointerX, pointerY, element);
                    sectionHalf = quadrant.vertical;
                }
                else if (attachedModel instanceof RowModel) {
                    highlightedElement = element;
                    highlightedColor = "#29c4a9"
                    rowElement = element;

                    let quadrant = this.pointerToClientQuadrant(pointerX, pointerY, element);
                    rowHalf = quadrant.vertical;
                }
                else if (attachedModel instanceof ColumnModel) {
                    highlightedElement = element;
                    highlightedColor = "#4c5866";
                    columnElement = element;
                }
                // else {
                //     highlightedElement = element;
                //     highlightedColor = "yellow";
                // }
            }
        }

        if (columnElement != this.activeColumnElement) {
            this.activeColumnElement = columnElement;

            if (this.activeColumnElement) {
                let attachedModel = <ColumnModel>this.activeColumnElement["attachedModel"];

                this.viewManager.setContextualEditor("column", this.getColumnContextualEditor(this.activeColumnElement));
            }
            else {
                this.viewManager.removeContextualEditor("column");
            }
        }

        if (rowElement != this.activeRowElement || rowHalf != this.activeRowHalf) {
            this.activeRowElement = rowElement;
            this.activeRowHalf = rowHalf;
            this.viewManager.setContextualEditor("row", this.getRowContextualEditor(this.activeRowElement, this.activeRowHalf));
        }

        if (sectionElement != this.activeSectionElement || sectionHalf != this.activeSectionHalf) {
            this.activeSectionElement = sectionElement;
            this.activeSectionHalf = sectionHalf;
            this.viewManager.setContextualEditor("section", this.getSectionContextualEditor(this.activeSectionElement, this.activeSectionHalf, this.activePagePlaceholderElement, this.activePagePlaceholderHalf));

            if (this.activeSectionElement) {
                let attachedModel = <SectionModel>this.activeSectionElement["attachedModel"];

                if (attachedModel.rows.length === 0) {
                    this.viewManager.setContextualEditor("row", this.getEmptySectionContextualEditor(this.activeSectionElement, this.activeSectionHalf))
                }
                else {
                    if (!rowElement) {
                        this.viewManager.removeContextualEditor("row");
                    }
                }
            }
            else {
                if (!rowElement) {
                    this.viewManager.removeContextualEditor("row");
                }
            }
        }

        if (pagePlaceholderElement != this.activePagePlaceholderElement || pagePlaceholderHalf != this.activePagePlaceholderHalf) {
            this.activePagePlaceholderElement = pagePlaceholderElement;
            this.activePagePlaceholderHalf = pagePlaceholderHalf;
            this.viewManager.setContextualEditor("page", this.getPagePlaceholderContextualEditor());
        }

        if (this.activeHighlightedElement != highlightedElement) {
            this.activeHighlightedElement = highlightedElement;
            this.viewManager.setHighlight({ element: highlightedElement, color: highlightedColor });
        }
    }

    public attach(): void {
        this.ownerDocument.addEventListener("pointermove", this.onPointerMove.bind(this), true);
        this.ownerDocument.addEventListener("scroll", this.onWindowScroll.bind(this));
        this.ownerDocument.addEventListener("pointerdown", this.onPointerDown, true);
        this.ownerDocument.addEventListener("keydown", this.onKeyDown);
    }

    public detach(): void {
        this.ownerDocument.removeEventListener("pointermove", this.onPointerMove.bind(this), true);
        this.ownerDocument.removeEventListener("scroll", this.onWindowScroll.bind(this));
        this.ownerDocument.removeEventListener("pointerdown", this.onPointerDown, true);
        this.ownerDocument.removeEventListener("keydown", this.onKeyDown);
    }
}

export class GridBindingHandler {
    constructor(layoutEditor: LayoutEditor, viewManager: IViewManager, pageModelBinder: PageModelBinder, layoutModelBinder: LayoutModelBinder) {
        var gridEditor;

        ko.bindingHandlers["layout-grid"] = {
            init(gridElement: HTMLElement, valueAccessor) {
                const options = valueAccessor();

                const gridEditor = new GridEditor(viewManager, gridElement.ownerDocument);

                const observer = new MutationObserver(mutations => {
                    let layoutModel = gridElement["attachedModel"];
                    layoutModelBinder.updateContent(layoutModel);
                });

                observer.observe(gridElement, {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: true
                });

                ko.utils.domNodeDisposal.addDisposeCallback(gridElement, () => {
                    gridEditor.detach();
                    observer.disconnect();
                });

                gridEditor.attach();
            }
        }

        ko.bindingHandlers["content-grid"] = {
            init(gridElement: HTMLElement, valueAccessor) {
                var observer = new MutationObserver(mutations => {
                    let parentElement = getParentElementWithModel(gridElement);

                    if (!parentElement) {
                        return;
                    }

                    let model = parentElement["attachedModel"];
                    pageModelBinder.updateContent(model);
                });

                observer.observe(gridElement, {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: true
                });

                ko.utils.domNodeDisposal.addDisposeCallback(gridElement, () => {
                    observer.disconnect();
                });
            }
        }

        // ko.bindingHandlers["layoutsection"] = {
        //     init(sectionElement: HTMLElement, valueAccessor) {
        //         // TODO: Attach drag & drop events;
        //     }
        // };

        // ko.bindingHandlers["layoutrow"] = {
        //     init(rowElement: HTMLElement, valueAccessor) {
        //         layoutEditor.applyBindingsToRow(rowElement);
        //     }
        // };

        // ko.bindingHandlers["layoutcolumn"] = {
        //     init(columnElement: HTMLElement, valueAccessor) {
        //         layoutEditor.applyBindingsToColumn(columnElement);
        //     }
        // };
    }
}
