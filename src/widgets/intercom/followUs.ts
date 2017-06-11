import * as ko from "knockout";
import { IIntercomService } from '@paperbits/common/intercom/IIntercomService';
import { IIntercomLead } from '@paperbits/common/intercom/IIntercomLead';
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import * as _ from 'lodash';

const subscribedKey = "subscribedTime";

export class FollowUs {
    private readonly viewManager: IViewManager;
    private readonly intercomService: IIntercomService;
    
    public isNotSubscribed: KnockoutObservable<boolean>;
    public name: KnockoutObservable<string>;
    public email: KnockoutObservable<string>;

    constructor(intercomService: IIntercomService, viewManager: IViewManager) {
        this.intercomService = intercomService;
        this.viewManager = viewManager;

        this.name = ko.observable<string>();
        this.email = ko.observable<string>();
        let subscribedTime = this.getCookieValue(subscribedKey);

        this.isNotSubscribed = ko.observable<boolean>(!subscribedTime);
    }

    public follow(): void {
        var lead: IIntercomLead = {
            name: this.email(),
            email: this.email(),
            user_id: this.email(),
            created_at: (new Date).getTime()
        };
        this.intercomService.update(lead);
        dataLayer.push({
            'event': 'Convertion.Newsletter'
        });
        this.setCookie(subscribedKey, lead.created_at.toString());
        this.isNotSubscribed(false);

        this.viewManager.addProgressIndicator("Newsletter", "Thank you! We'll be in touch.", 100);
    }

    private getCookieValue(cookieName): any {
        var ca = document.cookie.split('; ');
        return _.find(ca, (cookie) => {
            return cookie.indexOf(cookieName) === 0;
        });
    }

    private setCookie(variable, value): void {
        var date = new Date();
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
        document.cookie = variable + '=' + value + '; expires=' + date.toUTCString() + ';';
    }
}