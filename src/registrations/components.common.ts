import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { SavingHandler, OfflineObjectStorage, AnchorMiddleware } from "@paperbits/common/persistence";
import { PermalinkService, IPermalinkService, IPermalinkResolver, PermalinkResolver } from "@paperbits/common/permalinks";
import { XmlHttpRequestClient } from "@paperbits/common/http";
import { SettingsProvider } from "@paperbits/common/configuration";
import { DefaultEventManager, GlobalEventHandler } from "@paperbits/common/events";
import { DefaultRouteHandler } from "@paperbits/common/routing";
import { LocalCache } from "@paperbits/common/caching";
import { WidgetService } from "@paperbits/common/widgets";
import { LayoutService } from "@paperbits/common/layouts";
import { PageService, PagePermalinkResolver } from "@paperbits/common/pages";
import { BlogService, BlogPermalinkResolver } from "@paperbits/common/blogs";
import { FileService } from "@paperbits/common/files";
import { MediaService, MediaPermalinkResolver } from "@paperbits/common/media";
import { BlockService } from "@paperbits/common/blocks";
import { NavigationService } from "@paperbits/common/navigation";
import { SiteService } from "@paperbits/common/sites";
import { IntercomService } from "@paperbits/common/intercom/intercomService";
import { UrlService, UrlPermalinkResolver } from "@paperbits/common/urls";
import { YoutubeModelBinder } from "@paperbits/common/widgets/youtube-player";
import { VideoPlayerModelBinder } from "@paperbits/common/widgets/video-player";
import { AudioPlayerModelBinder } from "@paperbits/common/widgets/audio-player";
import { BlogModelBinder } from "@paperbits/common/widgets/blog";
import { LayoutModelBinder } from "@paperbits/common/widgets/layout";
import { PageModelBinder } from "@paperbits/common/widgets/page";
import { SectionModelBinder } from "@paperbits/common/widgets/section";
import { RowModelBinder } from "@paperbits/common/widgets/row";
import { ColumnModelBinder } from "@paperbits/common/widgets/column";
import { NavbarModelBinder } from "@paperbits/common/widgets/navbar";
import { TextblockModelBinder } from "@paperbits/common/widgets/textblock";
import { PictureModelBinder } from "@paperbits/common/widgets/picture";
import { MapModelBinder } from "@paperbits/common/widgets/map";
import { ButtonModelBinder } from "@paperbits/common/widgets/button";
import { SliderModelBinder } from "@paperbits/common/widgets/slider";
import { BackgroundModelBinder } from "@paperbits/common/widgets/background";
import { FormModelBinder } from "@paperbits/common/widgets/form";
import { UnhandledErrorHandler } from "@paperbits/common/errors";

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