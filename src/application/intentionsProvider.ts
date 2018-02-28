import { IIntentionsBuilder, IIntentionsProvider } from '@paperbits/common/appearance/intention';

export class IntentionsProvider implements IIntentionsProvider {
    private intentions: any;

    constructor(private intentionsBuilder: IIntentionsBuilder) {
        intentionsBuilder
            .scope("text", textBuilder =>
                textBuilder
                    .group("size", sizeBuilder =>
                        sizeBuilder
                            .addIntention("default", "Default", "block")
                            .addIntention("text_lead", "Lead", "block")
                    )
                    .groupPerViewport("alignment", alignmentBuilder =>
                        alignmentBuilder
                            .addIntention("left", "Aligned to the left", "block")
                            .addIntention("right", "Aligned to the right", "block")
                            .addIntention("center", "Centered", "block")
                            .addIntention("justified", "Justified", "block"))
                    .group("style", styleBuilder =>
                        styleBuilder
                            .addIntention("text_color_primary", "Primary", "inline")
                            .addIntention("text_color_danger", "Danger", "inline")
                            .addIntention("text_color_inverted", "Inverted", "inline")
                    )
                    .group("font", styleBuilder => // serif, sans-serif, monospace, cursive
                        styleBuilder
                            .addIntention("text_font_sansserif", "Georgia", "block")
                            .addIntention("text_font_cursive", "Kristen ITC", "block")
                    )
            )
            .scope("container", containerBuilder =>
                containerBuilder
                    .group("background", backgroundBuilder =>
                        backgroundBuilder
                            .addIntention("section_bg_default", "Default", "block")
                            .addIntention("section_bg_1", "Smoke", "block")
                            .addIntention("section_bg_2", "Darker smoke", "block")
                            .addIntention("section_bg_3", "Dark smoke", "block")
                            .addIntention("section_bg_4", "Orange", "block")
                    )
                    .group("list", listBuilder =>
                        listBuilder
                            .addIntention("nested-numbering", "Nested numbers", "block")
                            .scope("ordered", olBuilder =>
                                olBuilder
                                    .addIntention("numbers", "Numbers", "block")
                                    .addIntention("upper-alpha", "Uppercase", "block")
                                    .addIntention("lower-alpha", "Lowercase", "block")
                                    .addIntention("lower-roman", "Roman lowercase", "block")
                                    .addIntention("upper-roman", "Roman uppercase", "block"))
                            .scope("unordered", olBuilder =>
                                olBuilder
                                    .addIntention("disc", "Disc", "block")
                                    .addIntention("circle", "Circle", "block")
                                    .addIntention("square", "Square", "block")
                                    .addIntention("none", "None", "block")))
            );
    }

    public getIntentions(): any {
        return this.intentions || (this.intentions = this.intentionsBuilder.build());
    }

    public generateContracts() {
        return this.intentionsBuilder.generateContracts();
    }
}

