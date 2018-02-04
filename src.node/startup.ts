import "setimmediate";
import * as fs from "fs";
import * as ko from "knockout";
import * as domino from "domino";
import * as XMLHttpRequest from "xhr2";
import * as Utils from "./utils";

import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { ISiteSettings } from "@paperbits/common/sites/ISettings";

import { InversifyInjector } from "@paperbits/common/injection/inversifyInjector";
import { FirebaseModule } from "@paperbits/firebase/firebase.module";
//import { GithubRegistration } from "@paperbits/common/github/registrations.github";
import { ISiteService } from "@paperbits/common/sites/ISiteService";
import { ISettingsProvider, Settings } from "@paperbits/common/configuration/ISettingsProvider";
import { IEventManager } from "@paperbits/common/events/IEventManager";
import { SlateModule } from "@paperbits/slate/slate.module";
import { ComponentRegistrationCommon } from "../src/registrations/components.common";
import { KnockoutRegistrationCommon } from "../src/registrations/knockout.common";
import { KnockoutRegistrationWidgets } from "../src/registrations/knockout.widgets";
import { KnockoutRegistrationLoaders } from "./knockout.loaders";
import { ComponentRegistrationNode } from "./components.node";
import { StaticSettingsProvider } from "./staticSettingsProvider";
import { IModelBinder } from "@paperbits/common/editing/IModelBinder";
import { ModelBinderSelector } from "@paperbits/common/widgets/modelBinderSelector";
import { IntentionsProvider } from "../src/application/intentionsProvider";
import { IntentionsBuilder } from "@paperbits/common/appearence/intentionsBuilder";
import { IIntentionsBuilder } from "@paperbits/common/appearence/intention";
import { theme } from "../src/application/theme";

import { PageViewModelBinder } from "../src/widgets/page/pageViewModelBinder";
import { LayoutViewModelBinder } from "../src/widgets/layout/layoutViewModelBinder";
import { RowViewModelBinder } from "../src/widgets/row/rowViewModelBinder";
import { ColumnViewModelBinder } from "../src/widgets/column/columnViewModelBinder";
import { SectionViewModelBinder } from "../src/widgets/section/sectionViewModelBinder";
import { ButtonViewModelBinder } from "../src/widgets/button/buttonViewModelBinder";
import { PictureViewModelBinder } from "../src/widgets/picture/pictureViewModelBinder";
import { TextblockViewModelBinder } from "../src/widgets/textblock/textblockViewModelBinder";
import { NavbarViewModelBinder } from "../src/widgets/navbar/navbarViewModelBinder";
import { AudioPlayerViewModelBinder } from "../src/widgets/audio-player/audioPlayerViewModelBinder";
import { YoutubePlayerViewModelBinder } from "../src/widgets/youtube-player/youtubePlayerViewModelBinder";
import { VideoPlayerViewModelBinder } from "../src/widgets/video-player/videoPlayerViewModelBinder";
import { MapViewModelBinder } from "../src/widgets/map/mapViewModelBinder";
import { ViewModelBinderSelector } from "../src/widgets/viewModelBinderSelector";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { SliderViewModelBinder } from "../src/widgets/slider/sliderViewModelBinder";

import { Substitute1ModelBinder } from "../src/widgets/substitute1/substitute1ModelBinder";
import { Substitute1ViewModelBinder } from "../src/widgets/substitute1/substitute1ViewModelBinder";
import { Substitute2ModelBinder } from "../src/widgets/substitute2/substitute2ModelBinder";
import { Substitute2ViewModelBinder } from "../src/widgets/substitute2/substitute2ViewModelBinder";
import { Substitute3ModelBinder } from "../src/widgets/substitute3/substitute3ModelBinder";
import { Substitute3ViewModelBinder } from "../src/widgets/substitute3/substitute3ViewModelBinder";
import { Substitute4ModelBinder } from "../src/widgets/substitute4/substitute4ModelBinder";
import { Substitute4ViewModelBinder } from "../src/widgets/substitute4/substitute4ViewModelBinder";
import { Substitute5ModelBinder } from "../src/widgets/substitute5/substitute5ModelBinder";
import { Substitute5ViewModelBinder } from "../src/widgets/substitute5/substitute5ViewModelBinder";
import { Substitute6ModelBinder } from "../src/widgets/substitute6/substitute6ModelBinder";
import { Substitute6ViewModelBinder } from "../src/widgets/substitute6/substitute6ViewModelBinder";
import { Substitute7ModelBinder } from "../src/widgets/substitute7/substitute7ModelBinder";
import { Substitute7ViewModelBinder } from "../src/widgets/substitute7/substitute7ViewModelBinder";
import { Substitute8ModelBinder } from "../src/widgets/substitute8/substitute8ModelBinder";
import { Substitute8ViewModelBinder } from "../src/widgets/substitute8/substitute8ViewModelBinder";
import { IPublisher } from "../src/publishing/IPublisher";
import { PublishingModule } from "../src/publishing/publishing.module";
import { FormModelBinder } from "@paperbits/common/widgets/form/formModelBinder";
import { FormViewModelBinder } from "../src/widgets/form/formViewModelBinder";


declare var global: any;

export async function publish(): Promise<void> {
    let inputBasePath = "./dist/server";
    let outputBasePath = "./dist/published";
    let indexFilePath = `${inputBasePath}/assets/index.html`;
    let templatesBasePath = `${inputBasePath}/scripts/templates`;
    let html = await Utils.loadFileAsString(indexFilePath);

    global.window = domino.createWindow(html);
    global.document = window.document;
    global.navigator = window.navigator;
    global.XMLHttpRequest = XMLHttpRequest;
    global.window["getSelection"] = () => {
        return {
            anchorNode: null,
            anchorOffset: 0,
            baseNode: null,
            baseOffset: 0,
            extentNode: null,
            extentOffset: 0,
            focusNode: null,
            focusOffset: 0,
            isCollapsed: true,
            rangeCount: 0,
            type: "None"
        }
    };

    const injector = new InversifyInjector();
    // console.log(intentionsBuilder.build());
    // console.log(intentionsBuilder.generateContracts());

    const intentionsBuilder: IIntentionsBuilder = new IntentionsBuilder(theme);
    injector.bindInstance("intentionsProvider", new IntentionsProvider(intentionsBuilder));

    injector.bindModule(new SlateModule());
    injector.bindModule(new ComponentRegistrationCommon());
    injector.bindModule(new KnockoutRegistrationCommon());
    injector.bindModule(new KnockoutRegistrationLoaders(templatesBasePath));
    injector.bindModule(new KnockoutRegistrationWidgets());
    injector.bindModule(new FirebaseModule());

    const configJson = await Utils.loadFileAsString(`${inputBasePath}/config.publishing.json`);
    const settings = JSON.parse(configJson);
    injector.bindInstance("settingsProvider", new StaticSettingsProvider(settings));

    injector.bindModule(new ComponentRegistrationNode(inputBasePath, outputBasePath));



    let modelBinders = new Array<IModelBinder>();
    injector.bindInstance("modelBinderSelector", new ModelBinderSelector(modelBinders));
    modelBinders.push(injector.resolve("navbarModelBinder"));
    modelBinders.push(injector.resolve("textModelBinder"));
    modelBinders.push(injector.resolve("pictureModelBinder"));
    modelBinders.push(injector.resolve("mapModelBinder"));
    modelBinders.push(injector.resolve("youtubeModelBinder"));
    modelBinders.push(injector.resolve("videoPlayerModelBinder"));
    modelBinders.push(injector.resolve("audioPlayerModelBinder"));
    modelBinders.push(injector.resolve("buttonModelBinder"));
    modelBinders.push(injector.resolve("sectionModelBinder"));
    modelBinders.push(injector.resolve("pageModelBinder"));
    modelBinders.push(injector.resolve("blogModelBinder"));
    modelBinders.push(injector.resolve("sliderModelBinder"));
    //editors.push(ctx.resolve("codeblockModelBinder"));

    injector.bind("htmlEditorFactory", () => {
        return {
            createHtmlEditor: () => {
                return injector.resolve("htmlEditor");
            }
        }
    })


    let viewModelBinders = new Array<IViewModelBinder>();
    injector.bindInstance("viewModelBinderSelector", new ViewModelBinderSelector(viewModelBinders));
    injector.bind("pageViewModelBinder", PageViewModelBinder);
    injector.bind("layoutViewModelBinder", LayoutViewModelBinder);
    injector.bind("sectionViewModelBinder", SectionViewModelBinder);
    injector.bind("rowViewModelBinder", RowViewModelBinder);
    injector.bind("columnViewModelBinder", ColumnViewModelBinder);
    injector.bind("sliderViewModelBinder", SliderViewModelBinder);
    injector.bind("buttonViewModelBinder", ButtonViewModelBinder);
    injector.bind("pictureViewModelBinder", PictureViewModelBinder);
    injector.bind("textblockViewModelBinder", TextblockViewModelBinder);
    injector.bind("navbarViewModelBinder", NavbarViewModelBinder);
    injector.bind("audioPlayerViewModelBinder", AudioPlayerViewModelBinder);
    injector.bind("youtubePlayerViewModelBinder", YoutubePlayerViewModelBinder);
    injector.bind("videoPlayerViewModelBinder", VideoPlayerViewModelBinder);
    injector.bind("mapViewModelBinder", MapViewModelBinder);

    viewModelBinders.push(injector.resolve("pageViewModelBinder"));
    viewModelBinders.push(injector.resolve("sectionViewModelBinder"));
    viewModelBinders.push(injector.resolve("sliderViewModelBinder"));
    viewModelBinders.push(injector.resolve("buttonViewModelBinder"));
    viewModelBinders.push(injector.resolve("pictureViewModelBinder"));
    viewModelBinders.push(injector.resolve("textblockViewModelBinder"));
    viewModelBinders.push(injector.resolve("navbarViewModelBinder"));
    viewModelBinders.push(injector.resolve("audioPlayerViewModelBinder"));
    viewModelBinders.push(injector.resolve("youtubePlayerViewModelBinder"));
    viewModelBinders.push(injector.resolve("videoPlayerViewModelBinder"));
    viewModelBinders.push(injector.resolve("mapViewModelBinder"));

    injector.bind("formModelBinder", FormModelBinder);
    modelBinders.push(injector.resolve("formModelBinder"));
    injector.bind("formViewModelBinder", FormViewModelBinder);
    viewModelBinders.push(injector.resolve("formViewModelBinder"));

    injector.bind("substitute1ModelBinder", Substitute1ModelBinder);
    modelBinders.push(injector.resolve("substitute1ModelBinder"));
    injector.bind("substitute1ViewModelBinder", Substitute1ViewModelBinder);
    viewModelBinders.push(injector.resolve("substitute1ViewModelBinder"));

    injector.bind("substitute2ModelBinder", Substitute2ModelBinder);
    modelBinders.push(injector.resolve("substitute2ModelBinder"));
    injector.bind("substitute2ViewModelBinder", Substitute2ViewModelBinder);
    viewModelBinders.push(injector.resolve("substitute2ViewModelBinder"));

    injector.bind("substitute3ModelBinder", Substitute3ModelBinder);
    modelBinders.push(injector.resolve("substitute3ModelBinder"));
    injector.bind("substitute3ViewModelBinder", Substitute3ViewModelBinder);
    viewModelBinders.push(injector.resolve("substitute3ViewModelBinder"));

    injector.bind("substitute4ModelBinder", Substitute4ModelBinder);
    modelBinders.push(injector.resolve("substitute4ModelBinder"));
    injector.bind("substitute4ViewModelBinder", Substitute4ViewModelBinder);
    viewModelBinders.push(injector.resolve("substitute4ViewModelBinder"));

    injector.bind("substitute5ModelBinder", Substitute5ModelBinder);
    modelBinders.push(injector.resolve("substitute5ModelBinder"));
    injector.bind("substitute5ViewModelBinder", Substitute5ViewModelBinder);
    viewModelBinders.push(injector.resolve("substitute5ViewModelBinder"));

    injector.bind("substitute6ModelBinder", Substitute6ModelBinder);
    modelBinders.push(injector.resolve("substitute6ModelBinder"));
    injector.bind("substitute6ViewModelBinder", Substitute6ViewModelBinder);
    viewModelBinders.push(injector.resolve("substitute6ViewModelBinder"));

    injector.bind("substitute7ModelBinder", Substitute7ModelBinder);
    modelBinders.push(injector.resolve("substitute7ModelBinder"));
    injector.bind("substitute7ViewModelBinder", Substitute7ViewModelBinder);
    viewModelBinders.push(injector.resolve("substitute7ViewModelBinder"));

    injector.bind("substitute8ModelBinder", Substitute8ModelBinder);
    modelBinders.push(injector.resolve("substitute8ModelBinder"));
    injector.bind("substitute8ViewModelBinder", Substitute8ViewModelBinder);
    viewModelBinders.push(injector.resolve("substitute8ViewModelBinder"));

    injector.bindModule(new PublishingModule());


    /*** Autostart ***/
    injector.resolve("widgetBindingHandler");
    injector.resolve("slateBindingHandler");
    injector.resolve("backgroundBindingHandler");

    ko.applyBindings();

    const publisher = injector.resolve<IPublisher>("sitePublisher");

    try {
        console.log(new Date());
        await publisher.publish();
        console.log(new Date());
    }
    catch (error) {
        console.log(error);
    }
}