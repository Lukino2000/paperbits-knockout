import * as ko from "knockout";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IEventManager } from "@paperbits/common/events/IEventManager";

import "../bindingHandlers/bindingHandlers.background";
import "../bindingHandlers/bindingHandlers.balloon";
import "../bindingHandlers/bindingHandlers.codeEditor";
import "../bindingHandlers/bindingHandlers.columnSize";
import "../bindingHandlers/bindingHandlers.component";
import "../bindingHandlers/bindingHandlers.content";
import "../bindingHandlers/bindingHandlers.draggables";
import "../bindingHandlers/bindingHandlers.googlemap";
import "../bindingHandlers/bindingHandlers.grid";
import "../bindingHandlers/bindingHandlers.highlight";
import "../bindingHandlers/bindingHandlers.splitter";
import "../bindingHandlers/bindingHandlers.lightbox";
import "../bindingHandlers/bindingHandlers.resourcePicker";
import "../bindingHandlers/bindingHandlers.hyperlink";
import "../bindingHandlers/bindingHandlers.surface";
import "../bindingHandlers/bindingHandlers.snapTo";
import "../bindingHandlers/bindingHandlers.gridCommand";
import "../bindingHandlers/bindingHandlers.align";
import "../bindingHandlers/bindingHandlers.validationMessageToggle";

import { WidgetBindingHandler } from "../bindingHandlers/bindingHandlers.widget";
import { ContentBindingHandler } from "../bindingHandlers/bindingHandlers.content";
import { DraggablesBindingHandler } from "../bindingHandlers/bindingHandlers.draggables";
import { GridBindingHandler } from "../bindingHandlers/bindingHandlers.grid";
import { LightboxBindingHandler } from "../bindingHandlers/bindingHandlers.lightbox";
import { SlateBindingHandler } from "../bindingHandlers/bindingHandlers.slate";
import { BalloonBindingHandler } from "../bindingHandlers/bindingHandlers.balloon";
import { ViewManager } from "../ui/viewManager";
import { BackgroundBindingHandler } from "../bindingHandlers/bindingHandlers.background";
import { ResizableBindingHandler } from "../bindingHandlers/bindingHandlers.resizable";


export class KnockoutRegistrationCommon implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindSingleton("viewManager", ViewManager);

        ko.virtualElements.allowedBindings["widget"] = true;
        ko.virtualElements.allowedBindings["layoutrow"] = true;
        ko.virtualElements.allowedBindings["component"] = true;

        injector.bindSingleton("contentBindingHandler", ContentBindingHandler);
        injector.bindSingleton("gridBindingHandler", GridBindingHandler);
        injector.bindSingleton("lighboxBindingHandler", LightboxBindingHandler);
        injector.bindSingleton("draggablesBindingHandler", DraggablesBindingHandler);
        injector.bindSingleton("widgetBindingHandler", WidgetBindingHandler);
        injector.bindSingleton("slateBindingHandler", SlateBindingHandler);
        injector.bindSingleton("balloonBindingHandler", BalloonBindingHandler);
        injector.bindSingleton("backgroundBindingHandler", BackgroundBindingHandler);
        injector.bindSingleton("resizableBindingHandler", ResizableBindingHandler);
    }
}
