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

        style: {
            "text-color-primary": {
                name: (): string => "Primary",
                styles: (): string => "text-primary"
            },
            "text-color-danger": {
                name: (): string => "Danger",
                styles: (): string => "text-danger"
            },
            "text-color-inverted": {
                name: (): string => "Inverted",
                styles: (): string => "text-inverted"
            },
            "text-lead": {
                name: (): string => "Lead",
                styles: (): string => "lead"
            }
            // success: {
            //     name: "Success",
            //     styles: (): string => "text-success"
            // },
            // info: {
            //     name: "Info",
            //     styles: (): string => "text-info"
            // },
            // warning: {
            //     name: "Warning",
            //     styles: (): string => "text-warning"
            // },
            // danger: {
            //     name: "Danger",
            //     styles: (): string => "text-danger"
            // },
            // muted: {
            //     name: "Muted",
            //     styles: (): string => "text-muted"
            // }
        }
    },

    section: {
        background: {
            "section-bg-default": {
                name: (): string => "Default",
                styles: (): string => "section-default"
            },
            "section-bg-1": {
                name: (): string => "Smoke",
                styles: (): string => "section-smoke"
            },
            "section-bg-2": {
                name: (): string => "Darker smoke",
                styles: (): string => "section-darker-smoke"
            },
            "section-bg-3": {
                name: (): string => "Dark smoke",
                styles: (): string => "section-dark-smoke"
            },
            "section-bg-4": {
                name: (): string => "Orange",
                styles: (): string => "section-hightlighted"
            }
        }
    }
}