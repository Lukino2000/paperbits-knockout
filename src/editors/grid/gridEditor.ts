import * as ko from "knockout";
import * as _ from 'lodash';
import * as Utils from "@paperbits/common/utils";
import { PageModelBinder } from "@paperbits/common/widgets/page/pageModelBinder";
import { PageModel } from "@paperbits/common/widgets/page/pageModel";
import { IContextualEditor } from "@paperbits/common/ui/IContextualEditor";
import { RowModel } from "@paperbits/common/widgets/row/rowModel";
import { ColumnModel } from "@paperbits/common/widgets/column/columnModel";
import { SectionModel } from "@paperbits/common/widgets/section/sectionModel";
import { IWidgetBinding } from "@paperbits/common/editing/IWidgetBinding";
import { SectionModelBinder } from "@paperbits/common/widgets/section/sectionModelBinder";
import { IView } from "@paperbits/common/ui/IView";
import { IWidgetEditor } from "@paperbits/common/widgets/IWidgetEditor";
import { IViewManager, ViewManagerMode } from "@paperbits/common/ui/IViewManager";
import { PlaceholderModel } from "@paperbits/common/widgets/placeholder/placeholderModel";
import { LayoutModel } from "@paperbits/common/widgets/layout/layoutModel";
import { LayoutModelBinder } from "@paperbits/common/widgets/layout/layoutModelBinder";
import { IHighlightConfig } from "@paperbits/common/ui/IHighlightConfig";
import { SliderModel, SlideModel } from "@paperbits/common/widgets/slider/sliderModel";
import { Keys } from "@paperbits/common/keyboard";
import { GridItem } from "./gridItem";
import { GridHelper } from "./gridHelper";
import { ViewManager } from "../../ui/viewManager";
import { IEventManager } from "@paperbits/common/events/IEventManager";

interface Quadrant {
    vertical: string;
    horizontal: string;
}

export class GridEditor {
    private activeHighlightedElement: HTMLElement;
    private scrolling: boolean;
    private scrollTimeout: any;
    private renderTimeout: any;
    private pointerX: number;
    private pointerY: number;
    private selectedWidgetContextualEditor: IContextualEditor;

    private gridItems: GridItem[];
    private actives: Object;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly ownerDocument: Document,
        private readonly eventManager: IEventManager
    ) {
        this.viewManager = viewManager;
        this.ownerDocument = ownerDocument;
        this.eventManager = eventManager;

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
            getContextualEditor: this.getPlaceholderContextualEditor.bind(this)
        },
        {
            type: SectionModel,
            highlightedColor: "#2b87da",
            name: "section",
            getContextualEditor: this.getSectionContextualEditor.bind(this)
        },
        {
            type: SliderModel,
            highlightedColor: "#2b87da",
            name: "slider",
            getContextualEditor: this.getSliderContextualEditor.bind(this)
        },
        {
            type: RowModel,
            highlightedColor: "#29c4a9",
            name: "row",
            getContextualEditor: this.getRowContextualEditor.bind(this)
        },
        {
            type: ColumnModel,
            highlightedColor: "#4c5866",
            name: "column",
            getContextualEditor: this.getColumnContextualEditor.bind(this)
        }]
    }

    private isModelBeingEdited(binding: IWidgetBinding): boolean {
        const session = this.viewManager.getWidgetview();

        if (!session) {
            return false;
        }

        if (session.component.name !== binding.editor) {
            return false;
        }

        return true;
    }

    private isModelSelected(binding: IWidgetBinding): boolean {
        const selectedElement = this.viewManager.getSelectedElement();

        if (!selectedElement) {
            return false;
        }

        const selectedBinding = GridHelper.getWidgetBinding(selectedElement.element);

        if (binding != selectedBinding) {
            return false;
        }

        return true;
    }

    private onPointerDown(event: PointerEvent): void {
        if (this.viewManager.mode === ViewManagerMode.zoomout) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        if (event.button !== 0) {
            return;
        }

        if (this.viewManager.mode !== ViewManagerMode.selecting &&
            this.viewManager.mode !== ViewManagerMode.selected &&
            this.viewManager.mode !== ViewManagerMode.configure) {
            return;
        }

        const elements = this.getUnderlyingElements();
        const element = elements.find(element => {
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
            this.openWidgetEditor(widgetBinding);
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

            const config: IHighlightConfig = {
                element: element,
                color: contextualEditor.color,
                text: widgetBinding["displayName"]
            }

            this.viewManager.setSelectedElement(config, contextualEditor);
            this.selectedWidgetContextualEditor = contextualEditor;
        }
    }

    private onPointerMove(event: PointerEvent): void {
        if (this.viewManager.mode === ViewManagerMode.zoomout) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        this.pointerX = event.clientX;
        this.pointerY = event.clientY;

        const elements = this.getUnderlyingElements();

        if (elements.length === 0) {
            return;
        }

        switch (this.viewManager.mode) {
            case ViewManagerMode.selecting:
            case ViewManagerMode.selected:
                this.renderHighlightedElements();
                break;

            case ViewManagerMode.dragging:
                this.renderDropHandlers();

                break;
        }
    }

    private renderDropHandlers(): void {
        const dragSession = this.viewManager.getDragSession();

        if (!dragSession) {
            return;
        }

        const elements = this.getUnderlyingElements();

        if (elements.some(element => element.classList.contains("placeholder"))) {
            delete dragSession.targetElement;
            delete dragSession.targetBinding;

            this.viewManager.setSplitter(null);
            return;
        }

        const acceptorElement = elements
            .filter(element => dragSession.sourceElement != element)
            .map(element => {
                const binding = GridHelper.getWidgetBinding(element);

                if (binding && binding.onDragOver && binding.onDragOver(dragSession)) {
                    return element;
                }
                else {
                    return null;
                }
            })
            .first(x => x != null);

        if (acceptorElement) {
            const childNodes = Array.prototype.slice
                .call(acceptorElement.childNodes)
                .filter(node => GridHelper.getModel(node) != null && node != dragSession.sourceElement);

            const intersection = _.intersection(childNodes, elements);

            dragSession.targetElement = acceptorElement;
            dragSession.targetBinding = GridHelper.getWidgetBinding(acceptorElement);

            let hoveredElement = acceptorElement;

            const sourceElementFlow = dragSession.sourceBinding.flow || "block";


            if (intersection.length > 0) {
                hoveredElement = intersection[0];

                dragSession.insertIndex = childNodes.indexOf(hoveredElement);

                const quadrant = this.pointerToClientQuadrant(this.pointerX, this.pointerY, hoveredElement);

                const hoveredElementFlow = GridHelper.getWidgetBinding(hoveredElement).flow || "block";

                if (sourceElementFlow == "block" && hoveredElementFlow == "block") {
                    if (quadrant.horizontal === "right") {
                        dragSession.insertIndex++;
                    }

                    this.viewManager.setSplitter({
                        element: hoveredElement,
                        side: quadrant.horizontal,
                        where: "outside"
                    });
                }
                else {
                    if (quadrant.vertical == "bottom") {
                        dragSession.insertIndex++;
                    }

                    this.viewManager.setSplitter({
                        element: hoveredElement,
                        side: quadrant.vertical,
                        where: "outside"
                    });
                }
            }
            else {
                if (hoveredElement.childNodes.length == 0) {
                    dragSession.insertIndex = 0;
                }
                else {
                    dragSession.insertIndex = hoveredElement.childNodes.length;
                }

                const hoveredElementFlow = GridHelper.getWidgetBinding(hoveredElement).flow || "block";

                if (sourceElementFlow == "block" && hoveredElementFlow == "block") {
                    this.viewManager.setSplitter({
                        element: hoveredElement,
                        side: "left",
                        where: "inside"
                    });
                }
                else {
                    this.viewManager.setSplitter({
                        element: hoveredElement,
                        side: "top",
                        where: "inside"
                    });
                }

            }
        }
        else {
            delete dragSession.targetElement;
            delete dragSession.targetBinding;

            this.viewManager.setSplitter(null);
        }
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (this.viewManager.mode == ViewManagerMode.selected && event.keyCode === Keys.Delete && this.selectedWidgetContextualEditor && this.selectedWidgetContextualEditor.deleteCommand) {
            this.selectedWidgetContextualEditor.deleteCommand.callback();
        }
    }

    private openWidgetEditor(binding: IWidgetBinding): void {
        const view: IView = {
            component: {
                name: binding.editor,
                params: {},
                oncreate: (editorViewModel: IWidgetEditor) => {
                    editorViewModel.setWidgetModel(binding.model, binding.applyChanges);
                }
            },
            resize: binding.editorResize || "vertically horizontally"
        }

        this.viewManager.openViewAsPopup(view)
    }

    private onWindowScroll(): void {
        if (this.viewManager.mode === ViewManagerMode.dragging || this.viewManager.mode === ViewManagerMode.zoomout) {
            return;
        }

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
        return Utils.elementsFromPoint(this.ownerDocument, this.pointerX, this.pointerY);
    }

    private renderHighlightedElements(): void {
        if (this.scrolling || (this.viewManager.mode !== ViewManagerMode.selecting && this.viewManager.mode !== ViewManagerMode.selected)) {
            return;
        }

        const elements = this.getUnderlyingElements();

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
                    const mainElement = GridHelper.getParentElementWithModel(activeSectionElement);
                    const mainModel = <PageModel>GridHelper.getModel(mainElement);
                    const mainWidgetModel = GridHelper.getWidgetBinding(mainElement);
                    const sectionModel = GridHelper.getModel(activeSectionElement);

                    mainModel.sections.remove(sectionModel);
                    mainWidgetModel.applyChanges();

                    this.viewManager.clearContextualEditors();
                }
            },
            selectionCommands: [{
                tooltip: "Edit section",
                iconClass: "paperbits-edit-72",
                position: "top right",
                color: "#2b87da",
                callback: () => {
                    const binding = GridHelper.getWidgetBinding(activeSectionElement);
                    this.openWidgetEditor(binding);
                }
            },
            {
                tooltip: "Add to library",
                iconClass: "paperbits-simple-add",
                position: "top right",
                color: "#2b87da",
                callback: () => {
                    const view: IView = {
                        component: {
                            name: "add-block-dialog",
                            params: GridHelper.getModel(activeSectionElement)
                        },
                        resize: "vertically horizontally"
                    }

                    this.viewManager.openViewAsPopup(view);
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
            selectionCommands: null,
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
            deleteCommand: {
                tooltip: "Delete column",
                color: "#4c5866",
                callback: () => {
                    const rowElement = GridHelper.getParentElementWithModel(activeColumnElement);
                    const rowModel = GridHelper.getModel(rowElement);
                    const rowBinding = GridHelper.getWidgetBinding(rowElement);
                    const columnModel = GridHelper.getModel(activeColumnElement);

                    rowModel.columns.remove(columnModel);
                    rowBinding.applyChanges();

                    this.cleanActiveElements();
                }
            },
            selectionCommands: [{
                tooltip: "Edit column",
                iconClass: "paperbits-edit-72",
                position: "top right",
                color: "#4c5866",
                callback: () => {
                    const binding = GridHelper.getWidgetBinding(activeColumnElement);
                    this.openWidgetEditor(binding);
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
                            const columnModel = <ColumnModel>GridHelper.getModel(activeColumnElement);
                            const columnWidgetBinding = GridHelper.getWidgetBinding(activeColumnElement);

                            columnModel.widgets.push(widgetModel);
                            columnWidgetBinding.applyChanges();

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
                iconClass: "paperbits-edit-72",
                position: "top right",
                color: "#607d8b",
                callback: () => {
                    const binding = GridHelper.getWidgetBinding(activeWidgetElement);
                    this.openWidgetEditor(binding);
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
                iconClass: "paperbits-edit-72",
                color: "#607d8b",
                callback: () => {
                    const binding = GridHelper.getWidgetBinding(widgetElement);
                    this.openWidgetEditor(binding);
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

    private getGridItemFor(model: Object, element: HTMLElement): GridItem {
        if (!model) {
            return null;
        }

        let gridItem = this.gridItems.find(x => model instanceof x.type);

        if (!gridItem) {
            const parent = GridHelper.getParentElementWithModel(element);

            if (parent) {
                const parentModel = GridHelper.getModel(parent);

                if (parentModel instanceof ColumnModel) {
                    gridItem = {
                        type: null,
                        highlightedColor: "#607d8b",
                        name: "widget",
                        getContextualEditor: this.getWidgetContextualEditor.bind(this)
                    }
                }
            }
        }

        return gridItem;
    }

    private rerenderEditors(pointerX: number, pointerY: number, elements: HTMLElement[]): void {
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

            let gridItem = this.getGridItemFor(attachedModel, element);

            if (gridItem) {
                tobeDeleted.remove(gridItem.name);

                highlightedElement = element;
                highlightedColor = gridItem.highlightedColor;
                highlightedText = widgetBinding["displayName"];

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
        // Firefox doesn't fire "pointermove" events by some reason
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


    public static attachWidgetDragEvents(sourceElement: HTMLElement, viewManager: IViewManager, eventManager: IEventManager): void {
        const onDragStart = (item): HTMLElement => {
            if (viewManager.mode === ViewManagerMode.configure) {
                return;
            }

            const placeholderWidth = sourceElement.clientWidth - 1 + "px";;
            const placeholderHeight = sourceElement.clientHeight - 1 + "px";

            const sourceBinding = GridHelper.getWidgetBinding(sourceElement);
            const sourceModel = GridHelper.getModel(sourceElement);
            const sourceParentElement = GridHelper.getParentElementWithModel(sourceElement);
            const parentModel = GridHelper.getModel(sourceParentElement);
            const parentBinding = GridHelper.getWidgetBinding(sourceParentElement);

            const placeholderElement = sourceElement.ownerDocument.createElement("div");
            placeholderElement.style.height = placeholderHeight;
            placeholderElement.style.width = placeholderWidth;
            placeholderElement.classList.add("placeholder");

            sourceElement.parentNode.insertBefore(placeholderElement, sourceElement.nextSibling);

            viewManager.beginDrag({
                type: "widget",
                sourceElement: sourceElement,
                sourceModel: sourceModel,
                sourceBinding: sourceBinding,
                parentModel: parentModel,
                parentBinding: parentBinding,
            });

            return sourceElement;
        }

        const onDragEnd = () => {
            const dragSession = viewManager.getDragSession();
            const parentBinding = dragSession.parentBinding;
            const acceptorElement = dragSession.targetElement;
            const acceptorBinding = dragSession.targetBinding;

            if (acceptorElement) {
                const parentModel = <ColumnModel>dragSession.parentModel;
                const model = dragSession.sourceModel;

                parentModel.widgets.remove(model);
            }

            parentBinding.applyChanges();

            if (acceptorBinding) {
                acceptorBinding.onDragDrop(dragSession);
            }

            eventManager.dispatchEvent("virtualDragEnd");
        }

        const preventDragging = (): boolean => {
            return viewManager.mode === ViewManagerMode.configure;
        }

        ko.applyBindingsToNode(sourceElement, {
            dragsource: { sticky: true, ondragstart: onDragStart, ondragend: onDragEnd, preventDragging: preventDragging }
        });
    }

    public static attachColumnDragEvents(sourceElement: HTMLElement, viewManager: IViewManager, eventManager: IEventManager): void {
        var onDragStart = (item): HTMLElement => {
            const placeholderWidth = sourceElement.clientWidth - 1 + "px";;
            const placeholderHeight = sourceElement.clientHeight - 1 + "px";

            const sourceBinding = GridHelper.getWidgetBinding(sourceElement);
            const sourceModel = GridHelper.getModel(sourceElement);
            const sourceParentElement = GridHelper.getParentElementWithModel(sourceElement);
            const parentModel = GridHelper.getModel(sourceParentElement);
            const parentBinding = GridHelper.getWidgetBinding(sourceParentElement);

            const placeholderElement = sourceElement.ownerDocument.createElement("div");
            placeholderElement.style.height = placeholderHeight;
            placeholderElement.style.width = placeholderWidth;
            placeholderElement.classList.add("placeholder");

            sourceElement.parentNode.insertBefore(placeholderElement, sourceElement.nextSibling);

            viewManager.beginDrag({
                type: "column",
                sourceElement: sourceElement,
                sourceModel: sourceModel,
                sourceBinding: sourceBinding,
                parentModel: parentModel,
                parentBinding: parentBinding
            });

            return sourceElement;
        }

        var onDragEnd = () => {
            const dragSession = viewManager.getDragSession();
            const parentBinding = dragSession.parentBinding;
            const acceptorElement = dragSession.targetElement;
            const acceptorBinding = dragSession.targetBinding;

            if (acceptorElement) {
                const parentModel = <RowModel>dragSession.parentModel;
                const model = <ColumnModel>dragSession.sourceModel;

                parentModel.columns.remove(model);
            }

            parentBinding.applyChanges();

            if (acceptorBinding) {
                acceptorBinding.onDragDrop(dragSession);
            }

            eventManager.dispatchEvent("virtualDragEnd");
        }

        var preventDragging = (): boolean => {
            return viewManager.mode === ViewManagerMode.configure;
        }

        ko.applyBindingsToNode(sourceElement, {
            dragsource: { sticky: true, ondragstart: onDragStart, ondragend: onDragEnd, preventDragging: preventDragging }
        });
    }

    public static attachSectionDragEvents(sourceElement: HTMLElement, viewManager: IViewManager, eventManager: IEventManager): void {
        var onDragStart = (item): HTMLElement => {
            const placeholderWidth = sourceElement.clientWidth - 1 + "px";;
            const placeholderHeight = sourceElement.clientHeight - 1 + "px";

            const sourceBinding = GridHelper.getWidgetBinding(sourceElement);
            const sourceModel = GridHelper.getModel(sourceElement);
            const sourceParentElement = GridHelper.getParentElementWithModel(sourceElement);
            const parentModel = GridHelper.getModel(sourceParentElement);
            const parentBinding = GridHelper.getWidgetBinding(sourceParentElement);
            const placeholderElement = sourceElement.ownerDocument.createElement("div");

            placeholderElement.style.height = placeholderHeight;
            placeholderElement.style.width = placeholderWidth;
            placeholderElement.classList.add("placeholder");

            sourceElement.parentNode.insertBefore(placeholderElement, sourceElement.nextSibling);

            viewManager.beginDrag({
                type: "section",
                sourceElement: sourceElement,
                sourceModel: sourceModel,
                sourceBinding: sourceBinding,
                parentModel: parentModel,
                parentBinding: parentBinding
            });

            return sourceElement;
        }

        const onDragEnd = () => {
            const dragSession = viewManager.getDragSession();
            const parentBinding = dragSession.parentBinding;
            const acceptorElement = dragSession.targetElement;
            const acceptorBinding = dragSession.targetBinding;

            if (acceptorElement) {
                const pageModel = <PageModel>dragSession.parentModel;
                const model = <SectionModel>dragSession.sourceModel;

                pageModel.sections.remove(model);
            }

            parentBinding.applyChanges();

            if (acceptorBinding) {
                acceptorBinding.onDragDrop(dragSession);
            }

            eventManager.dispatchEvent("virtualDragEnd");
        }

        const preventDragging = (): boolean => {
            return viewManager.mode === ViewManagerMode.configure;
        }

        ko.applyBindingsToNode(sourceElement, {
            dragsource: { sticky: true, ondragstart: onDragStart, ondragend: onDragEnd, preventDragging: preventDragging }
        });
    }
}

