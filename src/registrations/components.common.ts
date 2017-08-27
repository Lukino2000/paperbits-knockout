import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { XmlHttpRequestClient } from "@paperbits/common/http/xmlHttpRequestClient";
import { SettingsProvider } from "@paperbits/common/configuration/settingsProvider";
import { DefaultEventManager } from "@paperbits/common/events/defaultEventManager";
import { DefaultRouteHandler } from "@paperbits/common/routing/defaultRouteHandler";
import { GlobalEventHandler } from "@paperbits/common/events/globalEventHandler";
import { LocalCache } from "@paperbits/common/caching/localCache";
import { PermalinkService } from "@paperbits/common/permalinks/permalinkService";
import { WidgetService } from "@paperbits/common/widgets/widgetService";
import { LayoutService } from "@paperbits/common/layouts/layoutService";
import { PageService } from "@paperbits/common/pages/pageService";
import { BlogService } from "@paperbits/common/blogs/blogService";
import { FileService } from "@paperbits/common/files/fileService";
import { MediaService } from "@paperbits/common/media/mediaService";
import { NavigationService } from "@paperbits/common/navigation/navigationService";
import { SiteService } from "@paperbits/common/sites/siteService";
import { IntercomService } from "@paperbits/common/intercom/intercomService";
import { YoutubeModelBinder } from "@paperbits/common/widgets/youtube-player/youtubeModelBinder";
import { VideoPlayerModelBinder } from "@paperbits/common/widgets/video-player/videoPlayerModelBinder";
import { AudioPlayerModelBinder } from "@paperbits/common/widgets/audio-player/audioPlayerModelBinder";
import { BlogModelBinder } from "@paperbits/common/widgets/blog/blogModelBinder";
import { LayoutModelBinder } from "@paperbits/common/widgets/layout/layoutModelBinder";
import { PageModelBinder } from "@paperbits/common/widgets/page/pageModelBinder";
import { SectionModelBinder } from "@paperbits/common/widgets/section/sectionModelBinder";
import { RowModelBinder } from "@paperbits/common/widgets/row/rowModelBinder";
import { ColumnModelBinder } from "@paperbits/common/widgets/column/columnModelBinder";
import { NavbarModelBinder } from "@paperbits/common/widgets/navbar/navbarModelBinder";
import { TextblockModelBinder } from "@paperbits/common/widgets/textblock/textblockModelBinder";
import { PictureModelBinder } from "@paperbits/common/widgets/picture/pictureModelBinder";
import { MapModelBinder } from "@paperbits/common/widgets/map/mapModelBinder";
import { ButtonModelBinder } from "@paperbits/common/widgets/button/buttonModelBinder";
import { SliderModelBinder } from "@paperbits/common/widgets/slider/sliderModelBinder";
import { BackgroundModelBinder } from "@paperbits/common/widgets/background/backgroundModelBinder";
import { SavingHandler } from "@paperbits/common/persistence/savingHandler";

export class ComponentRegistrationCommon implements IInjectorModule {
    public register(injector: IInjector) {
        /*** Core ***/
        injector.bindSingleton("httpClient", XmlHttpRequestClient);
        injector.bindSingleton("settingsProvider", SettingsProvider);
        injector.bindSingleton("eventManager", DefaultEventManager);
        injector.bindSingleton("routeHandler", DefaultRouteHandler);
        injector.bindSingleton("globalEventHandler", GlobalEventHandler);
        injector.bindSingleton("localCache", LocalCache);

        /*** Services ***/
        injector.bindSingleton("permalinkService", PermalinkService);
        injector.bindSingleton("widgetService", WidgetService);
        injector.bindSingleton("layoutService", LayoutService);
        injector.bindSingleton("pageService", PageService);
        injector.bindSingleton("blogService", BlogService);
        injector.bindSingleton("fileService", FileService);
        injector.bindSingleton("mediaService", MediaService);
        injector.bindSingleton("navigationService", NavigationService);
        injector.bindSingleton("siteService", SiteService);
        injector.bindSingleton("intercomService", IntercomService);

        /*** Model binders ***/
        injector.bind("backgroundModelBinder", BackgroundModelBinder);
        injector.bind("layoutModelBinder", LayoutModelBinder);
        injector.bindSingleton("pageModelBinder", PageModelBinder);
        injector.bind("blogModelBinder", BlogModelBinder);
        injector.bind("sectionModelBinder", SectionModelBinder);
        injector.bind("rowModelBinder", RowModelBinder);
        injector.bind("columnModelBinder", ColumnModelBinder);
        injector.bind("navbarModelBinder", NavbarModelBinder);
        injector.bind("textModelBinder", TextblockModelBinder);
        injector.bind("pictureModelBinder", PictureModelBinder);
        injector.bind("mapModelBinder", MapModelBinder);
        injector.bind("youtubeModelBinder", YoutubeModelBinder);
        injector.bind("videoPlayerModelBinder", VideoPlayerModelBinder);
        injector.bind("audioPlayerModelBinder", AudioPlayerModelBinder);
        injector.bind("buttonModelBinder", ButtonModelBinder);
        injector.bind("sliderModelBinder", SliderModelBinder);
        //injector.bind("codeblockModelBinder", CodeblockModelBinder);

        injector.bindSingleton("savingHandler", SavingHandler);
    }
}