import * as ko from "knockout";
import { DragManager } from '@paperbits/common/ui/draggables/dragManager';
import { IDragSourceConfig } from '@paperbits/common/ui/draggables/IDragSourceConfig';
import { IDragTargetConfig } from '@paperbits/common/ui/draggables/IDragTargetConfig';


export class DraggablesBindingHandler {
    public constructor(dragManager: DragManager) {

        ko.bindingHandlers["dragsource"] = {
            init(element: HTMLElement, valueAccessor: () => IDragSourceConfig) {
                var config = valueAccessor();
                dragManager.registerDragSource(element, config);
            }
        };

        ko.bindingHandlers["dragtarget"] = {
            init(element: HTMLElement, valueAccessor: () => IDragTargetConfig) {
                var config = valueAccessor();
                dragManager.registerDragTarget(element, config);
            }
        };

    }
}