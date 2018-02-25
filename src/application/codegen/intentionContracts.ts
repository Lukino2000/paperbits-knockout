/********************************************************************
THIS IS AUTO-GENERATED CODE.
DO NOT MODIFY THIS FILE MANUALLY, OTHERWISE ALL CHANGES WILL BE LOST.
********************************************************************/

import { Intention, IntentionsMap, IntentionWithViewport } from '@paperbits/common/appearance/intention'

export interface Intentions extends IntentionsMap{
	name: string;
	text: Intentions_text;
	container: Intentions_container;
}

export interface Intentions_text extends IntentionsMap{
	name: string;
	size_: Intentions_text_size_;
	alignment: Intentions_text_alignment;
	style: Intentions_text_style;
	font: Intentions_text_font;
}

export interface Intentions_text_size_ extends IntentionsMap{
	name: string;
	default: Intention;
	text_lead: Intention;
}

export interface Intentions_text_alignment extends IntentionsMap{
	name: string;
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
	name: string;
	left: Intention;
	right: Intention;
	center: Intention;
	justified: Intention;
}

export interface Intentions_text_alignment_sm extends IntentionsMap{
	name: string;
	left: Intention;
	right: Intention;
	center: Intention;
	justified: Intention;
}

export interface Intentions_text_alignment_md extends IntentionsMap{
	name: string;
	left: Intention;
	right: Intention;
	center: Intention;
	justified: Intention;
}

export interface Intentions_text_alignment_lg extends IntentionsMap{
	name: string;
	left: Intention;
	right: Intention;
	center: Intention;
	justified: Intention;
}

export interface Intentions_text_alignment_xl extends IntentionsMap{
	name: string;
	left: Intention;
	right: Intention;
	center: Intention;
	justified: Intention;
}

export interface Intentions_text_style extends IntentionsMap{
	name: string;
	text_color_primary: Intention;
	text_color_danger: Intention;
	text_color_inverted: Intention;
}

export interface Intentions_text_font extends IntentionsMap{
	name: string;
	text_font_sansserif: Intention;
	text_font_cursive: Intention;
}

export interface Intentions_container extends IntentionsMap{
	name: string;
	background: Intentions_container_background;
	list: Intentions_container_list;
}

export interface Intentions_container_background extends IntentionsMap{
	name: string;
	section_bg_default: Intention;
	section_bg_1: Intention;
	section_bg_2: Intention;
	section_bg_3: Intention;
	section_bg_4: Intention;
}

export interface Intentions_container_list extends IntentionsMap{
	name: string;
	ordered: Intentions_container_list_ordered;
	unordered: Intentions_container_list_unordered;
	nested_numbering: Intention;
}

export interface Intentions_container_list_ordered extends IntentionsMap{
	name: string;
	numbers: Intention;
	upper_alpha: Intention;
	lower_alpha: Intention;
	lower_roman: Intention;
	upper_roman: Intention;
}

export interface Intentions_container_list_unordered extends IntentionsMap{
	name: string;
	disc: Intention;
	circle: Intention;
	square: Intention;
	none: Intention;
}
