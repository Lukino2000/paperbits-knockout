import { IBlogService } from "@paperbits/common/blogs/IBlogService";
import { IContentDropHandler } from '@paperbits/common/editing/IContentDropHandler';
import { IEventManager } from '@paperbits/common/events/IEventManager';
import { IFileService } from '@paperbits/common/files/IFileService';
import { IHyperlinkProvider } from "@paperbits/common/ui/IHyperlinkProvider";
import { IInjector } from '@paperbits/common/injection/IInjector';
import { ILayoutService } from "@paperbits/common/layouts/ILayoutService";
import { IMedia } from "@paperbits/common/media/IMedia";
import { IMediaService } from '@paperbits/common/media/IMediaService';
import { IModelBinder } from "@paperbits/common/editing/IModelBinder";
import { INavigationService } from '@paperbits/common/navigation/INavigationService';
import { INewsService } from "@paperbits/common/news/INewsService";
import { IntercomService } from '@paperbits/common/intercom/intercomService';
import { IPage } from "@paperbits/common/pages/IPage";
import { IPageService } from '@paperbits/common/pages/IPageService';
import { IPermalink } from '@paperbits/common/permalinks/IPermalink';
import { IPermalinkService } from '@paperbits/common/permalinks/IPermalinkService';
import { IRegistration } from '@paperbits/common/injection/IRegistration';
import { IRouteHandler } from '@paperbits/common/routing/IRouteHandler';
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { IWidgetHandler } from '@paperbits/common/editing/IWidgetHandler';
import { IWidgetService } from "@paperbits/common/widgets/IWidgetService";
import { AudioEditor } from '../editors/audio-player/audioEditor';
import { AudioHandlers } from '../editors/audio-player/audioHandlers';
import { AudioPlayerModelBinder } from "@paperbits/common/widgets/audioPlayerModelBinder";
import { BlogPostDetailsWorkshop } from "../workshops/blogs/blogPostDetails";
import { BlogPostItem } from "../workshops/blogs/blogPostItem";
import { BlogService } from "@paperbits/common/blogs/blogService";
import { BlogWorkshop } from '../workshops/blogs/blogs';
import { ButtonEditor } from "../editors/button/buttonEditor";
import { ButtonHandlers } from "../editors/button/buttonHandlers";
import { ButtonModelBinder } from "@paperbits/common/widgets/buttonModelBinder";
import { Code } from '../widgets/codeblock/code';
import { CodeblockModelBinder } from "@paperbits/common/widgets/codeblockModelBinder";
import { CodeEditor } from '../editors/codeblock/codeEditor';
import { CodeHandlers } from '../editors/codeblock/codeHandlers';
import { ColorSelector } from '../workshops/colors/colorSelector';
import { StyleSelector } from '../workshops/text/styleSelector';
import { ColumnEditor } from "../editors/column/columnEditor";
import { ColumnModelBinder } from "@paperbits/common/widgets/columnModelBinder";
import { DefaultEventManager } from '@paperbits/common/events/defaultEventManager';
import { DefaultRouteHandler } from '@paperbits/common/routing/defaultRouteHandler';
import { DragManager } from '@paperbits/common/ui/draggables/dragManager';
import { DropBucket } from '../workshops/dropbucket/dropbucket';
import { FileService } from '@paperbits/common/files/fileService';
import { FormattingTools } from '../editors/textblock/formatting/formattingTools';
import { GlobalEventHandler } from '@paperbits/common/events/globalEventHandler';
import { GoogleTagManager } from '../widgets/gtm/gtm';
import { HyperlinkTools } from '../editors/textblock/hyperlink/hyperlinkTools';
import { LayoutDetailsWorkshop } from "../workshops/layouts/layoutDetailsWorkshop";
import { LayoutItem } from "../workshops/layouts/layoutItem";
import { LayoutModelBinder } from "@paperbits/common/widgets/layoutModelBinder";
import { LayoutSelector } from "../workshops/layouts/layoutSelector";
import { LayoutService } from "@paperbits/common/layouts/layoutService";
import { LayoutsWorkshop } from "../workshops/layouts/layoutsWorkshop";
import { LityLightbox } from '@paperbits/common/ui/lityLightbox';
import { LocalCache } from '@paperbits/common/caching/localCache';
import { MapEditor } from '../editors/map/mapEditor';
import { MapHandlers } from '../editors/map/mapHandlers';
import { MapModelBinder } from "@paperbits/common/widgets/mapModelBinder";
import { MediaHandlers } from '../editors/mediaHandlers';
import { MediaResourcePicker } from "../workshops/media/mediaResourcePicker";
import { MediaSelector } from '../workshops/media/mediaSelector';
import { MediaService } from '@paperbits/common/media/mediaService';
import { MediaWorkshop } from '../workshops/media/media';
import { ModelBinderSelector } from "@paperbits/common/widgets/modelBinderSelector";
import { NavbarEditor } from "../editors/navbar/navbarEditor";
import { NavbarHandlers } from "../editors/navbar/navbarHandlers";
import { NavbarModelBinder } from "@paperbits/common/widgets/navbarModelBinder";
import { NavigationDetailsWorkshop } from '../workshops/navigation/navigationDetails';
import { NavigationService } from '@paperbits/common/navigation/navigationService';
import { NavigationWorkshop } from '../workshops/navigation/navigation';
import { NewsEditor } from '../workshops/news/newsEditor';
import { NewsElementDetailsEditor } from "../workshops/news/newsElementDetailsEditor";
import { NewsArticleItem } from "../workshops/news/newsElementItem";
import { NewsService } from "@paperbits/common/news/newsService";
import { PageDetailsWorkshop } from '../workshops/pages/pageDetails';
import { PageItem } from '../workshops/pages/pageItem';
import { PageModelBinder } from "@paperbits/common/widgets/pageModelBinder";
import { PlaceholderViewModel } from "../editors/placeholder/placeholderViewModel";
import { PageResourcePicker } from "../workshops/pages/pageResourcePicker";
import { PageSelector } from '../workshops/pages/pageSelector';
import { PageService } from '@paperbits/common/pages/pageService';
import { PagesWorkshop } from '../workshops/pages/pages';
import { HyperlinkSelector } from "../workshops/hyperlinks/hyperlinkSelector";
import { PermalinkService } from '@paperbits/common/permalinks/permalinkService';
import { PictureEditor } from '../editors/picture/pictureEditor';
import { PictureHandlers } from '../editors/picture/pictureHandlers';
import { PictureModelBinder } from "@paperbits/common/widgets/pictureModelBinder";
import { RowLayoutSelector } from '../workshops/rows/rowLayoutSelector';
import { RowModelBinder } from "@paperbits/common/widgets/rowModelBinder";
import { SectionEditor } from "../editors/section/sectionEditor";
import { SectionLayoutSelector } from '../workshops/sections/sectionLayoutSelector';
import { SectionModelBinder } from "@paperbits/common/widgets/sectionModelBinder";
import { SettingsProvider } from '@paperbits/common/configuration/settingsProvider';
import { SettingsWorkshop } from '../workshops/settings/settings';
import { SiteService } from '@paperbits/common/sites/siteService';
import { TextblockEditor } from '../editors/textblock/textblockEditor';
import { TextblockHandlers } from '../editors/textblock/textblockHandlers';
import { TextblockModelBinder } from "@paperbits/common/widgets/textblockModelBinder";
import { UrlResourcePicker } from "../workshops/hyperlinks/urlResourcePicker";
import { UrlSelector } from '../workshops/hyperlinks/urlSelector';
import { VideoEditor } from '../editors/video-player/videoEditor';
import { VideoHandlers } from '../editors/video-player/videoHandlers';
import { VideoPlayerModelBinder } from "@paperbits/common/widgets//videoPlayerModelBinder";
import { ViewManager } from '../ui/viewManager';
import { WidgetSelector } from '../workshops/widgets/widgetSelector';
import { WidgetService } from '@paperbits/common/widgets/widgetService';
import { WidgetsWorkshop } from '../workshops/widgets/widgets';
import { Workshops } from '../workshops/workshops';
import { YoutubeHandlers } from '../editors/youtube-player/youtubeHandlers';
import { PermalinkResolver } from "@paperbits/common/permalinks/permalinkResolver";
import { MediaPermalinkResolver } from "@paperbits/common/media/mediaPermalinkResolver";
import { IPermalinkResolver } from "@paperbits/common/permalinks/IPermalinkResolver";
import { PagePermalinkResolver } from "@paperbits/common/pages/pagePermalinkResolver";
import { NewsPermalinkResolver } from "@paperbits/common/news/newsPermalinkResolver";
import { BlogPermalinkResolver } from "@paperbits/common/blogs/blogPermalinkResolver";
import { HtmlEditorProvider, IHtmlEditorProvider } from "@paperbits/common/editing/htmlEditorProvider";
import { BlogResourcePicker } from "../workshops/blogs/blogResourcePicker";
import { NewsResourcePicker } from "../workshops/news/newsResourcePicker";
import { BlogSelector } from "../workshops/blogs/blogSelector";
import { NewsSelector } from "../workshops/news/newsSelector";
import { ViewportSelector } from "../workshops/viewports/viewport-selector";
import { HostBindingHandler } from "../bindingHandlers/bindingHandlers.host";
import { LayoutEditor } from "../editors/layout/layoutEditor";


export class ComponentRegistrationEditors implements IRegistration {
    public register(injector: IInjector) {
        

        /*** Workshops ***/
        injector.bind("workshops", Workshops);
        injector.bind("settingsWorkshop", SettingsWorkshop);
        injector.bind("widgetsWorkshop", WidgetsWorkshop);
        injector.bind("mediaWorkshop", MediaWorkshop);
        injector.bind("layoutsWorkshop", LayoutsWorkshop);
        injector.bind("pagesWorkshop", PagesWorkshop);
        injector.bind("blogWorkshop", BlogWorkshop);
        injector.bind("newsEditor", NewsEditor);
        injector.bind("navigationWorkshop", NavigationWorkshop);

        injector.bind("mediaPermalinkResolver", MediaPermalinkResolver);
        injector.bind("pagePermalinkResolver", PagePermalinkResolver);
        injector.bind("newsPermalinkResolver", NewsPermalinkResolver);
        injector.bind("blogPermalinkResolver", BlogPermalinkResolver);

        injector.bindSingletonFactory("permalinkResolver", (ctx: IInjector) => {
            let permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            let mediaPermalinkResolver = ctx.resolve<IPermalinkResolver>("mediaPermalinkResolver");
            let pagePermalinkResolver = ctx.resolve<IPermalinkResolver>("pagePermalinkResolver");
            let newsPermalinkResolver = ctx.resolve<IPermalinkResolver>("newsPermalinkResolver");
            let blogPermalinkResolver = ctx.resolve<IPermalinkResolver>("blogPermalinkResolver");

            return new PermalinkResolver(permalinkService, [
                mediaPermalinkResolver,
                pagePermalinkResolver,
                newsPermalinkResolver,
                blogPermalinkResolver]);
        });

        injector.bindComponent("navigationDetailsWorkshop", (ctx: IInjector, node) => {
            var navigationService = ctx.resolve<INavigationService>("navigationService");
            var viewManager = ctx.resolve<IViewManager>("viewManager");

            return new NavigationDetailsWorkshop(node, navigationService, viewManager);
        });

        injector.bindComponent("layoutDetailsWorkshop", (ctx: IInjector, layoutReference: LayoutItem) => {
            var layoutService = ctx.resolve<ILayoutService>("layoutService");
            var routeHandler = ctx.resolve<IRouteHandler>("routeHandler");
            var viewManager = ctx.resolve<IViewManager>("viewManager");

            return new LayoutDetailsWorkshop(layoutService, routeHandler, layoutReference, viewManager);
        });

        injector.bindComponent("pageDetailsWorkshop", (ctx: IInjector, pageReference: PageItem) => {
            var pageService = ctx.resolve<IPageService>("pageService");
            var permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            var routeHandler = ctx.resolve<IRouteHandler>("routeHandler");
            var viewManager = ctx.resolve<IViewManager>("viewManager");

            return new PageDetailsWorkshop(pageService, permalinkService, routeHandler, pageReference, viewManager);
        });

        injector.bindComponent("blogPostDetailsWorkshop", (ctx: IInjector, blogPostReference: BlogPostItem) => {
            var blogService = ctx.resolve<IBlogService>("blogService");
            var permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            var routeHandler = ctx.resolve<IRouteHandler>("routeHandler");
            var viewManager = ctx.resolve<IViewManager>("viewManager");

            return new BlogPostDetailsWorkshop(blogService, permalinkService, routeHandler, blogPostReference, viewManager);
        });

        injector.bindComponent("newsElementDetailsEditor", (ctx: IInjector, newsElementReference: NewsArticleItem) => {
            var newsService = ctx.resolve<INewsService>("newsService");
            var permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            var routeHandler = ctx.resolve<IRouteHandler>("routeHandler");
            var viewManager = ctx.resolve<IViewManager>("viewManager");

            return new NewsElementDetailsEditor(newsService, permalinkService, routeHandler, newsElementReference, viewManager);
        });

        injector.bind("dropbucket", DropBucket);
        injector.bind("viewportSelector", ViewportSelector);

        injector.bindSingleton("hostBindingHandler", HostBindingHandler);

        /*** Handlers ***/
        injector.bindSingleton("textblockHandler", TextblockHandlers);
        injector.bindSingleton("mediaHandler", MediaHandlers);
        injector.bindSingleton("pictureDropHandler", PictureHandlers);
        //injector.bindSingleton("codeDropHandler", CodeHandlers);
        injector.bindSingleton("mapDropHandler", MapHandlers);
        injector.bindSingleton("videoDropHandler", VideoHandlers);
        injector.bindSingleton("youtubeDropHandler", YoutubeHandlers);
        injector.bindSingleton("audioDropHandler", AudioHandlers);
        injector.bindSingleton("navbarHandler", NavbarHandlers);
        injector.bindSingleton("buttonHandler", ButtonHandlers);

        injector.bindFactory<Array<IContentDropHandler>>("dropHandlers", (ctx: IInjector) => {
            var dropHandlers = new Array<IContentDropHandler>();

            dropHandlers.push(ctx.resolve<PictureHandlers>("pictureDropHandler"));
            dropHandlers.push(ctx.resolve<MapHandlers>("mapDropHandler"));
            dropHandlers.push(ctx.resolve<VideoHandlers>("videoDropHandler"));
            //dropHandlers.push(ctx.resolve<AudioHandlers>("audioDropHandler"));
            dropHandlers.push(ctx.resolve<YoutubeHandlers>("youtubeDropHandler"));
            //dropHandlers.push(ctx.resolve<CodeHandlers>("codeDropHandler"));

            return dropHandlers;
        });

        injector.bindFactory<Array<IWidgetHandler>>("widgetHandlers", (ctx: IInjector) => {
            var widgetHandlers = new Array<IWidgetHandler>();

            widgetHandlers.push(ctx.resolve<TextblockHandlers>("textblockHandler"));
            widgetHandlers.push(ctx.resolve<PictureHandlers>("pictureDropHandler"));
            // widgetHandlers.push(ctx.resolve<CodeHandlers>("codeDropHandler"));
            widgetHandlers.push(ctx.resolve<MapHandlers>("mapDropHandler"));
            widgetHandlers.push(ctx.resolve<YoutubeHandlers>("youtubeDropHandler"));
            widgetHandlers.push(ctx.resolve<VideoHandlers>("videoDropHandler"));
            // widgetHandlers.push(ctx.resolve<AudioHandlers>("audioDropHandler"));
            widgetHandlers.push(ctx.resolve<NavbarHandlers>("navbarHandler"));
            widgetHandlers.push(ctx.resolve<ButtonHandlers>("buttonHandler"));

            return widgetHandlers;
        });

        injector.bindComponent("layoutSelector", (ctx: IInjector, params: {}) => {
            var layoutService = ctx.resolve<ILayoutService>("layoutService");
            var permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            return new LayoutSelector(layoutService, permalinkService, params["onSelect"]);
        });

        injector.bindComponent("pageSelector", (ctx: IInjector, params: {}) => {
            var pageService = ctx.resolve<IPageService>("pageService");
            var permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            return new PageSelector(pageService, permalinkService, params["onSelect"]);
        });

        injector.bindComponent("blogSelector", (ctx: IInjector, params: {}) => {
            var blogService = ctx.resolve<IBlogService>("blogService");
            var permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            return new BlogSelector(blogService, permalinkService, params["onSelect"]);
        });

        injector.bindComponent("newsSelector", (ctx: IInjector, params: {}) => {
            var newsService = ctx.resolve<INewsService>("newsService");
            var permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            return new NewsSelector(newsService, permalinkService, params["onSelect"]);
        });

        injector.bindComponent("mediaSelector", (ctx: IInjector, params: {}) => {
            var mediaService = ctx.resolve<IMediaService>("mediaService");
            var permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            return new MediaSelector(mediaService, permalinkService, params["onSelect"]);
        });

        injector.bindComponent("colorSelector", (ctx: IInjector, params: {}) => {
            return new ColorSelector(params["selectedColor"], params["setColorCallback"]);
        });

        injector.bindComponent("styleSelector", (ctx: IInjector, params: {}) => {
            return new StyleSelector(params["selectedStyle"], params["setStyleCallback"]);
        });

        injector.bindComponent("hyperlinkSelector", (ctx: IInjector, params: {}) => {
            let permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            let resourcePickers = ctx.resolve<IHyperlinkProvider[]>("resourcePickers");

            return new HyperlinkSelector(permalinkService, resourcePickers, params["hyperlink"], params["onChange"]);
        });

        injector.bindComponent("rowLayoutSelector", (ctx: IInjector, params: {}) => {
            return new RowLayoutSelector(params["onSelect"]);
        });

        injector.bindComponent("sectionLayoutSelector", (ctx: IInjector, params: {}) => {
            return new SectionLayoutSelector(params["onSelect"]);
        });

        injector.bindComponent("widgetSelector", (ctx: IInjector, params: {}) => {
            var widgetService = ctx.resolve<IWidgetService>("widgetService");
            return new WidgetSelector(widgetService, params["onSelect"]);
        });

        injector.bindComponent("urlSelector", (ctx: IInjector, params: {}) => {
            return new UrlSelector(params["onSelect"]);
        });

        injector.bind("pageResourcePicker", PageResourcePicker);
        injector.bind("blogResourcePicker", BlogResourcePicker);
        injector.bind("mediaResourcePicker", MediaResourcePicker);
        injector.bind("urlResourcePicker", UrlResourcePicker);

        injector.bindFactory<IHyperlinkProvider[]>("resourcePickers", (ctx: IInjector) => {
            let pageReourcePicker = ctx.resolve<IHyperlinkProvider>("pageResourcePicker");
            let blogReourcePicker = ctx.resolve<IHyperlinkProvider>("blogResourcePicker");
            let mediaReourcePicker = ctx.resolve<IHyperlinkProvider>("mediaResourcePicker");
            let urlResourcePicker = ctx.resolve<IHyperlinkProvider>("urlResourcePicker");

            return [
                pageReourcePicker,
                blogReourcePicker,
                mediaReourcePicker,
                urlResourcePicker
            ]
        })


        /*** UI ***/
        // injector.bindSingleton("viewManager", ViewManager);
        injector.bindSingleton("dragManager", DragManager);
        injector.bindSingleton("lightbox", LityLightbox);
        injector.bind("placeholderWidget", PlaceholderViewModel);


        /*** Editors ***/
        injector.bindSingleton("htmlEditorProvider", HtmlEditorProvider);
        injector.bindSingleton("formattingTools", FormattingTools);
        injector.bindSingleton("hyperlinkTools", HyperlinkTools);
        injector.bind("layoutEditor", LayoutEditor);
        injector.bind("mapEditor", MapEditor);
        injector.bind("textblockEditor", TextblockEditor)
        injector.bind("audioPlayerEditor", AudioEditor);
        injector.bind("buttonEditor", ButtonEditor);
        injector.bind("pictureEditor", PictureEditor);
        injector.bind("sectionEditor", SectionEditor);
        injector.bind("columnEditor", ColumnEditor);
        injector.bind("navbarEditor", NavbarEditor);
        injector.bind("videoPlayerEditor", VideoEditor);
        injector.bind("codeBlockEditor", CodeEditor);
    }
}
