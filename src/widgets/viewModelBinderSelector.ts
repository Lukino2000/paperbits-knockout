import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";


export class ViewModelBinderSelector {
    private readonly viewModelBinders: Array<IViewModelBinder>;

    constructor(modelBinders: Array<IViewModelBinder>) {
        this.viewModelBinders = modelBinders;
    }

    public getViewModelBinderByModel(model): IViewModelBinder {
        let viewModelBinder = this.viewModelBinders.find(x => x.canHandleModel(model));

        if (!viewModelBinder) {
            //throw `Could not find view model binder for model.`;
            console.warn(`Could not find view model binder for model.`);
            console.log(model);
        }

        return viewModelBinder;
    }
}