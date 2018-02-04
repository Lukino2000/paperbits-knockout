/********************************************************************
THIS IS AUTO-GENERATED CODE.
DO NOT MODIFY THIS FILE DIRECTLY OTHERWISE ALL CHANGES WILL BE LOST.
********************************************************************/

import { Intention, IntentionsMap, IntentionWithViewport } from '@paperbits/common/appearence/intention'

export interface Intentions extends IntentionsMap{
	text: Intentions_text;
	container: Intentions_container;
}

export interface Intentions_text extends IntentionsMap{
	size: Intentions_text_size;
	alignment: Intentions_text_alignment;
	style: Intentions_text_style;
}

export interface Intentions_text_size extends IntentionsMap{
	default: Intention;
	text_lead: Intention;
}

export interface Intentions_text_alignment extends IntentionsMap{
	alignedLeft: IntentionWithViewport;
	alignedRight: IntentionWithViewport;
	alignedCenter: IntentionWithViewport;
	justified: IntentionWithViewport;
}

export interface Intentions_text_style extends IntentionsMap{
	text_color_primary: Intention;
	text_color_danger: Intention;
	text_color_inverted: Intention;
}

export interface Intentions_container extends IntentionsMap{
	background: Intentions_container_background;
}

export interface Intentions_container_background extends IntentionsMap{
	section_bg_default: Intention;
	section_bg_1: Intention;
	section_bg_2: Intention;
	section_bg_3: Intention;
	section_bg_4: Intention;
}
