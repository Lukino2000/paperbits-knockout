import * as ko from "knockout";

export function PromiseToDelayedComputed<T>(promiseFactory: () => Promise<T>, initialValue: T): KnockoutComputed<T> {
    var observable = ko.observable(initialValue);

    var scheduled = true; // Avoiding task invocation during dependency detection
    var result = ko.pureComputed({
        read: () => {
            if (!scheduled) {
                promiseFactory().then(observable);
                scheduled = true;
            }
            return observable();
        }
    });
    scheduled = false;
    
    return result;
}