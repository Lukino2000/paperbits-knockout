/********************************************************************
THIS IS AUTO-GENERATED CODE.
DO NOT MODIFY THIS FILE DIRECTLY OTHERWISE ALL CHANGES WILL BE LOST.
********************************************************************/

import { Intention } from '@paperbits/common/appearence/intention'

export interface Intentions {
	text: Intentions_text;
	container: Intentions_container;
}

export interface Intentions_text {
	size: Intentions_text_size;
	alignment: Intentions_text_alignment;
	style: Intentions_text_style;
}

export interface Intentions_text_size {
	text_lead: Intention;
}

export interface Intentions_text_alignment {
	viewports: Intentions_text_alignment_viewports;
	alignedLeft: Intention;
	alignedRight: Intention;
	alignedCenter: Intention;
	justified: Intention;
}

export interface Intentions_text_alignment_viewports {
	xs: Intentions_text_alignment_viewports_xs;
	sm: Intentions_text_alignment_viewports_sm;
	md: Intentions_text_alignment_viewports_md;
	lg: Intentions_text_alignment_viewports_lg;
	xl: Intentions_text_alignment_viewports_xl;
}

export interface Intentions_text_alignment_viewports_xs {
	alignedLeft: Intention;
	alignedRight: Intention;
	alignedCenter: Intention;
	justified: Intention;
}

export interface Intentions_text_alignment_viewports_sm {
	alignedLeft: Intention;
	alignedRight: Intention;
	alignedCenter: Intention;
	justified: Intention;
}

export interface Intentions_text_alignment_viewports_md {
	alignedLeft: Intention;
	alignedRight: Intention;
	alignedCenter: Intention;
	justified: Intention;
}

export interface Intentions_text_alignment_viewports_lg {
	alignedLeft: Intention;
	alignedRight: Intention;
	alignedCenter: Intention;
	justified: Intention;
}

export interface Intentions_text_alignment_viewports_xl {
	alignedLeft: Intention;
	alignedRight: Intention;
	alignedCenter: Intention;
	justified: Intention;
}

export interface Intentions_text_style {
	text_color_primary: Intention;
	text_color_danger: Intention;
	text_color_inverted: Intention;
}

export interface Intentions_container {
	background: Intentions_container_background;
}

export interface Intentions_container_background {
	section_bg_default: Intention;
	section_bg_1: Intention;
	section_bg_2: Intention;
	section_bg_3: Intention;
	section_bg_4: Intention;
}
