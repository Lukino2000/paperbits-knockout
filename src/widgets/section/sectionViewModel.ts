import * as ko from "knockout";
import { RowViewModel } from "./../row/rowViewModel";
import { IBackground } from "@paperbits/common/ui/IBackground";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { SectionModel } from "@paperbits/common/widgets/models/sectionModel";
import { IWidgetModel } from "@paperbits/common/editing/IWidgetModel";


export class SectionViewModel implements IViewModelBinder {
    public rows: KnockoutObservableArray<IWidgetModel>;
    public layout: KnockoutObservable<string>;
    public backgroundType: KnockoutObservable<string>;
    public backgroundPictureUrl: KnockoutObservable<string>;
    public backgroundSize: KnockoutObservable<string>;
    public backgroundPosition: KnockoutObservable<string>;
    public backgroundRepeat: KnockoutObservable<string>;

    public background: KnockoutObservable<IBackground>;
    public css: KnockoutObservable<string>;
    public snapTo: KnockoutObservable<string>;

    constructor() {
        this.rows = ko.observableArray<IWidgetModel>();
        this.layout = ko.observable<string>("container");
        this.backgroundType = ko.observable<string>();
        this.backgroundPictureUrl = ko.observable<string>();
        this.backgroundSize = ko.observable<string>();
        this.backgroundPosition = ko.observable<string>();
        this.backgroundRepeat = ko.observable<string>();
        this.css = ko.observable<string>();
        this.snapTo = ko.observable<string>();
        this.background = ko.computed<IBackground>(this.computeBackground.bind(this));
    }

    private computeBackground() {
        let background = {
            // videoUrl: "https://firebasestorage.googleapis.com/v0/b/project-5562312728052499011.appspot.com/o/tenants%2Fdefault%2Fcar-20120827-85.mp4?alt=media&token=38138adf-5898-4ffb-a67e-cec1f8d4689b"
        };

        if (this.backgroundType() === "picture") {
            Object.assign(background, {
                imageUrl: this.backgroundPictureUrl(),
                position: this.backgroundPosition(),
                size: this.backgroundSize(),
                repeat: this.backgroundRepeat()
            })
        }

        return background;
    }

    public attachToModel(widgetModel: IWidgetModel) {
        let model = <SectionModel>widgetModel.model;
        
        this.layout(model.layout);
        this.backgroundType(model.backgroundType);
        this.backgroundPictureUrl(model.backgroundPictureUrl);
        this.backgroundSize(model.backgroundSize);
        this.backgroundPosition(model.backgroundPosition);

        let sectionClasses = [];
        let backgroundIntentionKey = model.backgroundIntentionKey;
        let intention = intentions.section.background[backgroundIntentionKey];

        if (!intention) {
            intention = intentions.section.background["section-bg-default"];
        }
        sectionClasses.push(intention.styles());

        this.rows(widgetModel.children);

        if (model.padding === "with-padding") {
            sectionClasses.push("with-padding");
        }

        switch (model.snap) {
            case "none":
                this.snapTo(null);
                break;
            case "top":
                this.snapTo("top");
                break;
            case "bottom":
                this.snapTo("bottom");
                break;
            default:
                throw `Unkown snap value "${model.snap}".`;
        }

        this.css(sectionClasses.join(" "));
    }
}