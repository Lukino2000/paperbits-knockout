import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";


export class ViewModelBinderSelector {
    private readonly viewModelBinders: Array<IViewModelBinder<any, any>>;

    constructor(modelBinders: Array<IViewModelBinder<any, any>>) {
        this.viewModelBinders = modelBinders;
    }

    public getViewModelBinderByModel<TModel>(model: TModel): IViewModelBinder<any, any> {
        let viewModelBinder = this.viewModelBinders.find(x => x.canHandleModel(model));

        if (!viewModelBinder) {
            //throw `Could not find view model binder for model.`;
            console.warn(`Could not find view model binder for model.`);
            console.log(model);
        }

        return viewModelBinder;
    }
}