import { IBlogService } from "@paperbits/common/blogs/IBlogService";
import { IContentDropHandler } from '@paperbits/common/editing/IContentDropHandler';
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { ILayoutService } from "@paperbits/common/layouts/ILayoutService";
import { IMediaService } from '@paperbits/common/media/IMediaService';
import { INavigationService } from '@paperbits/common/navigation/INavigationService';
import { IPageService } from '@paperbits/common/pages/IPageService';
import { IUrlService } from "@paperbits/common/urls/IUrlService";
import { IPermalinkService } from '@paperbits/common/permalinks/IPermalinkService';
import { IRouteHandler } from '@paperbits/common/routing/IRouteHandler';
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { IWidgetHandler } from '@paperbits/common/editing/IWidgetHandler';
import { IWidgetService } from "@paperbits/common/widgets/IWidgetService";
import { IBlockService } from "@paperbits/common/blocks/IBlockService";
import { IEventManager } from "@paperbits/common/events/IEventManager";
import { PermalinkResolver } from "@paperbits/common/permalinks/permalinkResolver";
import { MediaPermalinkResolver } from "@paperbits/common/media/mediaPermalinkResolver";
import { IPermalinkResolver } from "@paperbits/common/permalinks/IPermalinkResolver";
import { PagePermalinkResolver } from "@paperbits/common/pages/pagePermalinkResolver";
import { BlogPermalinkResolver } from "@paperbits/common/blogs/blogPermalinkResolver";
import { HtmlEditorProvider } from "@paperbits/common/editing/htmlEditorProvider";
import { IHyperlinkProvider } from "@paperbits/common/ui/IHyperlinkProvider";
import { PageHyperlinkProvider } from "@paperbits/common/pages/pageHyperlinkProvider";
import { BlogHyperlinkProvider } from "@paperbits/common/blogs/blogHyperlinkProvider";
import { MediaHyperlinkProvider } from "@paperbits/common/media/mediaHyperlinkProvider";
import { UrlHyperlinkProvider } from "@paperbits/common/urls/urlHyperlinkProvider";
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
import { ColumnEditor } from "../editors/column/columnEditor";
import { DragManager } from '@paperbits/common/ui/draggables/dragManager';
import { DropBucket } from '../workshops/dropbucket/dropbucket';
import { FormattingTools } from '../editors/textblock/formatting/formattingTools';
import { HyperlinkTools } from '../editors/textblock/hyperlink/hyperlinkTools';
import { LayoutDetails } from "../workshops/layouts/layoutDetails";
import { LayoutItem } from "../workshops/layouts/layoutItem";
import { LayoutSelector } from "../workshops/layouts/layoutSelector";
import { LayoutsWorkshop } from "../workshops/layouts/layouts";
import { LityLightbox } from '@paperbits/common/ui/lityLightbox';
import { MapEditor } from '../editors/map/mapEditor';
import { MapHandlers } from '../editors/map/mapHandlers';
import { MediaDetailsWorkshop } from '../workshops/media/mediaDetails';
import { MediaItem } from '../workshops/media/mediaItem';
import { MediaHandlers } from '../editors/mediaHandlers';
import { MediaSelector } from '../workshops/media/mediaSelector';
import { MediaWorkshop } from '../workshops/media/media';
import { NavbarEditor } from "../editors/navbar/navbarEditor";
import { NavbarHandlers } from "../editors/navbar/navbarHandlers";
import { NavigationDetailsWorkshop } from '../workshops/navigation/navigationDetails';
import { NavigationWorkshop } from '../workshops/navigation/navigation';
import { PageDetailsWorkshop } from '../workshops/pages/pageDetails';
import { PageItem } from '../workshops/pages/pageItem';
import { PlaceholderViewModel } from "../editors/placeholder/placeholderViewModel";
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
import { UrlSelector } from '../workshops/urls/urlSelector';
import { VideoEditor } from '../editors/video-player/videoEditor';
import { VideoHandlers } from '../editors/video-player/videoHandlers';
import { WidgetSelector } from '../workshops/widgets/widgetSelector';
import { Workshops } from '../workshops/workshops';
import { YoutubeHandlers } from '../editors/youtube-player/youtubeHandlers';
import { BlogSelector } from "../workshops/blogs/blogSelector";
import { ViewportSelector } from "../workshops/viewports/viewport-selector";
import { BlockSelector } from "../workshops/blocks/blockSelector";
import { HostBindingHandler } from "../bindingHandlers/bindingHandlers.host";
import { IAppIntentionsProvider } from "../application/interface";
import { SliderEditor } from "../editors/slider/sliderEditor";
import { SliderHandlers } from "../editors/slider/sliderHandlers";
import { ModelBinderSelector } from "@paperbits/common/widgets/modelBinderSelector";
import { IntentionSelector } from "../editors/textblock/formatting/intentionSelector";
import { SectionModel } from "@paperbits/common/widgets/section/sectionModel";
import { AddBlockDialog } from "../workshops/blocks/addBlockDialog";
import { SectionModelBinder } from "@paperbits/common/widgets/section/sectionModelBinder";
import { FormHandlers } from "../editors/form/formHandlers";
import { FormEditor } from "../editors/form/formEditor";
import { TestimonialsHandlers } from "../editors/testimonials/testimonialsHandlers";
import { TestimonialsEditor } from "../editors/testimonials/testimonialsEditor";
import { ContentTableHandlers } from "../editors/content-table/contentTableHandlers";


export class ComponentRegistrationEditors implements IInjectorModule {
    public register(injector: IInjector) {

        /*** Workshops ***/
        injector.bind("workshops", Workshops);
        injector.bind("settingsWorkshop", SettingsWorkshop);
        injector.bind("mediaWorkshop", MediaWorkshop);
        injector.bind("layoutsWorkshop", LayoutsWorkshop);
        injector.bind("pagesWorkshop", PagesWorkshop);
        injector.bind("blogWorkshop", BlogWorkshop);
        injector.bind("navigationWorkshop", NavigationWorkshop);

        injector.bindComponent("navigationDetailsWorkshop", (ctx: IInjector, params) => {
            var navigationService = ctx.resolve<INavigationService>("navigationService");
            var viewManager = ctx.resolve<IViewManager>("viewManager");

            return new NavigationDetailsWorkshop(navigationService, viewManager, params);
        });

        injector.bindComponent("mediaDetailsWorkshop", (ctx: IInjector, params) => {
            var mediaService = ctx.resolve<IMediaService>("mediaService");
            var permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            var viewManager = ctx.resolve<IViewManager>("viewManager");

            return new MediaDetailsWorkshop(mediaService, permalinkService, viewManager, params);
        });

        injector.bindComponent("layoutDetails", (ctx: IInjector, params) => {
            const layoutService = ctx.resolve<ILayoutService>("layoutService");
            const routeHandler = ctx.resolve<IRouteHandler>("routeHandler");
            const viewManager = ctx.resolve<IViewManager>("viewManager");

            return new LayoutDetails(layoutService, routeHandler, viewManager, params);
        });

        injector.bindComponent("pageDetailsWorkshop", (ctx: IInjector, params) => {
            const pageService = ctx.resolve<IPageService>("pageService");
            const permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            const routeHandler = ctx.resolve<IRouteHandler>("routeHandler");
            const viewManager = ctx.resolve<IViewManager>("viewManager");

            return new PageDetailsWorkshop(pageService, permalinkService, routeHandler, viewManager, params);
        });

        injector.bindComponent("blogPostDetailsWorkshop", (ctx: IInjector, params) => {
            const blogService = ctx.resolve<IBlogService>("blogService");
            const permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            const routeHandler = ctx.resolve<IRouteHandler>("routeHandler");
            const viewManager = ctx.resolve<IViewManager>("viewManager");

            return new BlogPostDetailsWorkshop(blogService, permalinkService, routeHandler, viewManager, params);
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
        injector.bindSingleton("formHandler", FormHandlers);
        injector.bindSingleton("testimonialsHandler", TestimonialsHandlers);
        injector.bindSingleton("contentTableHandlers", ContentTableHandlers);

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
            widgetHandlers.push(ctx.resolve<FormHandlers>("formHandler"));
            widgetHandlers.push(ctx.resolve<TestimonialsHandlers>("testimonialsHandler"));
            // widgetHandlers.push(ctx.resolve<SliderHandlers>("sliderHandler"));
            widgetHandlers.push(ctx.resolve<ContentTableHandlers>("contentTableHandlers"));

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
            const eventManager = ctx.resolve<IEventManager>("eventManager");
            var mediaService = ctx.resolve<IMediaService>("mediaService");
            var permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            var viewManager = ctx.resolve<IViewManager>("viewManager");
            return new MediaSelector(eventManager, mediaService, permalinkService, viewManager, params["onSelect"], params["mediaFilter"]);
        });

        injector.bindComponent("colorSelector", (ctx: IInjector, params: {}) => {
            let intentionsProvider = ctx.resolve<IAppIntentionsProvider>("intentionsProvider");
            return new ColorSelector(params["onSelect"], params["selectedColor"], intentionsProvider);
        });

        injector.bindComponent("intentionSelector", (ctx: IInjector, params: {}) => {
            let intentionsProvider = ctx.resolve<IAppIntentionsProvider>("intentionsProvider");
            return new IntentionSelector(params["title"], params["intentions"], params["selectedIntention"], params["setIntentionSelectorCallback"], intentionsProvider);
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
            const modelBinderSelector = ctx.resolve<ModelBinderSelector>("modelBinderSelector");
            return new SectionLayoutSelector(params["onSelect"], modelBinderSelector);
        });

        injector.bindComponent("widgetSelector", (ctx: IInjector, params: {}) => {
            var widgetService = ctx.resolve<IWidgetService>("widgetService");
            return new WidgetSelector(widgetService, params["onSelect"]);
        });

        injector.bindComponent("urlSelector", (ctx: IInjector, params: {}) => {
            const urlService = ctx.resolve<IUrlService>("urlService");
            const permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            return new UrlSelector(urlService, permalinkService, params["onSelect"]);
        });

        injector.bindComponent("blockSelector", (ctx: IInjector, params: {}) => {
            const blockService = ctx.resolve<IBlockService>("blockService");

            return new BlockSelector(blockService, params["onSelect"]);
        });

        injector.bindComponent("addBlockDialog", (ctx: IInjector, sectionModel: SectionModel) => {
            const viewManager = ctx.resolve<IViewManager>("viewManager");
            const blockService = ctx.resolve<IBlockService>("blockService");
            const sectionModelBinder = ctx.resolve<SectionModelBinder>("sectionModelBinder");

            return new AddBlockDialog(viewManager, blockService, sectionModelBinder, sectionModel);
        });

        injector.bind("pageHyperlinkProvider", PageHyperlinkProvider);
        injector.bind("blogHyperlinkProvider", BlogHyperlinkProvider);
        injector.bind("mediaHyperlinkProvider", MediaHyperlinkProvider);
        injector.bind("urlHyperlinkProvider", UrlHyperlinkProvider);

        injector.bindFactory<IHyperlinkProvider[]>("resourcePickers", (ctx: IInjector) => {
            let pageReourcePicker = ctx.resolve<IHyperlinkProvider>("pageHyperlinkProvider");
            let blogReourcePicker = ctx.resolve<IHyperlinkProvider>("blogHyperlinkProvider");
            let mediaReourcePicker = ctx.resolve<IHyperlinkProvider>("mediaHyperlinkProvider");
            let urlHyperlinkProvider = ctx.resolve<IHyperlinkProvider>("urlHyperlinkProvider");

            return [
                pageReourcePicker,
                blogReourcePicker,
                mediaReourcePicker,
                urlHyperlinkProvider
            ]
        })


        /*** UI ***/
        // injector.bindSingleton("viewManager", ViewManager);
        injector.bindSingleton("dragManager", DragManager);
        injector.bindSingleton("lightbox", LityLightbox);
        injector.bind("placeholderWidget", PlaceholderViewModel);


        /*** Editors ***/
        injector.bindSingleton("htmlEditorProvider", HtmlEditorProvider);
        injector.bind("formattingTools", FormattingTools);
        injector.bind("hyperlinkTools", HyperlinkTools);
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
        injector.bind("formEditor", FormEditor);
        injector.bind("testimonialsEditor", TestimonialsEditor);
    }
}
