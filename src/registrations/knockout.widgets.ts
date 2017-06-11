import * as ko from "knockout";
import { IRegistration } from '@paperbits/common/injection/IRegistration';
import { IInjector } from '@paperbits/common/injection/IInjector';
import { DocumentViewModel } from "../widgets/document/documentViewModel";
import { LayoutViewModel } from "../widgets/layout/layoutViewModel";
import { PageViewModel } from "../widgets/page/pageViewModel";
import { PagePlaceholderViewModel } from "../editors/page-placeholder/pagePlaceholderViewModel";
import { MapViewModel } from "../widgets/map/mapViewModel";
import { TextblockViewModel } from "../widgets/textblock/textblockViewModel";
import { AudioPlayerViewModel } from "../widgets/audio-player/audioViewModel";
import { ButtonViewModel } from "../widgets/button/buttonViewModel";
import { PictureViewModel } from "../widgets/picture/pictureViewModel";
import { SectionViewModel } from "../widgets/section/sectionViewModel";
import { RowViewModel } from "../widgets/row/rowViewModel";
import { ColumnViewModel } from "../widgets/column/columnViewModel";
import { NavbarViewModel } from "../widgets/navbar/navbarViewModel";
import { YoutubePlayerViewModel } from "../widgets/youtube-player/youtubePlayerViewModel";
import { VideoPlayerViewModel } from "../widgets/video-player/videoPlayerViewModel";
import { FollowUs } from "../widgets/intercom/followUs";
import { GoogleTagManager } from "../widgets/gtm/gtm";
import { IntercomViewModel } from "../widgets/intercom/intercom";


export class KnockoutRegistrationWidgets implements IRegistration {
    public register(injector: IInjector) {
        injector.bind("docWidget", DocumentViewModel);
        injector.bind("layoutWidget", LayoutViewModel);
        injector.bind("pageWidget", PageViewModel);
        injector.bind("map", MapViewModel);
        injector.bind("textblock", TextblockViewModel);
        injector.bind("audioPlayer", AudioPlayerViewModel);
        injector.bind("button", ButtonViewModel);
        injector.bind("picture", PictureViewModel);
        injector.bind("section", SectionViewModel);
        injector.bind("row", RowViewModel);
        injector.bind("column", ColumnViewModel);
        injector.bind("navbar", NavbarViewModel);
        injector.bind("youtubePlayer", YoutubePlayerViewModel);
        injector.bind("videoPlayer", VideoPlayerViewModel);
        injector.bind("followusBlock", FollowUs);
        injector.bind("gtm", GoogleTagManager);
        injector.bind("intercom", IntercomViewModel);

        // var aceconfig: any = ace;
        // aceconfig.config.set("basePath", "https://cdn.jsdelivr.net/ace/1.2.3/noconflict/");
        // injector.bind("codeBlock", Code);



        ko.components.register("paperbits-doc", {
            viewModel: { injectable: "docWidget" },
            template: { fromUrl: `widgets/document/document.html` },
        });

        ko.components.register("paperbits-layout", {
            viewModel: { injectable: "layoutWidget" },
            template: { fromUrl: `widgets/layout/layout.html` },
        });

        ko.components.register("paperbits-page", {
            viewModel: { injectable: "pageWidget" },
            template: { fromUrl: `widgets/page/page.html` },
        });

        ko.components.register("paperbits-text", {
            template: { fromUrl: `widgets/textblock/textblock.html` },
            viewModel: { injectable: "textblock" },
        });

        ko.components.register("paperbits-gtm", {
            template: { fromUrl: `widgets/gtm/gtm.html` },
            viewModel: { injectable: "gtm" }
        });

        ko.components.register("paperbits-intercom", {
            template: { fromUrl: `widgets/intercom/intercom.html` },
            viewModel: { injectable: "intercom" }
        });

        ko.components.register("paperbits-map", {
            template: { fromUrl: `widgets/map/map.html` },
            viewModel: { injectable: "map" }
        });

        ko.components.register("navbar", {
            template: { fromUrl: `widgets/navbar/navbarTemplate.html` },
            viewModel: { injectable: "navbar" }
        });

        ko.components.register("paperbits-picture", {
            template: { fromUrl: `widgets/picture/picture.html` },
            viewModel: { injectable: "picture" }
        });

        ko.components.register("paperbits-button", {
            template: { fromUrl: `widgets/button/button.html` },
            viewModel: { injectable: "button" }
        })

        ko.components.register("paperbits-audio-player", {
            template: { fromUrl: `widgets/audio-player/audio.html` },
            viewModel: { injectable: "audioPlayer" }
        });

        ko.components.register("paperbits-youtube-player", {
            template: { fromUrl: `widgets/youtube-player/youtube.html` },
            viewModel: { injectable: "youtubePlayer" }
        });

        ko.components.register("layout-section", {
            template: { fromUrl: `widgets/section/section.html` },
            viewModel: { injectable: "section" },
            postprocess: (element: Node, viewModel) => {
                // TODO: Get rid of hack!
                if (element.nodeName == "#comment") {
                    do {
                        element = element.nextSibling;
                    }
                    while (element != null && element.nodeName == "#comment")
                }

                if (!element) {
                    debugger;
                }

                ko.applyBindingsToNode(element, {
                    background: viewModel.background,
                    layoutsection: {},
                    css: viewModel.css,
                    snapTo: viewModel.snapTo
                });
            }
        });

        ko.components.register("layout-row", {
            template: { fromUrl: `widgets/row/row.html` },
            viewModel: { injectable: "row" }
        });

        ko.components.register("layout-column", {
            template: { fromUrl: `widgets/column/column.html` },
            viewModel: { injectable: "column" },
            postprocess: (element: Node, viewModel) => {
                // TODO: Get rid of hack!
                if (element.nodeName == "#comment") {
                    do {
                        element = element.nextSibling;
                    }
                    while (element != null && element.nodeName == "#comment")
                }

                ko.applyBindingsToNode(element, {
                    layoutcolumn: {},
                    css: viewModel.css
                });
            }
        });

        ko.components.register("paperbits-video-player", {
            template: { fromUrl: `widgets/video-player/video.html` },
            viewModel: { injectable: "videoPlayer" }
        });

        ko.components.register("paperbits-code", {
            template: { fromUrl: `widgets/codeblock/code.html` },
            viewModel: { injectable: "codeBlock" }
        });

        ko.components.register("follow-us", {
            template: { fromUrl: `widgets/intercom/followUs.html` },
            viewModel: { injectable: "followusBlock" }
        });
    }
}