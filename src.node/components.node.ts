import * as path from "path";
import { StaticSettingsProvider } from "./staticSettingsProvider";
import { IBlobStorage } from "@paperbits/common/persistence/IBlobStorage";
import { FileSystemBlobStorage } from "./filesystemBlobStorage";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { AssetPublisher } from "@paperbits/common/publishing/assetPublisher";
import { StaticRouteHandler } from "./routeHandler";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { PermalinkResolver } from "@paperbits/common/permalinks/permalinkResolver";


export class ComponentRegistrationNode implements IInjectorModule {
    private inputBasePath: string;
    private outputBasePath: string;

    constructor(inputBasePath: string, outputBasePath: string) {
        this.inputBasePath = inputBasePath;
        this.outputBasePath = outputBasePath;
    }

    public register(injector: IInjector) {
        /* Publishing specific registrations */
        injector.bindSingleton("routeHandler", StaticRouteHandler);

        injector.bindSingletonFactory("permalinkResolver", (ctx: IInjector) => {
            let permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            return new PermalinkResolver(permalinkService, []);
        });

        injector.bindInstance("inputBlobStorage", new FileSystemBlobStorage(path.resolve(this.inputBasePath)));
        injector.bindInstance("outputBlobStorage", new FileSystemBlobStorage(path.resolve(this.outputBasePath)));

        var inputBlobStorage = injector.resolve<IBlobStorage>("inputBlobStorage");
        var outputBlobStorage = injector.resolve<IBlobStorage>("outputBlobStorage");

        injector.bindInstance("assetPublisher", new AssetPublisher(inputBlobStorage, outputBlobStorage, "assets"));
    }
}