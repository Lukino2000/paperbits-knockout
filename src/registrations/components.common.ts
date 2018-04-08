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
import { BlockService } from "@paperbits/common/blocks/blockService";
import { NavigationService } from "@paperbits/common/navigation/navigationService";
import { SiteService } from "@paperbits/common/sites/siteService";
import { IntercomService } from "@paperbits/common/intercom/intercomService";
import { UrlService } from "@paperbits/common/urls/urlService";
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
import { FormModelBinder } from "@paperbits/common/widgets/form/formModelBinder";
import { SavingHandler } from "@paperbits/common/persistence/savingHandler";
import { UnhandledErrorHandler } from "@paperbits/common/errors/unhandledErrorHandler";
import { OfflineObjectStorage } from "@paperbits/common/persistence/offlineObjectStorage";
import { AnchorMiddleware } from "@paperbits/common/persistence/anchorMiddleware";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IPermalinkResolver } from "@paperbits/common/permalinks/IPermalinkResolver";
import { PermalinkResolver } from "@paperbits/common/permalinks/permalinkResolver";
import { MediaPermalinkResolver } from "@paperbits/common/media/mediaPermalinkResolver";
import { PagePermalinkResolver } from "@paperbits/common/pages/pagePermalinkResolver";
import { BlogPermalinkResolver } from "@paperbits/common/blogs/blogPermalinkResolver";
import { UrlPermalinkResolver } from "@paperbits/common/urls/urlPermalinkResolver";


export class ComponentRegistrationCommon implements IInjectorModule {
    public register(injector: IInjector) {
        /*** Core ***/
        injector.bindSingleton("httpClient", XmlHttpRequestClient);
        injector.bindSingleton("settingsProvider", SettingsProvider);
        injector.bindSingleton("eventManager", DefaultEventManager);
        injector.bindSingleton("routeHandler", DefaultRouteHandler);
        injector.bindSingleton("globalEventHandler", GlobalEventHandler);
        injector.bindSingleton("localCache", LocalCache);
        injector.bindSingleton("offlineObjectStorage", OfflineObjectStorage);
        injector.bindSingleton("anchorMiddleware", AnchorMiddleware);

        /*** Services ***/
        injector.bindSingleton("permalinkService", PermalinkService);
        injector.bindSingleton("widgetService", WidgetService);
        injector.bindSingleton("layoutService", LayoutService);
        injector.bindSingleton("pageService", PageService);
        injector.bindSingleton("blogService", BlogService);
        injector.bindSingleton("fileService", FileService);
        injector.bindSingleton("mediaService", MediaService);
        injector.bindSingleton("blockService", BlockService);
        injector.bindSingleton("navigationService", NavigationService);
        injector.bindSingleton("siteService", SiteService);
        injector.bindSingleton("intercomService", IntercomService);
        injector.bindSingleton("urlService", UrlService);
        injector.bindSingleton("savingHandler", SavingHandler);
        injector.bindSingleton("errorHandler", UnhandledErrorHandler);


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

        injector.bind("mediaPermalinkResolver", MediaPermalinkResolver);
        injector.bind("pagePermalinkResolver", PagePermalinkResolver);
        injector.bind("blogPermalinkResolver", BlogPermalinkResolver);
        injector.bind("urlPermalinkResolver", UrlPermalinkResolver);

        injector.bindSingletonFactory("permalinkResolver", (ctx: IInjector) => {
            const permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            const mediaPermalinkResolver = ctx.resolve<IPermalinkResolver>("mediaPermalinkResolver");
            const pagePermalinkResolver = ctx.resolve<IPermalinkResolver>("pagePermalinkResolver");
            const blogPermalinkResolver = ctx.resolve<IPermalinkResolver>("blogPermalinkResolver");
            const urlPermalinkResolver = ctx.resolve<IPermalinkResolver>("urlPermalinkResolver");

            return new PermalinkResolver(permalinkService, [
                mediaPermalinkResolver,
                pagePermalinkResolver,
                blogPermalinkResolver,
                urlPermalinkResolver
            ]);
        });
    }
}