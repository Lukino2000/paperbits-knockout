import {IntentionsBuilder} from '@paperbits/common/appearence/intentionsBuilder';
import {Intention} from '@paperbits/common/appearence/intention';
import {theme} from './theme'

export var intentions = new IntentionsBuilder(theme)
.scope("text", textBuilder => {
    textBuilder.scope("size", sizeBuilder => {
        sizeBuilder.addIntentionPerViewPort(
                viewPort => "alignedLeft-" + viewPort, 
                viewPort => new Intention("alignment", () => "Aligned to the left", "block"))
            .addIntentionPerViewPort(
                viewPort => "alignedRight-" + viewPort, 
                viewPort => new Intention("alignment", () => "Aligned to the right", "block"))
            .addIntentionPerViewPort(
                viewPort => "alignedCenter-" + viewPort, 
                viewPort => new Intention("alignment", () => "Centered", "block"))
            .addIntentionPerViewPort(
                viewPort => "justified-" + viewPort, 
                viewPort => new Intention("alignment", () => "Justified", "block"));
        })
        .scope("alignment", alignmentBuilder =>{
            alignmentBuilder.addIntention("text-lead", new Intention("lead", () => "Lead", "block"));
        })
        .scope("style", styleBuilder => {
            styleBuilder.addIntention("text-color-primary", new Intention("color", () => "Primary", "inline"))
                .addIntention("text-color-danger", new Intention("color", () => "Danger", "inline"))
                .addIntention("text-color-inverted", new Intention("color", () => "Inverted", "inline"))
                .addIntention("text-lead", new Intention("lead", () => "Lead", "block"));
        });
})
.scope("container", containerBuilder => {
    containerBuilder.scope("background", backgroundBuilder => {
        backgroundBuilder.addIntention("section-bg-default", new Intention("background", () => "Default", "block"))
            .addIntention("section-bg-1", new Intention("background", () => "Smoke", "block"))
            .addIntention("section-bg-2", new Intention("background", () => "Darker smoke", "block"))
            .addIntention("section-bg-3", new Intention("background", () => "Dark smoke", "block"))
            .addIntention("section-bg-4", new Intention("background", () => "Orange", "block"));
        })
})
.build();