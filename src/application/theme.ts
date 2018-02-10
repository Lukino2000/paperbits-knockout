export var theme = 
{
    text: {
        alignment: {
            "left": (vp) => (!vp || vp === "xs") ? "text-left" : "text-" + vp + "-left",
            "right": (vp) => (!vp || vp === "xs") ? "text-right" : "text-" + vp + "-right",
            "center": (vp) => (!vp || vp === "xs") ? "text-center" : "text-" + vp + "-center",
            "justified": (vp) => (!vp || vp === "xs") ? "text-justified" : "text-" + vp + "-justified"
        },
        size: {
            "text_lead": "lead",
            "default": "default"
        },
        style: {
            "text_color_primary": "text-primary",
            "text_color_danger": "text-danger",
            "text_color_inverted": "text-inverted",
            "text_lead": "lead"
        }
    },
    container: {
        background: {
            "section_bg_default": "section-default",
            "section_bg_1": "section-smoke",
            "section_bg_2": "section-darker-smoke",
            "section_bg_3": "section-dark-smoke",
            "section_bg_4": "section-hightlighted"
        }
    }
};