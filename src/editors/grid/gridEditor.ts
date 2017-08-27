import * as ko from "knockout";
import { PageModelBinder } from "@paperbits/common/widgets/page/pageModelBinder";
import { PageModel } from "@paperbits/common/widgets/page/pageModel";
import { IContextualEditor } from "@paperbits/common/ui/IContextualEditor";
import { RowModel } from "@paperbits/common/widgets/row/rowModel";
import { ColumnModel } from "@paperbits/common/widgets/column/columnModel";
import { SectionModel } from "@paperbits/common/widgets/section/sectionModel";
import { IWidgetBinding } from "@paperbits/common/editing/IWidgetBinding";
import { SectionModelBinder } from "@paperbits/common/widgets/section/sectionModelBinder";
import { IEditorSession } from "@paperbits/common/ui/IEditorSession";
import { IWidgetEditor } from "@paperbits/common/widgets/IWidgetEditor";
import { IViewManager, ViewManagerMode } from "@paperbits/common/ui/IViewManager";
import { PlaceholderModel } from "@paperbits/common/widgets/placeholder/placeholderModel";
import { LayoutModel } from "@paperbits/common/widgets/layout/layoutModel";
import { LayoutModelBinder } from "@paperbits/common/widgets/layout/layoutModelBinder";
import { IHighlightConfig } from "@paperbits/common/ui/IHighlightConfig";
import { LayoutEditor } from "../layout/layoutEditor";
import { SliderModel, SlideModel } from "@paperbits/common/widgets/slider/sliderModel";
import { GridItem } from "./gridItem";
import { GridHelper } from "./gridHelper";

interface Quadrant {
    vertical: string;
    horizontal: string;
}

export class GridEditor {
    private readonly viewManager: IViewManager
    private readonly ownerDocument: Document;

    private activeHighlightedElement: HTMLElement;
    private scrolling: boolean;
    private scrollTimeout: any;
    private renderTimeout: any;
    private pointerX: number;
    private pointerY: number;
    private selectedWidgetContextualEditor: IContextualEditor;

    private gridItems: GridItem[];
    private actives: Object;

    constructor(viewManager: IViewManager, ownerDocument: Document) {
        this.viewManager = viewManager;
        this.ownerDocument = ownerDocument;

        this.rerenderEditors = this.rerenderEditors.bind(this);
        this.onPointerDown = this.onPointerDown.bind(this);
        this.attach = this.attach.bind(this);
        this.detach = this.detach.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);


        this.actives = {};
        this.gridItems = [{
            type: PlaceholderModel,
            highlightedColor: "#2b87da",
            name: "placeholder",
            getContextualEditor: this.getPlaceholderContextualEditor.bind(this),
            displayName: "Placeholder"
        },
        {
            type: SectionModel,
            highlightedColor: "#2b87da",
            name: "section",
            getContextualEditor: this.getSectionContextualEditor.bind(this),
            displayName: "Section"
        },
        {
            type: SliderModel,
            highlightedColor: "#2b87da",
            name: "slider",
            getContextualEditor: this.getSliderContextualEditor.bind(this),
            displayName: "Slider"
        },
        {
            type: RowModel,
            highlightedColor: "#29c4a9",
            name: "row",
            getContextualEditor: this.getRowContextualEditor.bind(this),
            displayName: "Row"
        },
        {
            type: ColumnModel,
            highlightedColor: "#4c5866",
            name: "column",
            getContextualEditor: this.getColumnContextualEditor.bind(this),
            displayName: "Column"
        }]
    }

    private isModelBeingEdited(widgetModel: IWidgetBinding): boolean {
        let session = this.viewManager.getWidgetEditorSession();

        if (!session) {
            return false;
        }

        if (session.component.name !== widgetModel.editor) {
            return false;
        }

        return true;
    }

    private isModelSelected(widgetModel: IWidgetBinding): boolean {
        let selectedElement = this.viewManager.getSelectedElement();

        if (!selectedElement) {
            return false;
        }

        let selectedWidgetModel = GridHelper.getWidgetBinding(selectedElement.element);

        if (widgetModel != selectedWidgetModel) {
            return false;
        }

        return true;
    }

    public onPointerDown(event: PointerEvent): void {
        if (event.button !== 0) {
            return;
        }

        if (this.viewManager.mode !== ViewManagerMode.edit &&
            this.viewManager.mode !== ViewManagerMode.select &&
            this.viewManager.mode !== ViewManagerMode.configure) {
            return;
        }

        let elements = this.getUnderlyingElements();
        let element = elements.find(element => {
            return GridHelper.getWidgetBinding(element) != null;
        });

        if (!element) {
            return;
        }

        let widgetBinding = GridHelper.getWidgetBinding(element);

        if (!widgetBinding) {
            return;
        }

        if (widgetBinding.readonly) {
            return;
        }

        if (this.isModelBeingEdited(widgetBinding)) {
            return;
        }

        if (this.isModelSelected(widgetBinding)) {
            this.setWidgetEditorSession(widgetBinding);
        }
        else {
            let attachedModel = GridHelper.getModel(element);
            let contextualEditor;

            if (attachedModel instanceof SliderModel || attachedModel instanceof SlideModel) {
                contextualEditor = this.getSliderContextualEditor(element, "top");
            }
            else if (attachedModel instanceof PlaceholderModel) {
                // Do nothing
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
                contextualEditor = this.getWidgetContextualEditor(element, "top");
            }


            if (!contextualEditor) {
                return;
            }

            let config: IHighlightConfig = {
                element: element,
                color: contextualEditor.color,
                text: "Test"
            }

            this.viewManager.setSelectedElement(config, contextualEditor);
            this.selectedWidgetContextualEditor = contextualEditor;
        }
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (this.viewManager.mode == ViewManagerMode.select && event.keyCode === 46 && this.selectedWidgetContextualEditor && this.selectedWidgetContextualEditor.deleteCommand) {
            this.selectedWidgetContextualEditor.deleteCommand.callback();
        }
    }

    private setWidgetEditorSession(widgetBinding: IWidgetBinding) {
        let editorSession: IEditorSession = {
            component: {
                name: widgetBinding.editor,
                params: {},
                oncreate: (editorViewModel: IWidgetEditor) => {
                    editorViewModel.setWidgetModel(widgetBinding.model, widgetBinding.applyChanges);
                }
            },
            hideCloseButton: widgetBinding.hideCloseButton
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
        this.activeHighlightedElement = null;

        if (this.viewManager.mode != ViewManagerMode.configure) {
            this.viewManager.switchToEditing();
        }
    }

    private getPlaceholderContextualEditor(activePlaceholderElement: HTMLElement, activePlaceholderHalf: string): IContextualEditor {
        let placeholderContextualEditor: IContextualEditor = {
            element: activePlaceholderElement,
            color: "#2b87da",
            hoverCommand: {
                position: activePlaceholderHalf,
                tooltip: "Add section",
                color: "#2b87da",
                component: {
                    name: "section-layout-selector",
                    params: {
                        onSelect: (newSectionModel: SectionModel) => {
                            let mainElement = GridHelper.getParentElementWithModel(activePlaceholderElement);
                            let mainModel = GridHelper.getModel(mainElement);
                            let mainWidgetModel = GridHelper.getWidgetBinding(mainElement);
                            let placeholderModel = GridHelper.getModel(activePlaceholderElement);
                            let index = mainModel.sections.indexOf(placeholderModel);

                            if (activePlaceholderHalf === "bottom") {
                                index++;
                            }

                            mainModel.sections.splice(index, 0, newSectionModel);
                            mainWidgetModel.applyChanges();

                            this.viewManager.clearContextualEditors();
                        }
                    }
                }
            },
            selectionCommands: null,
            deleteCommand: null
        }

        return placeholderContextualEditor;
    }

    private getSectionContextualEditor(activeSectionElement: HTMLElement, activeSectionHalf: string, activePlaceholderElement?: HTMLElement, activePlaceholderHalf?: string): IContextualEditor {
        let sectionContextualEditor: IContextualEditor = {
            element: activeSectionElement,
            color: "#2b87da",
            hoverCommand: {
                position: activeSectionHalf,
                tooltip: "Add section",
                color: "#2b87da",
                component: {
                    name: "section-layout-selector",
                    params: {
                        onSelect: (newSectionModel: SectionModel) => {
                            let sectionElement = activeSectionElement;
                            let sectionHalf = activeSectionHalf;

                            if (!sectionElement) {
                                sectionElement = activePlaceholderElement;
                            }

                            if (!sectionHalf) {
                                sectionHalf = activePlaceholderHalf;
                            }

                            let mainElement = GridHelper.getParentElementWithModel(sectionElement);
                            let mainModel = <PageModel>GridHelper.getModel(mainElement);
                            let mainWidgetModel = GridHelper.getWidgetBinding(mainElement);
                            let sectionModel = <SectionModel>GridHelper.getModel(sectionElement);
                            let index = mainModel.sections.indexOf(sectionModel);

                            if (sectionHalf === "bottom") {
                                index++;
                            }

                            mainModel.sections.splice(index, 0, newSectionModel);
                            mainWidgetModel.applyChanges();

                            this.viewManager.clearContextualEditors();
                        }
                    }
                }
            },
            deleteCommand: {
                tooltip: "Delete section",
                color: "#2b87da",
                callback: () => {
                    let mainElement = GridHelper.getParentElementWithModel(activeSectionElement);
                    let mainModel = <PageModel>GridHelper.getModel(mainElement);
                    let mainWidgetModel = GridHelper.getWidgetBinding(mainElement);
                    let sectionModel = GridHelper.getModel(activeSectionElement);

                    mainModel.sections.remove(sectionModel);
                    mainWidgetModel.applyChanges();

                    this.viewManager.clearContextualEditors();
                }
            },
            selectionCommands: [{
                tooltip: "Edit section",
                iconClass: "icon icon-pen",
                position: "top right",
                color: "#2b87da",
                callback: () => {
                    let widgetModel = GridHelper.getWidgetBinding(activeSectionElement);
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
            }]
        }

        let attachedModel = <SectionModel>GridHelper.getModel(activeSectionElement);

        if (attachedModel.rows.length === 0) {
            sectionContextualEditor.hoverCommand = {
                position: "center",
                tooltip: "Add row",
                color: "#29c4a9",
                component: {
                    name: "row-layout-selector",
                    params: {
                        onSelect: (newRowModel: RowModel) => {
                            let sectionModel = GridHelper.getModel(activeSectionElement);
                            let sectionBinding = GridHelper.getWidgetBinding(activeSectionElement);

                            sectionModel.rows.push(newRowModel);
                            sectionBinding.applyChanges();

                            this.cleanActiveElements();
                        }
                    }
                }
            }
        }

        return sectionContextualEditor;
    }

    private getRowContextualEditor(activeRowElement: HTMLElement, activeRowHalf: string): IContextualEditor {
        let rowContextualEditor: IContextualEditor = {
            element: activeRowElement,
            color: "#29c4a9",
            hoverCommand: {
                color: "#29c4a9",
                position: activeRowHalf,
                tooltip: "Add row",
                component: {
                    name: "row-layout-selector",
                    params: {
                        onSelect: (newRowModel: RowModel) => {
                            let parentElement = GridHelper.getParentElementWithModel(activeRowElement);
                            let parentModel = GridHelper.getModel(parentElement);

                            if (parentModel instanceof SliderModel) {
                                let sliderModel = <SliderModel>parentModel;
                                parentModel = sliderModel.slides[sliderModel.activeSlideNumber];
                            }

                            let parentWidgetModel = GridHelper.getWidgetBinding(parentElement);
                            let rowModel = GridHelper.getModel(activeRowElement);
                            let index = parentModel.rows.indexOf(rowModel);

                            if (activeRowHalf === "bottom") {
                                index++;
                            }

                            parentModel.rows.splice(index, 0, newRowModel);
                            parentWidgetModel.applyChanges();

                            this.cleanActiveElements();
                        }
                    }
                },
            },
            selectionCommands: [{
                color: "#29c4a9",
                position: activeRowHalf,
                tooltip: "Add row",
                callback: null,
                component: {
                    name: "row-layout-selector",
                    params: {
                        onSelect: (newRowModel: RowModel) => {
                           
                        }
                    }
                }
            }],
            deleteCommand: {
                tooltip: "Delete row",
                color: "#29c4a9",
                callback: () => {
                    let parentElement = GridHelper.getParentElementWithModel(activeRowElement);
                    let parentModel = GridHelper.getModel(parentElement);

                    if (parentModel instanceof SliderModel) {
                        let sliderModel = <SliderModel>parentModel;
                        parentModel = sliderModel.slides[sliderModel.activeSlideNumber];
                    }

                    let parentBinding = GridHelper.getWidgetBinding(parentElement);
                    let rowModel = GridHelper.getModel(activeRowElement);

                    parentModel.rows.remove(rowModel);
                    parentBinding.applyChanges();

                    this.cleanActiveElements();
                }
            }
        }

        return rowContextualEditor;
    }

    private getColumnContextualEditor(activeColumnElement: HTMLElement): IContextualEditor {
        let columnContextualEditor: IContextualEditor = {
            element: activeColumnElement,
            color: "#4c5866",
            hoverCommand: null,
            deleteCommand: null,
            selectionCommands: [{
                tooltip: "Edit column",
                iconClass: "icon icon-pen",
                position: "top right",
                color: "#4c5866",
                callback: () => {
                    let widgetModel = GridHelper.getWidgetBinding(activeColumnElement);
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
            }]
        }

        let attachedModel = <ColumnModel>GridHelper.getModel(activeColumnElement);

        if (attachedModel.widgets.length === 0) {
            columnContextualEditor.hoverCommand = {
                color: "#607d8b",
                position: "center",
                tooltip: "Add widget",
                component: {
                    name: "widget-selector",
                    params: {
                        onSelect: (widgetModel: any) => {
                            let columnModel = <ColumnModel>GridHelper.getModel(activeColumnElement);
                            let columnWidgetModel = GridHelper.getWidgetBinding(activeColumnElement);

                            columnModel.widgets.push(widgetModel);
                            columnWidgetModel.applyChanges();

                            this.cleanActiveElements();
                        }
                    }
                }
            }
        }

        return columnContextualEditor;
    }

    private getWidgetContextualEditor(activeWidgetElement: HTMLElement, activeWidgetHalf: string): IContextualEditor {
        let widgetContextualEditor: IContextualEditor = {
            element: activeWidgetElement,
            color: "#607d8b",
            hoverCommand: {
                color: "#607d8b",
                position: activeWidgetHalf,
                tooltip: "Add widget",
                component: {
                    name: "widget-selector",
                    params: {
                        onSelect: (newWidgetModel: any) => {
                            let parentElement = GridHelper.getParentElementWithModel(activeWidgetElement);
                            let parentModel = GridHelper.getModel(parentElement);

                            let parentBinding = GridHelper.getWidgetBinding(parentElement);
                            let activeWidgetModel = GridHelper.getModel(activeWidgetElement);
                            let index = parentModel.widgets.indexOf(activeWidgetModel);

                            if (activeWidgetHalf === "bottom") {
                                index++;
                            }

                            parentModel.widgets.splice(index, 0, newWidgetModel);
                            parentBinding.applyChanges();

                            this.cleanActiveElements();
                        }
                    }
                }
            },
            deleteCommand: {
                tooltip: "Delete widget",
                color: "#607d8b",
                callback: () => {
                    let sourceColumnElement = activeWidgetElement.parentElement;
                    let sourceColumnModel = GridHelper.getModel(sourceColumnElement);
                    let sourceColumnWidgetModel = GridHelper.getWidgetBinding(sourceColumnElement);
                    let widgetModel = GridHelper.getModel(activeWidgetElement);

                    if (sourceColumnModel) {
                        sourceColumnModel.widgets.remove(widgetModel);
                        sourceColumnWidgetModel.applyChanges();
                    }

                    this.cleanActiveElements();
                },
            },
            selectionCommands: [{
                tooltip: "Edit widget",
                iconClass: "icon-pen",
                position: "top right",
                color: "#607d8b",
                callback: () => {
                    let widgetModel = GridHelper.getWidgetBinding(activeWidgetElement);
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
            }]
        }

        return widgetContextualEditor;
    }

    private getSliderContextualEditor(widgetElement: HTMLElement, activeSliderHalf: string): IContextualEditor {
        let sliderModel = <SliderModel>GridHelper.getModel(widgetElement);

        let sliderContextualEditor: IContextualEditor = {
            element: widgetElement,
            color: "#607d8b",
            hoverCommand: {
                position: activeSliderHalf,
                tooltip: "Add section",
                color: "#2b87da",
                component: {
                    name: "section-layout-selector",
                    params: {
                        onSelect: (newSectionModel: SectionModel) => {
                            let sectionElement = widgetElement;
                            let sectionHalf = activeSliderHalf;

                            let mainElement = GridHelper.getParentElementWithModel(sectionElement);
                            let mainModel = <PageModel>GridHelper.getModel(mainElement);
                            let mainWidgetModel = GridHelper.getWidgetBinding(mainElement);
                            let sectionModel = <SectionModel>GridHelper.getModel(sectionElement);
                            let index = mainModel.sections.indexOf(sectionModel);

                            if (sectionHalf === "bottom") {
                                index++;
                            }

                            mainModel.sections.splice(index, 0, newSectionModel);
                            mainWidgetModel.applyChanges();

                            this.viewManager.clearContextualEditors();
                        }
                    }
                }
            },
            deleteCommand: {
                tooltip: "Delete slider",
                color: "#607d8b",
                callback: () => {
                    let sourceMainElement = widgetElement.parentElement;
                    let sourceMainModel = GridHelper.getModel(sourceMainElement);
                    let sourceMainWidgetModel = GridHelper.getWidgetBinding(sourceMainElement);
                    let widgetModel = GridHelper.getModel(widgetElement);

                    if (sourceMainModel) {
                        sourceMainModel.sections.remove(widgetModel);
                        sourceMainWidgetModel.applyChanges();
                    }

                    this.cleanActiveElements();
                },
            },
            selectionCommands: [{
                tooltip: "Previous slide",
                iconClass: "icon-tail-left",
                position: "center",
                color: "#607d8b",
                callback: () => {
                    let model = <SliderModel>GridHelper.getModel(widgetElement);
                    model.previousSlide();

                    let widgetModel = GridHelper.getWidgetBinding(widgetElement);
                    widgetModel.applyChanges();
                }
            },
            {
                tooltip: "Next slide",
                iconClass: "icon-tail-right",
                position: "center",
                color: "#607d8b",
                callback: () => {
                    let model = <SliderModel>GridHelper.getModel(widgetElement);
                    model.nextSlide();

                    let widgetModel = GridHelper.getWidgetBinding(widgetElement);
                    widgetModel.applyChanges();
                }
            },
            {
                tooltip: "Edit slider",
                iconClass: "icon icon-pen",
                color: "#607d8b",
                callback: () => {
                    let widgetModel = GridHelper.getWidgetBinding(widgetElement);
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
            }]
        }

        let slideModel = sliderModel.slides[sliderModel.activeSlideNumber];

        if (slideModel.rows.length === 0) {
            sliderContextualEditor.hoverCommand = {
                position: "center",
                tooltip: "Add row",
                color: "#29c4a9",
                component: {
                    name: "row-layout-selector",
                    params: {
                        onSelect: (newRowModel: RowModel) => {
                            let sliderBinding = GridHelper.getWidgetBinding(widgetElement);

                            slideModel.rows.push(newRowModel);
                            sliderBinding.applyChanges();

                            this.cleanActiveElements();
                        }
                    }
                }
            }
        }

        return sliderContextualEditor;
    }

    private getGridItemFor(model: any): GridItem {
        if (!model) {
            return null;
        }

        let gridItem = this.gridItems.find(x => model instanceof x.type);

        if (!gridItem) {
            gridItem = {
                type: null,
                highlightedColor: "#607d8b",
                name: "widget",
                getContextualEditor: this.getWidgetContextualEditor.bind(this),
                displayName: "Widget"
            }
        }

        return gridItem;
    }

    public rerenderEditors(pointerX: number, pointerY: number, elements: HTMLElement[]): void {
        let highlightedElement: HTMLElement = null;
        let highlightedColor: string = null;
        let highlightedText: string = null;
        let tobeDeleted = Object.keys(this.actives);

        for (let i = elements.length - 1; i >= 0; i--) {
            let element = elements[i];
            let attachedModel = GridHelper.getModel(element);
            let widgetBinding = GridHelper.getWidgetBinding(element);

            if (widgetBinding && widgetBinding.readonly) {
                continue;
            }

            let gridItem = this.getGridItemFor(attachedModel);

            if (gridItem) {
                tobeDeleted.remove(gridItem.name);

                highlightedElement = element;
                highlightedColor = gridItem.highlightedColor;
                highlightedText = gridItem.displayName;

                let quadrant = this.pointerToClientQuadrant(pointerX, pointerY, element);
                let half = quadrant.vertical;
                let active = this.actives[gridItem.name];

                if (!active || element != active.element || half != active.half) {
                    if (gridItem.getContextualEditor) {
                        let contextualEditor = gridItem.getContextualEditor(element, half);
                        this.viewManager.setContextualEditor(gridItem.name, contextualEditor);
                    }

                    this.actives[gridItem.name] = {
                        element: element,
                        half: quadrant.vertical
                    }
                }
            }
        }

        tobeDeleted.forEach(x => {
            this.viewManager.removeContextualEditor(x);
            delete this.actives[x];
        });

        if (this.activeHighlightedElement != highlightedElement) {
            this.activeHighlightedElement = highlightedElement;
            this.viewManager.setHighlight({ element: highlightedElement, color: highlightedColor, text: highlightedText });
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

