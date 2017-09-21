import { inject } from "inversify";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { SitePublisher } from "./publisher";
import { PagePublisher } from "./pagePublisher";
import { BlogPublisher } from "./blogPublisher";
import { MediaPublisher } from "./mediaPublisher";


export class PublishingModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindSingleton("sitePublisher", SitePublisher);
        injector.bindSingleton("pagePublisher", PagePublisher);
        injector.bindSingleton("blogPublisher", BlogPublisher);
        injector.bindSingleton("mediaPublisher", MediaPublisher);

        let pagePublisher = injector.resolve("pagePublisher");
        let mediaPublisher = injector.resolve("mediaPublisher");
        let assetPublisher = injector.resolve("assetPublisher");
        let blogPublisher = injector.resolve("blogPublisher");

        injector.bindInstance("publishers", [
            assetPublisher,
            mediaPublisher
        ]);
        injector.bindInstance("publishersInSequence", [
            pagePublisher,
            blogPublisher
        ]);
    }
}