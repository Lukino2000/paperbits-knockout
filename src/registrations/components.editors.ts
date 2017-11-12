import { IBlogService } from "@paperbits/common/blogs/IBlogService";
import { IContentDropHandler } from '@paperbits/common/editing/IContentDropHandler';
import { IHyperlinkProvider } from "@paperbits/common/ui/IHyperlinkProvider";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { ILayoutService } from "@paperbits/common/layouts/ILayoutService";
import { IMediaService } from '@paperbits/common/media/IMediaService';
import { INavigationService } from '@paperbits/common/navigation/INavigationService';
import { IPageService } from '@paperbits/common/pages/IPageService';
import { IPermalinkService } from '@paperbits/common/permalinks/IPermalinkService';
import { IRouteHandler } from '@paperbits/common/routing/IRouteHandler';
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { IWidgetHandler } from '@paperbits/common/editing/IWidgetHandler';
import { IWidgetService } from "@paperbits/common/widgets/IWidgetService";
import { AudioEditor } from '../editors/audio-player/audioEditor';
import { AudioHandlers } from '../editors/audio-player/audioHandlers';
import { BlogPostDetailsWorkshop } from "../workshops/blogs/blogPostDetails";
import { BlogPostItem } from "../workshops/blogs/blogPostItem";
import { BlogWorkshop } from '../workshops/blogs/blogs';
import { ButtonEditor } from "../editors/button/buttonEditor";
import { ButtonHandlers } from "../editors/button/buttonHandlers";
import { Code } from '../widgets/codeblock/code';
import { CodeblockModelBinder } from "@paperbits/common/widgets/codeblock/codeblockModelBinder";
import { CodeEditor } from '../editors/codeblock/codeEditor';
import { ColorSelector } from '../workshops/colors/colorSelector';
import { StyleSelector } from '../workshops/text/styleSelector';
import { ColumnEditor } from "../editors/column/columnEditor";
import { DragManager } from '@paperbits/common/ui/draggables/dragManager';
import { DropBucket } from '../workshops/dropbucket/dropbucket';
import { FormattingTools } from '../editors/textblock/formatting/formattingTools';
import { HyperlinkTools } from '../editors/textblock/hyperlink/hyperlinkTools';
import { LayoutDetailsWorkshop } from "../workshops/layouts/layoutDetailsWorkshop";
import { LayoutItem } from "../workshops/layouts/layoutItem";
import { LayoutSelector } from "../workshops/layouts/layoutSelector";
import { LayoutsWorkshop } from "../workshops/layouts/layoutsWorkshop";
import { LityLightbox } from '@paperbits/common/ui/lityLightbox';
import { MapEditor } from '../editors/map/mapEditor';
import { MapHandlers } from '../editors/map/mapHandlers';
import { MediaDetailsWorkshop } from '../workshops/media/mediaDetails';
import { MediaItem } from '../workshops/media/mediaItem';
import { MediaHandlers } from '../editors/mediaHandlers';
import { MediaResourcePicker } from "../workshops/media/mediaResourcePicker";
import { MediaSelector } from '../workshops/media/mediaSelector';
import { MediaWorkshop } from '../workshops/media/media';
import { NavbarEditor } from "../editors/navbar/navbarEditor";
import { NavbarHandlers } from "../editors/navbar/navbarHandlers";
import { NavigationDetailsWorkshop } from '../workshops/navigation/navigationDetails';
import { NavigationWorkshop } from '../workshops/navigation/navigation';
import { PageDetailsWorkshop } from '../workshops/pages/pageDetails';
import { PageItem } from '../workshops/pages/pageItem';
import { PlaceholderViewModel } from "../editors/placeholder/placeholderViewModel";
import { PageResourcePicker } from "../workshops/pages/pageResourcePicker";
import { PageSelector } from '../workshops/pages/pageSelector';
import { PagesWorkshop } from '../workshops/pages/pages';
import { HyperlinkSelector } from "../workshops/hyperlinks/hyperlinkSelector";
import { PictureEditor } from '../editors/picture/pictureEditor';
import { PictureHandlers } from '../editors/picture/pictureHandlers';
import { RowLayoutSelector } from '../workshops/rows/rowLayoutSelector';
import { SectionEditor } from "../editors/section/sectionEditor";
import { SectionLayoutSelector } from '../workshops/sections/sectionLayoutSelector';
import { SettingsWorkshop } from '../workshops/settings/settings';
import { TextblockEditor } from '../editors/textblock/textblockEditor';
import { TextblockHandlers } from '../editors/textblock/textblockHandlers';
import { UrlResourcePicker } from "../workshops/hyperlinks/urlResourcePicker";
import { UrlSelector } from '../workshops/hyperlinks/urlSelector';
import { VideoEditor } from '../editors/video-player/videoEditor';
import { VideoHandlers } from '../editors/video-player/videoHandlers';
import { WidgetSelector } from '../workshops/widgets/widgetSelector';
import { WidgetsWorkshop } from '../workshops/widgets/widgets';
import { Workshops } from '../workshops/workshops';
import { YoutubeHandlers } from '../editors/youtube-player/youtubeHandlers';
import { PermalinkResolver } from "@paperbits/common/permalinks/permalinkResolver";
import { MediaPermalinkResolver } from "@paperbits/common/media/mediaPermalinkResolver";
import { IPermalinkResolver } from "@paperbits/common/permalinks/IPermalinkResolver";
import { PagePermalinkResolver } from "@paperbits/common/pages/pagePermalinkResolver";
import { BlogPermalinkResolver } from "@paperbits/common/blogs/blogPermalinkResolver";
import { HtmlEditorProvider } from "@paperbits/common/editing/htmlEditorProvider";
import { BlogResourcePicker } from "../workshops/blogs/blogResourcePicker";
import { BlogSelector } from "../workshops/blogs/blogSelector";
import { ViewportSelector } from "../workshops/viewports/viewport-selector";
import { HostBindingHandler } from "../bindingHandlers/bindingHandlers.host";
import { IntentionMapService } from "@paperbits/slate/intentionMapService";
import { SliderEditor } from "../editors/slider/sliderEditor";
import { SliderHandlers } from "../editors/slider/sliderHandlers";


export class ComponentRegistrationEditors implements IInjectorModule {
    public register(injector: IInjector) {

        /*** Workshops ***/
        injector.bind("workshops", Workshops);
        injector.bind("settingsWorkshop", SettingsWorkshop);
        injector.bind("widgetsWorkshop", WidgetsWorkshop);
        injector.bind("mediaWorkshop", MediaWorkshop);
        injector.bind("layoutsWorkshop", LayoutsWorkshop);
        injector.bind("pagesWorkshop", PagesWorkshop);
        injector.bind("blogWorkshop", BlogWorkshop);
        injector.bind("navigationWorkshop", NavigationWorkshop);

        injector.bind("mediaPermalinkResolver", MediaPermalinkResolver);
        injector.bind("pagePermalinkResolver", PagePermalinkResolver);
        injector.bind("blogPermalinkResolver", BlogPermalinkResolver);

        injector.bindSingletonFactory("permalinkResolver", (ctx: IInjector) => {
            let permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            let mediaPermalinkResolver = ctx.resolve<IPermalinkResolver>("mediaPermalinkResolver");
            let pagePermalinkResolver = ctx.resolve<IPermalinkResolver>("pagePermalinkResolver");
            let blogPermalinkResolver = ctx.resolve<IPermalinkResolver>("blogPermalinkResolver");

            return new PermalinkResolver(permalinkService, [
                mediaPermalinkResolver,
                pagePermalinkResolver,
                blogPermalinkResolver]);
        });

        injector.bindComponent("navigationDetailsWorkshop", (ctx: IInjector, node) => {
            var navigationService = ctx.resolve<INavigationService>("navigationService");
            var viewManager = ctx.resolve<IViewManager>("viewManager");

            return new NavigationDetailsWorkshop(node, navigationService, viewManager);
        });

        injector.bindComponent("mediaDetailsWorkshop", (ctx: IInjector, mediaReference: MediaItem) => {
            var mediaService = ctx.resolve<IMediaService>("mediaService");
            var permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            var viewManager = ctx.resolve<IViewManager>("viewManager");

            return new MediaDetailsWorkshop(mediaService, permalinkService, mediaReference, viewManager);
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
        injector.bindSingleton("sliderHandler", SliderHandlers);

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
            // widgetHandlers.push(ctx.resolve<SliderHandlers>("sliderHandler"));

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

        injector.bindComponent("mediaSelector", (ctx: IInjector, params: {}) => {
            var mediaService = ctx.resolve<IMediaService>("mediaService");
            var permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            var viewManager = ctx.resolve<IViewManager>("viewManager");
            return new MediaSelector(mediaService, permalinkService, viewManager, params["onSelect"], params["mediaFilter"]);
        });

        injector.bindComponent("colorSelector", (ctx: IInjector, params: {}) => {
            let intentionMapService = ctx.resolve<IntentionMapService>("intentionMapService");
            return new ColorSelector(params["onSelect"], params["selectedColor"], intentionMapService);
        });

        injector.bindComponent("styleSelector", (ctx: IInjector, params: {}) => {
            let intentionMapService = ctx.resolve<IntentionMapService>("intentionMapService");
            return new StyleSelector(params["selectedStyle"], params["setStyleCallback"], intentionMapService);
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
        injector.bind("sliderEditor", SliderEditor);
    }
}
