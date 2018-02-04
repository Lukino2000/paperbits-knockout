import { IIntentionsBuilder, IIntentionsProvider } from '@paperbits/common/appearence/intention';

export class IntentionsProvider implements IIntentionsProvider{
    private static IsViewportContainer: boolean = true;
    private intentions: any;
    
    constructor(private intentionsBuilder: IIntentionsBuilder){
        intentionsBuilder
            .scope("text", textBuilder => {
                return textBuilder.scope("size", sizeBuilder => {
                        return sizeBuilder
                            .addIntention("default", "size", "Default", "block")
                            .addIntention("text_lead", "size", "Lead", "block");
                    })
                    .scope("alignment", alignmentBuilder => {
                        return alignmentBuilder
                            .addIntention("alignedLeft",  "alignment", "Aligned to the left", "block")
                            .addIntention("alignedRight", "alignment", "Aligned to the right", "block")
                            .addIntention("alignedCenter", "alignment", "Centered", "block")
                            .addIntention("justified", "alignment", "Justified", "block");
                    },
                    IntentionsProvider.IsViewportContainer)
                    .scope("style", styleBuilder => {
                        return styleBuilder
                            .addIntention("text_color_primary", "color", "Primary", "inline")
                            .addIntention("text_color_danger", "color", "Danger", "inline")
                            .addIntention("text_color_inverted", "color", "Inverted", "inline")
                    });
            })
            .scope("container", containerBuilder => {
                return containerBuilder
                    .scope("background", backgroundBuilder => {
                        return backgroundBuilder
                            .addIntention("section_bg_default", "background", "Default", "block")
                            .addIntention("section_bg_1", "background", "Smoke", "block")
                            .addIntention("section_bg_2", "background", "Darker smoke", "block")
                            .addIntention("section_bg_3", "background", "Dark smoke", "block")
                            .addIntention("section_bg_4", "background", "Orange", "block");
                    })
            });
    }

    public getIntentions(): any{
        return this.intentions || (this.intentions = this.intentionsBuilder.build());
    }

    public generateContracts(){
        return this.intentionsBuilder.generateContracts();
    }
}

