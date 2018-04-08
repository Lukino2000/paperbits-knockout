import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import { NavigationItemContract } from "@paperbits/common/navigation/NavigationItemContract";
import { NavigationItemViewModel } from "../../workshops/navigation/navigationItemViewModel";

export class NavigationTree {
    private placeholderElement: HTMLElement;

    public nodes: KnockoutObservableArray<NavigationItemViewModel>;
    public selectedNode: KnockoutObservable<NavigationItemViewModel>;
    public focusedNode: KnockoutObservable<NavigationItemViewModel>;
    public onUpdate: KnockoutSubscribable<Array<NavigationItemContract>>;

    constructor(items: Array<NavigationItemContract>) {
        this.onFocusChange = this.onFocusChange.bind(this);
        this.addNode = this.addNode.bind(this);
        this.onNodeDragStart = this.onNodeDragStart.bind(this);
        this.onNodeDragEnd = this.onNodeDragEnd.bind(this);
        this.onNullPointerMove = this.onNullPointerMove.bind(this);
        this.onAcceptNodeBefore = this.onAcceptNodeBefore.bind(this);
        this.onAcceptNodeAfter = this.onAcceptNodeAfter.bind(this);
        this.dispatchUpdates = this.dispatchUpdates.bind(this);

        var nodes = new Array<NavigationItemViewModel>();
        items.forEach(x => nodes.push(this.navigationItemToNode(x)));

        this.nodes = ko.observableArray<NavigationItemViewModel>(nodes);
        this.selectedNode = ko.observable<NavigationItemViewModel>();
        this.focusedNode = ko.observable<NavigationItemViewModel>();
        this.onUpdate = new ko.subscribable<Array<NavigationItemContract>>();

        this.placeholderElement = document.createElement("div");
        this.placeholderElement.className = "placeholder";
        this.placeholderElement.onmousemove = this.onNullPointerMove;
    }

    private onNullPointerMove(event: MouseEvent): void {
        event.stopPropagation();
    }

    private onFocusChange(node: NavigationItemViewModel): void {
        this.focusedNode(node);
    }

    private dispatchUpdates() {
        var items = new Array<NavigationItemContract>();
        this.nodes().forEach(n => items.push(this.nodeToNavigationItem(n)));
        this.onUpdate.notifySubscribers(items);
    }

    private navigationItemToNode(navItem: NavigationItemContract): NavigationItemViewModel {
        const node = new NavigationItemViewModel(navItem); // TODO: Review permalinks

        node.hasFocus.subscribe((focused) => {
            if (focused) {
                this.onFocusChange(node);
            }
        });

        node.onUpdate.subscribe(this.dispatchUpdates);

        if (navItem.navigationItems) {
            navItem.navigationItems.forEach(child => {
                var childNode = this.navigationItemToNode(child);
                childNode.parent = node;
                node.nodes.push(childNode);
            });
        }

        return node;
    }

    public addNode(label: string): NavigationItemViewModel {
        var focusedNode = this.focusedNode();

        if (focusedNode) {
            var navitem: NavigationItemContract = { key: Utils.guid(), label: label };
            var node = new NavigationItemViewModel(navitem);

            node.parent = focusedNode;
            focusedNode.nodes.push(node);

            node.hasFocus.subscribe((focused) => {
                if (focused) {
                    this.onFocusChange(node);
                }
            });

            node.onUpdate.subscribe(this.dispatchUpdates);

            this.dispatchUpdates();

            return node;
        }
    }

    public nodeToNavigationItem(node: NavigationItemViewModel): NavigationItemContract {
        let navigationItems = null;

        if (node.nodes().length > 0) {
            navigationItems = [];
            node.nodes().forEach(x => navigationItems.push(this.nodeToNavigationItem(x)));
        }

        const navigationItem: NavigationItemContract = {
            key: node.id,
            label: node.label(),
            navigationItems: navigationItems
        };

        const hyperlink = node.hyperlink();

        if (hyperlink) {
            navigationItem.permalinkKey = hyperlink.permalinkKey;
        }

        return navigationItem;
    }

    public getNavigationItems(): Array<NavigationItemContract> {
        const navigationItems = [];

        this.nodes().forEach(x => navigationItems.push(this.nodeToNavigationItem(x)));

        return navigationItems;
    }

    public onNodeDragStart(payload: any, node: HTMLElement): void {
        const width = node.clientWidth + "px";
        const height = node.clientHeight + "px";

        this.placeholderElement.style.width = width;
        this.placeholderElement.style.height = height;

        node.parentNode.insertBefore(this.placeholderElement, node.nextSibling);
    }

    public onNodeDragEnd(widget: HTMLElement): void {
        this.placeholderElement.parentElement.removeChild(this.placeholderElement);
    }

    private onAcceptNodeBefore(node: HTMLElement, acceptingNode: HTMLElement): void {
        acceptingNode.parentNode.insertBefore(this.placeholderElement, acceptingNode);
    }

    private onAcceptNodeAfter(node: HTMLElement, acceptingNode: HTMLElement): void {
        acceptingNode.parentNode.insertBefore(this.placeholderElement, acceptingNode.nextSibling);
    }
}
