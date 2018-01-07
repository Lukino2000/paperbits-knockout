
import * as ko from "knockout";
import * as validation from "knockout.validation";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { ILayoutService } from "@paperbits/common/layouts/ILayoutService";
import { LayoutItem } from "../workshops/layouts/layoutItem";
import { setTimeout } from "timers";

const errorClassName = "is-invalid";

export class KnockoutValidation {
    constructor(
        private readonly permalinkService: IPermalinkService,
        private readonly layoutService: ILayoutService
    ) {
        validation.init({
            errorElementClass: errorClassName,
            decorateInputElement: true,
            insertMessages: false
        }, true);

        ko.extenders["onlyValid"] = function (target, option) {
            const resultObservable: any = ko.observable(target());

            target.subscribe((newValue) => {
                if (target.isValidating && target.isValidating()) {
                    const subscription = target.isValidating.subscribe(v => {
                        subscription.dispose();

                        if (target.isValid()) {
                            resultObservable(newValue);
                        }
                    });
                }
                else {
                    if (target.isValid()) {
                        resultObservable(newValue);
                    }
                }
            });

            return resultObservable;
        };

        validation.rules["uniquePermalink"] = {
            async: true,
            validator: async (permalinkUri: string, permalinkKey: string, callback: (isInUse: boolean) => void) => {
                if (!permalinkUri) {
                    return;
                }

                const permalink = await this.permalinkService.getPermalinkByUrl(permalinkUri);
                const conflict = permalink && permalink.key !== permalinkKey;

                callback(!conflict);
            },
            message: "The permalink is already in use"
        }

        validation.rules["uniqueLayoutUri"] = {
            async: true,
            validator: async (uriTemplate, layoutKey, callback) => {
                if (!uriTemplate) {
                    return;
                }

                const layout = await layoutService.getLayoutByUriTemplate(uriTemplate);
                const conflict = layout && layout.key !== layoutKey;

                callback(!conflict);
            },
            message: "The uri template is already in use"
        };

        validation.registerExtenders();
    }
}



// export class Validators {
//     public static setPermalinkValidatorWithUpdate(permalinkUrl: KnockoutObservable<string>, permalink: IPermalink, permalinkService: IPermalinkService) {
//         const currentValue = permalink.uri;
//         permalinkUrl.extend(Validators.uniquePermalinkExtender(currentValue, permalinkService));
//         permalinkUrl.isValidating.subscribe((isValidating) => Validators.updatePermalink(isValidating, permalinkUrl, permalink, permalinkService));
//         permalinkUrl.subscribe(Validators.permalinkValidationFunction(currentValue, permalinkUrl));
//         permalinkUrl.isValid();
//     }

//     private static uniquePermalinkExtender(skipUri: string, permalinkService: IPermalinkService) {
//         return {
//             required: true,
//             uniquePermalink: { skipUri: skipUri === "/new" ? "" : skipUri, service: permalinkService }
//         };
//     }

//     private static permalinkValidationFunction(currentValue: string, permalinkUrl: KnockoutObservable<string>) {
//         return (newValue) => {
//             if (currentValue !== permalinkUrl()) {
//                 permalinkUrl.isValid();
//             }
//         }
//     }

//     private static async updatePermalink(isValidating, permalinkUrl: KnockoutObservable<string>, permalink: IPermalink, permalinkService: IPermalinkService) {
//         if (!isValidating && permalinkUrl.isValid()) {
//             permalink.uri = permalinkUrl();
//             await permalinkService.updatePermalink(permalink);
//         }
//     }

//     public static initLayoutValidation(): void {
//         validation.init({
//             errorElementClass: errorClassName,
//             decorateInputElement: true,
//             insertMessages: false
//         }, true);

//         validation.rules["uniqueLayoutUri"] = {
//             async: true,
//             validator: async (uriTemplate, validatorParam, callback) => {
//                 if (uriTemplate !== validatorParam.skipUri) {
//                     let layoutService: ILayoutService = validatorParam.service;
//                     let layout = await layoutService.getLayoutByUriTemplate(uriTemplate);

//                     callback(!layout);
//                 } else {
//                     callback(true);
//                 }
//             },
//             message: "The uri template is already in use"
//         };

//         validation.registerExtenders();
//     }

//     public static setLayoutValidatorWithUpdate(uriTemplate: KnockoutObservable<string>, layout: LayoutItem, layoutService: ILayoutService) {
//         let currentValue = layout.uriTemplate();
//         uriTemplate.extend(Validators.uniqueLayoutExtender(currentValue, layoutService));
//         uriTemplate.isValidating.subscribe((isValidating) => Validators.updateLayout(isValidating, uriTemplate, layout, layoutService));
//         uriTemplate.subscribe(Validators.layoutValidationFunction(currentValue, uriTemplate));
//         uriTemplate.isValid();
//     }

//     private static uniqueLayoutExtender(skipUri: string, layoutService: ILayoutService) {
//         return {
//             required: true,
//             uniqueLayoutUri: { skipUri: skipUri === LayoutItem.newLayoutUri ? "" : skipUri, service: layoutService }
//         };
//     }

//     private static layoutValidationFunction(currentValue: string, uriTemplate: KnockoutObservable<string>) {
//         return (newValue) => {
//             if (currentValue !== uriTemplate()) {
//                 uriTemplate.isValid();
//             }
//         }
//     }

//     private static async updateLayout(isValidating, uriTemplate: KnockoutObservable<string>, layout: LayoutItem, layoutService: ILayoutService) {
//         if (!isValidating && uriTemplate.isValid()) {
//             await layoutService.updateLayout(layout.toLayout());
//         }
//     }
// }