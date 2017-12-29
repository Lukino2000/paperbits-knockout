import * as ko from "knockout";
import template from "./formattingTools.html";
import * as Utils from "@paperbits/common/core/utils";
import { IEventManager } from "@paperbits/common/events/IEventManager";
import { IHtmlEditorProvider } from "@paperbits/common/editing/htmlEditorProvider";
import { Component } from "../../../decorators/component";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IPageService } from "@paperbits/common/pages/IPageService";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IBag } from "@paperbits/common/core/IBag";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { IHtmlEditor } from "../../../../../paperbits-common/src/editing/IHtmlEditor";
import { IAppIntentionsProvider } from "../../../application/interface";
import { Intentions } from "../../../application/codegen/intentionContracts";


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
    public alignedLeft: KnockoutObservable<boolean>;
    public alignedCenter: KnockoutObservable<boolean>;
    public alignedRight: KnockoutObservable<boolean>;
    public justified: KnockoutObservable<boolean>;
    public styleIntentions: KnockoutObservable<Object>;
    public anchored: KnockoutObservable<boolean>;

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

        this.bold = ko.observable<boolean>();
        this.italic = ko.observable<boolean>();
        this.underlined = ko.observable<boolean>();
        this.ul = ko.observable<boolean>();
        this.ol = ko.observable<boolean>();
        this.pre = ko.observable<boolean>();
        this.style = ko.observable<string>("Normal");
        this.styled = ko.observable<boolean>();
        this.alignedLeft = ko.observable<boolean>();
        this.alignedCenter = ko.observable<boolean>();
        this.alignedRight = ko.observable<boolean>();
        this.justified = ko.observable<boolean>();
        this.styleIntentions = ko.observable<IBag<string>>({});
        this.anchored = ko.observable<boolean>();
        this.viewManager = viewManager;

        eventManager.addEventListener("htmlEditorChanged", this.updateFormattingState)
    }

    private updateFormattingState(): void {
        const viewport = this.viewManager.getViewport();
        const selectionState = this.htmlEditorProvider.getCurrentHtmlEditor().getSelectionState();

        this.bold(selectionState.bold);
        this.italic(selectionState.italic);
        this.underlined(selectionState.underlined);
        this.ul(selectionState.ul);
        this.ol(selectionState.ol);
        this.pre(selectionState.code);

        const alignment: string[] = <any>selectionState.intentions.alignment

        if (!alignment){
            this.alignedLeft(true);
            this.alignedCenter(false);
            this.alignedRight(false);
            this.justified(false);
            return;
        }

        //To support legacy format
        if (typeof alignment === 'string'){
            this.alignedLeft(<string><any>alignment == "alignedLeft");
            this.alignedCenter(<string><any>alignment == "alignedCenter");
            this.alignedRight(<string><any>alignment == "alignedRight");
            this.justified(<string><any>alignment == "justified");
            return;
        } 
        
        const aligned = alignment.find(v => v.startsWith("text.alignment"));
        if (!aligned){
            this.alignedLeft(true);
            this.alignedCenter(false);
            this.alignedRight(false);
            this.justified(false);
            return;
        }
        const alignInTheCurrentViewport = alignment.find(v => v.indexOf("." + viewport + ".") > -1);
        if (alignInTheCurrentViewport){
            this.alignedLeft(!!alignment.find(v => v.endsWith(viewport + ".alignedLeft")));
            this.alignedCenter(!!alignment.find(v => v.endsWith(viewport + ".alignedCenter")));
            this.alignedRight(!!alignment.find(v => v.endsWith(viewport + ".alignedRight")));
            this.justified(!!alignment.find(v => v.endsWith(viewport + ".justified")));
        }
        else{
            this.alignedLeft(!!alignment.find(v => v.endsWith("text.alignment.")));
            this.alignedCenter(!!alignment.find(v => v.startsWith("text.alignment.alignedCenter")));
            this.alignedRight(!!alignment.find(v => v.startsWith("text.alignment.alignedRight")));
            this.justified(!!alignment.find(v => v.startsWith("text.alignment.justified")));
        }
        
        this.anchored(!!selectionState.intentions.anchorKey);

        if (!this.alignedLeft() && !this.alignedCenter() && !this.alignedRight() && !this.justified()) {
            this.alignedLeft(true);
        }

        this.styleIntentions(selectionState.intentions);
        this.styled(!!(selectionState.intentions.color));

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

    public toggleBold(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleBold();
        this.updateFormattingState();
    }

    public toggleItalic(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleItalic();
        this.updateFormattingState();
    }

    public setStyle(intention): void {
        console.log(intention);
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleCategory(intention.category, intention.key, intention.scope);
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

    public toggleSize(): void {
        var intention = {
            "name": "Lead",
            "key": "text-lead",
            "css": "lead",
            "category": "lead",
            "scope": "block"
        }

        this.htmlEditorProvider.getCurrentHtmlEditor().toggleCategory(intention.category, intention.key, intention.scope);
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

            htmlEditor.toggleCategory("anchorKey", anchorPermalink.key, "block");

            // TODO: Probably we should show dialog and allow users to enter anchor title.
            const anchorTitle = htmlEditor.getSelectionText();
            const anchors = pageContract.anchors || {};
            anchors[anchorPermalink.key.replaceAll("/", "|")] = anchorTitle;
            pageContract.anchors = anchors;

            await this.pageService.updatePage(pageContract);
        }
        else {
            this.htmlEditorProvider.getCurrentHtmlEditor().toggleCategory("anchorKey", anchorKey, "block");
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
        this.toggleAlignment("alignedLeft");

    }

    public toggleAlignCenter(): void {
        this.toggleAlignment("alignedCenter");
    }

    public toggleAlignRight(): void {
        this.toggleAlignment("alignedRight");
    }

    public toggleJustify(): void {
        this.toggleAlignment("justified");
    }

    public resetToNormal(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().resetToNormal();
        this.updateFormattingState();
    }

    public dispose(): void {
        this.eventManager.removeEventListener("htmlEditorChanged", this.updateFormattingState)
    }

    private toggleAlignment(alignmentIntention: string) {
        const viewport = this.viewManager.getViewport();
        const htmlEditor: IHtmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();
        const selectionState = htmlEditor.getSelectionState();
        let alignmentIndex: number;
        alignmentIntention = viewport ? 
            this.intentions.text.alignment.viewports[viewport][alignmentIntention].fullId :
            this.intentions.text.alignment[alignmentIntention].fullId;
        //if alignment category is empty or it is a string (old data) then update entire categoty
        if (!selectionState.intentions.alignment || 
            (typeof selectionState.intentions.alignment === 'string')){
            htmlEditor.toggleCategory("alignment", alignmentIntention, "block");
        //otherwise it is array; if it has category with current viewport - then replace it
        } else if ((alignmentIndex = selectionState.intentions.alignment.findIndex(a => a.indexOf("alignment.viewports." + viewport) >= 0)) >= 0){
            let newAlignment = JSON.parse(JSON.stringify(selectionState.intentions.alignment));
            newAlignment.splice(alignmentIndex, 1);
            newAlignment.push(alignmentIntention)
            htmlEditor.toggleCategory("alignment", newAlignment, "block");
            // otherwise append alignment with current viewport to the current category
        } else {
            let newAlignment = JSON.parse(JSON.stringify(selectionState.intentions.alignment));
            newAlignment.push(alignmentIntention)
            htmlEditor.toggleCategory("alignment", newAlignment, "block");
        }
        this.updateFormattingState();
    }
}