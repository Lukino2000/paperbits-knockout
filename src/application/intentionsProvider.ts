import { IIntentionsBuilder, IIntentionsProvider } from '@paperbits/common/appearence/intention';

export class IntentionsProvider implements IIntentionsProvider{
    private intentions: any;
    
    constructor(private intentionsBuilder: IIntentionsBuilder){
        intentionsBuilder
            .scope("text", textBuilder =>
                textBuilder
                    .scope("size", sizeBuilder =>
                        sizeBuilder
                            .addIntention("default", "Default", "block")
                            .addIntention("text_lead", "Lead", "block")
                    )
                    .scopePerViewport("alignment", alignmentBuilder => 
                         alignmentBuilder
                            .addIntention("left",  "Aligned to the left", "block")
                            .addIntention("right", "Aligned to the right", "block")
                            .addIntention("center", "Centered", "block")
                            .addIntention("justified", "Justified", "block"))
                    .scope("style", styleBuilder =>
                        styleBuilder
                            .addIntention("text_color_primary", "Primary", "inline")
                            .addIntention("text_color_danger", "Danger", "inline")
                            .addIntention("text_color_inverted", "Inverted", "inline")
                    )
            )
            .scope("container", containerBuilder =>
                containerBuilder
                    .scope("background", backgroundBuilder => 
                        backgroundBuilder
                            .addIntention("section_bg_default", "Default", "block")
                            .addIntention("section_bg_1", "Smoke", "block")
                            .addIntention("section_bg_2", "Darker smoke", "block")
                            .addIntention("section_bg_3", "Dark smoke", "block")
                            .addIntention("section_bg_4", "Orange", "block")
                    )
            );
    }

    public getIntentions(): any{
        return this.intentions || (this.intentions = this.intentionsBuilder.build());
    }

    public generateContracts(){
        return this.intentionsBuilder.generateContracts();
    }
}

