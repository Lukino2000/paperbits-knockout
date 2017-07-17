import * as ko from "knockout";
import * as template from "./formattingTools.html";
import { IEventManager } from '@paperbits/common/events/IEventManager';
import { IHtmlEditorProvider } from '@paperbits/common/editing/htmlEditorProvider';
import { Intention } from "@paperbits/common/ui/color";
import { Component } from "../../../decorators/component";


@Component({
    selector: "formatting",
    template: template,
    injectable: "formattingTools"
})
export class FormattingTools {
    private readonly htmlEditorProvider: IHtmlEditorProvider;
    private readonly eventManager: IEventManager;

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
    public styleIntentionKey: KnockoutObservable<string>;

    constructor(htmlEditorProvider: IHtmlEditorProvider, eventManager: IEventManager) {
        this.htmlEditorProvider = htmlEditorProvider;
        this.eventManager = eventManager;

        this.updateFormattingState = this.updateFormattingState.bind(this);

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
        this.styleIntentionKey = ko.observable<string>();

        eventManager.addEventListener("htmlEditorChanged", this.updateFormattingState)
    }

    private updateFormattingState() {
        var selectionState = this.htmlEditorProvider.getCurrentHtmlEditor().getSelectionState();
        this.bold(selectionState.bold);
        this.italic(selectionState.italic);
        this.underlined(selectionState.underlined);
        this.ul(selectionState.ul);
        this.ol(selectionState.ol);
        this.pre(selectionState.code);

        this.alignedLeft(selectionState.intentions.block.some(_ => _ == "alignedLeft"));
        this.alignedCenter(selectionState.intentions.block.some(_ => _ == "alignedCenter"));
        this.alignedRight(selectionState.intentions.block.some(_ => _ == "alignedRight"));
        this.justified(selectionState.intentions.block.some(_ => _ == "justified"));
        this.styled(selectionState.intentions.block.some(_ => _.indexOf("color") == 0));
        this.setStyle = this.setStyle.bind(this);

        if (!this.alignedLeft() && !this.alignedCenter() && !this.alignedRight() && !this.justified()) {
            this.alignedLeft(true);
        }

        var styleIntentionKey = selectionState.intentions.block.find(_ => _.indexOf("color") == 0);
        styleIntentionKey = styleIntentionKey && styleIntentionKey.length > 5 && styleIntentionKey.substring(5);

        if (styleIntentionKey) {
            this.styleIntentionKey(styleIntentionKey);
        }
        else {
            this.styleIntentionKey(null);
        }

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

    public setStyle(intentionKey: string): void {
        switch (intentionKey) {
            case "text-color-primary":
            case "text-color-danger":
            case "text-color-inverted":
                this.htmlEditorProvider.getCurrentHtmlEditor().toggleColor(intentionKey);
                break;

            case "text-lead":
                this.htmlEditorProvider.getCurrentHtmlEditor().toggleCategory("lead", intentionKey, "block");
                break;

            case null:
                // this.htmlEditorProvider.getCurrentHtmlEditor().clearColor();
                break;

            default:
                throw `Unapplicable text style intention ${intentionKey}`;
        }

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

    public toggleUl(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleUl();
        this.updateFormattingState();
    }

    public toggleOl(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleOl();
        this.updateFormattingState();
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
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleH4();
        this.updateFormattingState();
    }

    public toggleH6(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleH4();
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
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleAlignment("alignedLeft");
        this.updateFormattingState();
    }

    public toggleAlignCenter(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleAlignment("alignedCenter");
        this.updateFormattingState();
    }

    public toggleAlignRight(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleAlignment("alignedRight");
        this.updateFormattingState();
    }

    public toggleJustify(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleAlignment("justified");
        this.updateFormattingState();
    }

    public resetToNormal(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().resetToNormal();
        this.updateFormattingState();
    }

    public dispose(): void {
        this.eventManager.addEventListener("htmlEditorChanged", this.updateFormattingState)
    }
}
