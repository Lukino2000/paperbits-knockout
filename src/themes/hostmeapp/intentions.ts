/*
   Intention map should be registered/injected as all other components;
*/

export var intentions = {
    text: {
        alignment: {
            alignedLeft: (): string => {
                return "text-left";
            },
            alignedRight: (): string => {
                return "text-right";
            },
            alignedCenter: (): string => {
                return "text-center";
            },
            justified: (): string => {
                return "text-justify";
            }
        },

        size: {
            "text-lead": {
                category: "lead",
                name: (): string => "Lead",
                styles: (): string => "lead",
                scope: "block"
            }
        },

        style: {
            "text-color-primary": {
                category: "color",
                name: (): string => "Primary",
                styles: (): string => "text-primary",
                scope: "inline"
            },
            "text-color-danger": {
                category: "color",
                name: (): string => "Danger",
                styles: (): string => "text-danger",
                scope: "inline"
            },
            "text-color-inverted": {
                category: "color",
                name: (): string => "Inverted",
                styles: (): string => "text-inverted",
                scope: "inline"
            },
            "text-lead": {
                category: "lead",
                name: (): string => "Lead",
                styles: (): string => "lead",
                scope: "block"
            }
        }
    },

    section: {
        background: {
            "section-bg-default": {
                category: "background",
                name: (): string => "Default",
                styles: (): string => "section-default"
            },
            "section-bg-1": {
                category: "background",
                name: (): string => "Smoke",
                styles: (): string => "section-smoke"
            },
            "section-bg-2": {
                category: "background",
                name: (): string => "Darker smoke",
                styles: (): string => "section-darker-smoke"
            },
            "section-bg-3": {
                category: "background",
                name: (): string => "Dark smoke",
                styles: (): string => "section-dark-smoke"
            },
            "section-bg-4": {
                category: "background",
                name: (): string => "Orange",
                styles: (): string => "section-hightlighted"
            }
        }
    }
}