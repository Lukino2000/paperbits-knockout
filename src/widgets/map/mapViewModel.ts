import * as ko from "knockout";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { MapModel } from "@paperbits/common/widgets/models/mapModel";


export class MapViewModel implements IViewModelBinder {
    public location: KnockoutObservable<string>;
    public caption: KnockoutObservable<string>;
    public layout: KnockoutObservable<string>;
    public animation: KnockoutObservable<string>;
    public zoomControl: KnockoutObservable<string>;

    constructor() {
        this.location = ko.observable<string>("Seattle, WA");
        this.caption = ko.observable<string>("Seattle, WA");
        this.layout = ko.observable<string>();
        this.zoomControl = ko.observable<string>("hide");
    }

    public attachToModel(model:MapModel){
        this.caption(model.caption);
        this.layout(model.layout);
        this.location(model.location);
        this.zoomControl(model.zoomControl);
    }
}