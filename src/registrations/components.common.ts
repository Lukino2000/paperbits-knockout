import { SlateHtmlEditor } from "@paperbits/slate/slateHtmlEditor";

import { IRegistration } from "@paperbits/common/injection/IRegistration";
import { IInjector } from "@paperbits/common/injection/IInjector";
import { XmlHttpRequestClient } from "@paperbits/common/http/xmlHttpRequestClient";
import { SettingsProvider } from "@paperbits/common/configuration/settingsProvider";
import { DefaultEventManager } from "@paperbits/common/events/defaultEventManager";
import { DefaultRouteHandler } from "@paperbits/common/routing/defaultRouteHandler";
import { GlobalEventHandler } from "@paperbits/common/events/globalEventHandler";
import { LocalCache } from "@paperbits/common/caching/localCache";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IObjectStorage } from "@paperbits/common/persistence/IObjectStorage";
import { PermalinkService } from "@paperbits/common/permalinks/permalinkService";
import { WidgetService } from "@paperbits/common/widgets/widgetService";
import { LayoutService } from "@paperbits/common/layouts/layoutService";
import { PageService } from "@paperbits/common/pages/pageService";
import { BlogService } from "@paperbits/common/blogs/blogService";
import { NewsService } from "@paperbits/common/news/newsService";
import { FileService } from "@paperbits/common/files/fileService";
import { MediaService } from "@paperbits/common/media/mediaService";
import { NavigationService } from "@paperbits/common/navigation/navigationService";
import { SiteService } from "@paperbits/common/sites/siteService";
import { IntercomService } from "@paperbits/common/intercom/intercomService";
import { LayoutModelBinder } from "@paperbits/common/widgets/layoutModelBinder";
import { PageModelBinder } from "@paperbits/common/widgets/pageModelBinder";
import { SectionModelBinder } from "@paperbits/common/widgets/sectionModelBinder";
import { RowModelBinder } from "@paperbits/common/widgets/rowModelBinder";
import { ColumnModelBinder } from "@paperbits/common/widgets/columnModelBinder";
import { NavbarModelBinder } from "@paperbits/common/widgets/navbarModelBinder";
import { TextblockModelBinder } from "@paperbits/common/widgets/textblockModelBinder";
import { PictureModelBinder } from "@paperbits/common/widgets/pictureModelBinder";
import { MapModelBinder } from "@paperbits/common/widgets/mapModelBinder";
import { VideoPlayerModelBinder } from "@paperbits/common/widgets/videoPlayerModelBinder";
import { AudioPlayerModelBinder } from "@paperbits/common/widgets/audioPlayerModelBinder";
import { ButtonModelBinder } from "@paperbits/common/widgets/buttonModelBinder";
import { ModelBinderSelector } from "@paperbits/common/widgets/modelBinderSelector";
import { IModelBinder } from "@paperbits/common/editing/IModelBinder";
import { PermalinkResolver } from "@paperbits/common/permalinks/permalinkResolver";
import { ViewManager } from "../ui/viewManager";
import { YoutubeModelBinder } from "../editors/youtube-player/youtubeModelBinder";
import { BlogModelBinder } from "@paperbits/common/widgets/blogModelBinder";
import { IEventManager } from "@paperbits/common/events/IEventManager";


export class ComponentRegistrationCommon implements IRegistration {
    public register(injector: IInjector) {
        /*** Core ***/
        injector.bindSingleton("httpClient", XmlHttpRequestClient);
        injector.bindSingleton("settingsProvider", SettingsProvider);
        injector.bindSingleton("eventManager", DefaultEventManager);
        injector.bindSingleton("routeHandler", DefaultRouteHandler);
        injector.bindSingleton("globalEventHandler", GlobalEventHandler);
        injector.bindSingleton("localCache", LocalCache);

        /*** Services ***/
        injector.bindFactory<IPermalinkService>("permalinkService", (ctx: IInjector) => {
            var objectStorage = ctx.resolve<IObjectStorage>("objectStorage");
            return new PermalinkService(objectStorage);
        });
        injector.bindSingleton("widgetService", WidgetService);
        injector.bindSingleton("layoutService", LayoutService);
        injector.bindSingleton("pageService", PageService);
        injector.bindSingleton("blogService", BlogService);
        injector.bindSingleton("newsService", NewsService);
        injector.bindSingleton("fileService", FileService);
        injector.bindSingleton("mediaService", MediaService);
        injector.bindSingleton("navigationService", NavigationService);
        injector.bindSingleton("siteService", SiteService);
        injector.bindSingleton("intercomService", IntercomService);

        /*** Model binders ***/
        injector.bind("layoutModelBinder", LayoutModelBinder);
        injector.bind("pageModelBinder", PageModelBinder);
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
        //injector.bind("codeblockModelBinder", CodeblockModelBinder);
        injector.bind("buttonModelBinder", ButtonModelBinder);

        injector.bindFactory<ModelBinderSelector>("modelBinderSelector", (ctx) => {
            let modelBinders = new Array<IModelBinder>();
            modelBinders.push(ctx.resolve<IModelBinder>("navbarModelBinder"));
            modelBinders.push(ctx.resolve<IModelBinder>("textModelBinder"));
            modelBinders.push(ctx.resolve<IModelBinder>("pictureModelBinder"));
            modelBinders.push(ctx.resolve<IModelBinder>("mapModelBinder"));
            modelBinders.push(ctx.resolve<IModelBinder>("youtubeModelBinder"));
            modelBinders.push(ctx.resolve<IModelBinder>("videoPlayerModelBinder"));
            modelBinders.push(ctx.resolve<IModelBinder>("audioPlayerModelBinder"));
            //editors.push(ctx.resolve<IModelBinder>("codeblockModelBinder"));
            modelBinders.push(ctx.resolve<IModelBinder>("buttonModelBinder"));

            return new ModelBinderSelector(modelBinders);
        });

        injector.bindFactory<ModelBinderSelector>("layoutModelBinderSelector", (ctx) => {
            let modelBinders = new Array<IModelBinder>();
            modelBinders.push(ctx.resolve<IModelBinder>("sectionModelBinder"));
            modelBinders.push(ctx.resolve<IModelBinder>("pageModelBinder"));
            modelBinders.push(ctx.resolve<IModelBinder>("blogModelBinder"));

            return new ModelBinderSelector(modelBinders);
        });
    }
}