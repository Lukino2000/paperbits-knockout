
import * as validation from "knockout.validation";
import { IPermalinkService } from "../../../paperbits-common/src/permalinks/IPermalinkService";
import { IPermalink } from "../../../paperbits-common/src/permalinks/IPermalink";

export class Validators {
    static initValidation() {
        validation.init( { 
            errorElementClass: 'has-error',
            decorateInputElement : true,
        }, true);
        validation.rules['uniquePermalink'] = {
            async: true,
            validator: async (permalinkUri, validatorParam, callback) => {
                if (permalinkUri !== validatorParam.skipUri) {
                    let permalinkService:IPermalinkService = validatorParam.service;
                    let permalink = await permalinkService.getPermalinkByUrl(permalinkUri);
                    callback(!permalink);
                } else {
                    callback(true);
                }
            },
            message: 'The permalink already in use'
        };
        validation.registerExtenders(); 
    }

    static uniquePermalinkExtender(skipUri: string, permalinkService:IPermalinkService){
        return {
            required: true,
            uniquePermalink: {skipUri: skipUri, service: permalinkService}
        };
    }

    static permalinkValidationFunction(permalink:IPermalink, permalinkUrl:KnockoutObservable<string>) {
        return (newValue) => {
            if(permalink.uri !== permalinkUrl()){
                permalinkUrl.isValid();
            }
        }
    }

    static setPermalinkValidatorWithUpdate(permalinkUrl:KnockoutObservable<string>, permalink:IPermalink, permalinkService:IPermalinkService) {
        permalinkUrl.extend(Validators.uniquePermalinkExtender(permalink.uri, permalinkService));
        permalinkUrl.isValidating.subscribe((isValidating) => Validators.updatePermalink(isValidating, permalinkUrl, permalink, permalinkService));
        permalinkUrl.subscribe(Validators.permalinkValidationFunction(permalink, permalinkUrl));
    }

    private static async updatePermalink(isValidating, permalinkUrl:KnockoutObservable<string>, permalink:IPermalink, permalinkService:IPermalinkService) {        
        if(!isValidating && permalinkUrl.isValid()) {
            permalink.uri = permalinkUrl();
            await permalinkService.updatePermalink(permalink);
        }  
    }
}