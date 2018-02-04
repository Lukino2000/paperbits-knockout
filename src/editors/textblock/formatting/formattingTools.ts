import * as ko from "knockout";
import template from "./formattingTools.html";
import * as Utils from "@paperbits/common/utils";
import { IEventManager } from "@paperbits/common/events/IEventManager";
import { IHtmlEditorProvider } from "@paperbits/common/editing/htmlEditorProvider";
import { Component } from "../../../decorators/component";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IPageService } from "@paperbits/common/pages/IPageService";
import { IntentionsUtils } from "@paperbits/common/appearence/intentionsUtils";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IBag } from "@paperbits/common/IBag";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { IAppIntentionsProvider } from "../../../application/interface";
import { Intentions } from "../../../application/codegen/intentionContracts";
import { IHtmlEditor, SelectionState } from "@paperbits/common/editing/IHtmlEditor";
import { Intention, IntentionWithViewport } from "@paperbits/common/appearence/intention";
import { isAbsolute } from "path";


@Component({
    selector: "formatting",
    template: template,
    injectable: "formattingTools"
})
export class FormattingTools {
    private readonly htmlEditorProvider: IHtmlEditorProvider;
    private readonly eventManager: IEventManager;
    private readonly permalinkService: IPermalinkService;
    private readonly pageService: IPageService;
    private readonly routeHandler: IRouteHandler;
    private readonly viewManager: IViewManager;
    private readonly intentions: Intentions;

    public bold: KnockoutObservable<boolean>;
    public italic: KnockoutObservable<boolean>;
    public underlined: KnockoutObservable<boolean>;
    public ul: KnockoutObservable<boolean>;
    public ol: KnockoutObservable<boolean>;
    public pre: KnockoutObservable<boolean>;
    public style: KnockoutObservable<string>;
    public styled: KnockoutObservable<boolean>;
    public styleIntentions: Intention[];
    public styleIntention: KnockoutObservable<Intention>;
    public alignedLeft: KnockoutObservable<boolean>;
    public alignedCenter: KnockoutObservable<boolean>;
    public alignedRight: KnockoutObservable<boolean>;
    public justified: KnockoutObservable<boolean>;
    public anchored: KnockoutObservable<boolean>;
    public size: KnockoutObservable<string>;
    public sizeIntentions: Intention[];
    public sizeIntention: KnockoutObservable<Intention>;

    constructor(
        htmlEditorProvider: IHtmlEditorProvider,
        eventManager: IEventManager,
        permalinkService: IPermalinkService,
        pageService: IPageService,
        routeHandler: IRouteHandler,
        viewManager: IViewManager,
        intentionsProvider: IAppIntentionsProvider) {

        this.htmlEditorProvider = htmlEditorProvider;
        this.eventManager = eventManager;
        this.permalinkService = permalinkService;
        this.pageService = pageService;
        this.routeHandler = routeHandler;
        this.intentions = intentionsProvider.getIntentions();

        this.updateFormattingState = this.updateFormattingState.bind(this);

        this.setStyle = this.setStyle.bind(this);
        this.styleIntentions = IntentionsUtils.toArray(this.intentions.text.style);
        this.styleIntention = ko.observable<Intention>(this.intentions.text.style.text_color_primary);
        this.style = ko.observable<string>(this.intentions.text.style.text_color_primary.name());
        this.styled = ko.observable<boolean>();
        
        this.setSize = this.setSize.bind(this);
        this.sizeIntentions = IntentionsUtils.toArray(this.intentions.text.size);
        this.sizeIntention = ko.observable<Intention>(this.intentions.text.size.default);
        this.size = ko.observable<string>(this.intentions.text.size.default.name());
        
        this.bold = ko.observable<boolean>();
        this.italic = ko.observable<boolean>();
        this.underlined = ko.observable<boolean>();
        this.ul = ko.observable<boolean>();
        this.ol = ko.observable<boolean>();
        this.pre = ko.observable<boolean>();
        this.alignedLeft = ko.observable<boolean>();
        this.alignedCenter = ko.observable<boolean>();
        this.alignedRight = ko.observable<boolean>();
        this.justified = ko.observable<boolean>();
        this.anchored = ko.observable<boolean>();
        this.viewManager = viewManager;
        

        eventManager.addEventListener("htmlEditorChanged", this.updateFormattingState)
    }

    private updateFormattingState(): void {
        const selectionState = this.htmlEditorProvider.getCurrentHtmlEditor().getSelectionState();

        this.bold(selectionState.bold);
        this.italic(selectionState.italic);
        this.underlined(selectionState.underlined);
        this.ul(selectionState.ul);
        this.ol(selectionState.ol);
        this.pre(selectionState.code);

        this.updateAlignmentState(selectionState)
        
        this.anchored(!!selectionState.intentions["anchorKey"]);

        this.updateIntentionSelector(selectionState, null, this.sizeIntention,
            this.size, this.intentions.text.size.default);

        this.updateIntentionSelector(selectionState, this.styled, this.styleIntention,
            this.style, this.intentions.text.style.text_color_primary);        

        if (selectionState.normal) {
            this.style("Normal");
        }
        else if (selectionState.h1) {
            this.style("Heading 1");
        }
        else if (selectionState.h2) {
            this.style("Heading 2");
        }
        else if (selectionState.h3) {
            this.style("Heading 3");
        }
        else if (selectionState.h4) {
            this.style("Heading 4");
        }
        else if (selectionState.h5) {
            this.style("Heading 5");
        }
        else if (selectionState.h6) {
            this.style("Heading 6");
        }
        else if (selectionState.quote) {
            this.style("Quote");
        }
        else if (selectionState.code) {
            this.style("Code snippet");
        }
    }

    private updateIntentionSelector(
        selectionState: SelectionState,
        isActive: KnockoutObservable<boolean>, 
        intention: KnockoutObservable<Intention>,
        caption: KnockoutObservable<string>, 
        defaultIntention: Intention){
        
        const category: string = defaultIntention.category;

        if (isActive){
            isActive(!!(selectionState.intentions[category] && (selectionState.intentions[category].length > 0)));
        }
        
        const selectedIntentions = selectionState.intentions[category];
        const selectedIntention = 
            selectedIntentions && selectedIntentions.length > 0 &&
                this.intentions.flattenMap[selectedIntentions[0]] || 
                defaultIntention;
        
        intention(selectedIntention);

        caption(selectedIntention.name());
    }
    
    private updateAlignmentState(selectionState: SelectionState):void{

        const viewport = this.viewManager.getViewport();
        const intentions: Intention[] = Utils.leaves(selectionState.intentions);
        
        if (!intentions || intentions.length === 0){
            this.alignedLeft(true);
            this.alignedCenter(false);
            this.alignedRight(false);
            this.justified(false);
            return;
        }

        const hasIntention = (intentions: Intention[], candidate: IntentionWithViewport) => 
            !!intentions.find(i => candidate.fullId == i.fullId || candidate.for(viewport).fullId == i.fullId);
        
        this.alignedLeft(hasIntention(intentions, this.intentions.text.alignment.alignedLeft));
        this.alignedCenter(hasIntention(intentions, this.intentions.text.alignment.alignedCenter));
        this.alignedRight(hasIntention(intentions, this.intentions.text.alignment.alignedRight));
        this.justified(hasIntention(intentions, this.intentions.text.alignment.justified));

        if (!this.alignedLeft() && !this.alignedCenter() && !this.alignedRight() && !this.justified()) {
            this.alignedLeft(true);
        }
    }

    public toggleBold(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleBold();
        this.updateFormattingState();
    }

    public toggleItalic(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleItalic();
        this.updateFormattingState();
    }

    public setStyle(intention: Intention): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleIntention(intention);
        this.updateFormattingState();
    }

    public setSize(intention: Intention): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleIntention(intention);
        this.updateFormattingState();
    }

    public clearStyle(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().resetToNormal();
        this.updateFormattingState();
    }

    public toggleUnderlined(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleUnderlined();
        this.updateFormattingState();
    }

    public toggleLead(): void {
        const leadIntention = this.intentions.text.size.text_lead

        this.htmlEditorProvider.getCurrentHtmlEditor().toggleIntention(this.intentions.text.size.text_lead);
        
        this.updateFormattingState();
    }

    public resetToDefault(): void{
        const defaultSize = this.intentions.text.size.default;
        
        this.htmlEditorProvider.getCurrentHtmlEditor().removeAllIntentions();
        
        this.updateFormattingState();
    }

    public toggleUl(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleUl();
        this.updateFormattingState();
    }

    public toggleOl(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleOl();
        this.updateFormattingState();
    }

    public async toggleAnchor(): Promise<void> {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();
        const selectionState = htmlEditor.getSelectionState();
        const anchorKey = <string><any>selectionState.intentions.anchorKey;
        const currentUrl = this.routeHandler.getCurrentUrl();
        const permalink = await this.permalinkService.getPermalinkByUrl(currentUrl);
        const pageContract = await this.pageService.getPageByKey(permalink.targetKey);

        if (!anchorKey) {
            const anchorId = Utils.guid();
            const anchorPermalink = await this.permalinkService.createPermalink(`${anchorId}`, null, permalink.key);

            htmlEditor.toggleIntention(<Intention>{
                params: () => anchorPermalink.key,
                id: "anchorKey",
                fullId: "anchorKey",
                name: () => "",
                scope: "block"
            });

            // TODO: Probably we should show dialog and allow users to enter anchor title.
            const anchorTitle = htmlEditor.getSelectionText();
            const anchors = pageContract.anchors || {};
            anchors[anchorPermalink.key.replaceAll("/", "|")] = anchorTitle;
            pageContract.anchors = anchors;

            await this.pageService.updatePage(pageContract);
        }
        else {
            this.htmlEditorProvider.getCurrentHtmlEditor().toggleIntention(<Intention>{
                params: () => anchorKey,
                id: "anchorKey",
                fullId: "anchorKey",
                name: () => "",
                scope: "block"
            });
            this.permalinkService.deletePermalinkByKey(anchorKey);

            if (pageContract.anchors) {
                pageContract.anchors[anchorKey.replaceAll("/", "|")] = null;
                await this.pageService.updatePage(pageContract);
            }
        }

        this.updateFormattingState();

        /*
            1. Create permalink and get its key;
            2. Add the key to "anchors" collection of a page;
            3. Invoke toggleCategory:
            
            this.htmlEditorProvider.getCurrentHtmlEditor().toggleCategory("anchorKey", "permalinks/abcdefgh", "block")

            Why we were talking about middlewares?
            - i.e. I deleted whole section along with H1 > show warning;
        */
    }

    public toggleH1(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleH1();
        this.updateFormattingState();
    }

    public toggleH2(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleH2();
        this.updateFormattingState();
    }

    public toggleH3(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleH3();
        this.updateFormattingState();
    }

    public toggleH4(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleH4();
        this.updateFormattingState();
    }

    public toggleH5(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleH5();
        this.updateFormattingState();
    }

    public toggleH6(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleH6();
        this.updateFormattingState();
    }

    public toggleQuote(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleQuote();
        this.updateFormattingState();
    }

    public toggleCode(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleCode();
        this.updateFormattingState();
    }

    public toggleAlignLeft(): void {
        this.toggleAlignment(this.intentions.text.alignment.alignedLeft);

    }

    public toggleAlignCenter(): void {
        this.toggleAlignment(this.intentions.text.alignment.alignedCenter);
    }

    public toggleAlignRight(): void {
        this.toggleAlignment(this.intentions.text.alignment.alignedRight);
    }

    public toggleJustify(): void {
        this.toggleAlignment(this.intentions.text.alignment.justified);
    }

    public resetToNormal(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().resetToNormal();
        this.updateFormattingState();
    }

    public dispose(): void {
        this.eventManager.removeEventListener("htmlEditorChanged", this.updateFormattingState)
    }

    private toggleAlignment(intention: IntentionWithViewport) {
        const viewport = this.viewManager.getViewport();
        const htmlEditor: IHtmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();
        const selectionState = htmlEditor.getSelectionState();
        let alignmentIndex: number;
        const alignmentIntention : Intention = intention.for(viewport);
        
        htmlEditor.toggleIntention(alignmentIntention);

        this.updateFormattingState();
    }

    private toTextEditorIntentions(intention: Intention): any{
        const segments = intention.fullId.split(".");
        let result = intention;
        for(let i = segments.length - 1; i >= 0; i--){
            let segment = segments[i];

        }
    }
}