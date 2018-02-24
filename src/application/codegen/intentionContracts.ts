/********************************************************************
THIS IS AUTO-GENERATED CODE.
DO NOT MODIFY THIS FILE MANUALLY, OTHERWISE ALL CHANGES WILL BE LOST.
********************************************************************/

import { Intention, IntentionsMap, IntentionWithViewport } from '@paperbits/common/appearance/intention'

export interface Intentions extends IntentionsMap{
	text: Intentions_text;
	container: Intentions_container;
}

export interface Intentions_text extends IntentionsMap{
	size_: Intentions_text_size_;
	alignment: Intentions_text_alignment;
	style: Intentions_text_style;
	font: Intentions_text_font;
}

export interface Intentions_text_size_ extends IntentionsMap{
	default: Intention;
	text_lead: Intention;
}

export interface Intentions_text_alignment extends IntentionsMap{
	xs: Intentions_text_alignment_xs;
	sm: Intentions_text_alignment_sm;
	md: Intentions_text_alignment_md;
	lg: Intentions_text_alignment_lg;
	xl: Intentions_text_alignment_xl;
	left: IntentionWithViewport;
	right: IntentionWithViewport;
	center: IntentionWithViewport;
	justified: IntentionWithViewport;
}

export interface Intentions_text_alignment_xs extends IntentionsMap{
	left: Intention;
	right: Intention;
	center: Intention;
	justified: Intention;
}

export interface Intentions_text_alignment_sm extends IntentionsMap{
	left: Intention;
	right: Intention;
	center: Intention;
	justified: Intention;
}

export interface Intentions_text_alignment_md extends IntentionsMap{
	left: Intention;
	right: Intention;
	center: Intention;
	justified: Intention;
}

export interface Intentions_text_alignment_lg extends IntentionsMap{
	left: Intention;
	right: Intention;
	center: Intention;
	justified: Intention;
}

export interface Intentions_text_alignment_xl extends IntentionsMap{
	left: Intention;
	right: Intention;
	center: Intention;
	justified: Intention;
}

export interface Intentions_text_style extends IntentionsMap{
	text_color_primary: Intention;
	text_color_danger: Intention;
	text_color_inverted: Intention;
}

export interface Intentions_text_font extends IntentionsMap{
	text_font_sansserif: Intention;
	text_font_cursive: Intention;
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
