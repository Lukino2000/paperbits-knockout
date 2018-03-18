import * as ko from "knockout";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { DocumentViewModel } from "../widgets/document/documentViewModel";
import { LayoutViewModel } from "../widgets/layout/layoutViewModel";
import { PageViewModel } from "../widgets/page/pageViewModel";
import { PlaceholderViewModel } from "../editors/placeholder/placeholderViewModel";
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
import { GoogleTagManager } from "../widgets/gtm/gtm";
import { IntercomViewModel } from "../widgets/intercom/intercomViewModel";


export class KnockoutRegistrationWidgets implements IInjectorModule {
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
        injector.bind("gtm", GoogleTagManager);
        injector.bind("intercom", IntercomViewModel);
    }
}