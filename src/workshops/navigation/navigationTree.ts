import * as $ from "jquery/dist/jquery";
import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import { INavigationItem } from "@paperbits/common/navigation/INavigationItem";
import { NavigationTreeNode } from "../../workshops/navigation/navigationTreeNode";

export class NavigationTree {
    private placeholderElement: HTMLElement;

    public nodes: KnockoutObservableArray<NavigationTreeNode>;
    public selectedNode: KnockoutObservable<NavigationTreeNode>;
    public focusedNode: KnockoutObservable<NavigationTreeNode>;
    public onUpdate: KnockoutSubscribable<Array<INavigationItem>>;

    constructor(items: Array<INavigationItem>) {
        this.onFocusChange = this.onFocusChange.bind(this);
        this.addNode = this.addNode.bind(this);
        this.onNodeDragStart = this.onNodeDragStart.bind(this);
        this.onNodeDragEnd = this.onNodeDragEnd.bind(this);
        this.onNullPointerMove = this.onNullPointerMove.bind(this);
        this.onAcceptNodeBefore = this.onAcceptNodeBefore.bind(this);
        this.onAcceptNodeAfter = this.onAcceptNodeAfter.bind(this);
        this.dispatchUpdates = this.dispatchUpdates.bind(this);

        var nodes = new Array<NavigationTreeNode>();
        items.forEach(x => nodes.push(this.navigationItemToNode(x)));

        this.nodes = ko.observableArray<NavigationTreeNode>(nodes);
        this.selectedNode = ko.observable<NavigationTreeNode>();
        this.focusedNode = ko.observable<NavigationTreeNode>();
        this.onUpdate = new ko.subscribable<Array<INavigationItem>>();

        this.placeholderElement = $("<div class=\"placeholder\"></div>")[0];
        this.placeholderElement.onmousemove = this.onNullPointerMove;
    }

    private onNullPointerMove(event: PointerEvent): void {
        event.stopPropagation();
    }

    private onFocusChange(node: NavigationTreeNode): void {
        this.focusedNode(node);
    }

    private dispatchUpdates() {
        var items = new Array<INavigationItem>();
        this.nodes().forEach(n => items.push(this.nodeToNavigationItem(n)));
        this.onUpdate.notifySubscribers(items);
    }

    private navigationItemToNode(navItem: INavigationItem): NavigationTreeNode {
        var node = new NavigationTreeNode(navItem); // TODO: Review permalinks

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

    public addNode(label: string): NavigationTreeNode {
        var focusedNode = this.focusedNode();

        if (focusedNode) {
            var navitem: INavigationItem = { key: Utils.guid(), label: label };
            var node = new NavigationTreeNode(navitem);

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

    public nodeToNavigationItem(node: NavigationTreeNode): INavigationItem {
        let navigationItems = null;

        if (node.nodes().length > 0) {
            navigationItems = [];
            node.nodes().forEach(x => navigationItems.push(this.nodeToNavigationItem(x)));
        }

        const navigationItem: INavigationItem = {
            key: node.id,
            label: node.label(),
            navigationItems: navigationItems
        };

        let hyperlink = node.hyperlink();

        if (hyperlink) {
            if (hyperlink.permalinkKey) {
                navigationItem.permalinkKey = hyperlink.permalinkKey;
            }
            else {
                navigationItem.externalUrl = hyperlink.href;
            }
        }

        return navigationItem;
    }

    public getNavigationItems(): Array<INavigationItem> {
        const navigationItems = [];

        this.nodes().forEach(x => navigationItems.push(this.nodeToNavigationItem(x)));

        return navigationItems;
    }

    public onNodeDragStart(payload: any, node: HTMLElement): void {
        const width = node.clientWidth + "px";
        const height = node.clientHeight + "px";

        this.placeholderElement.style.width = width;
        this.placeholderElement.style.height = height;

        $(node).after(this.placeholderElement);
    }

    public onNodeDragEnd(widget: HTMLElement): void {
        $(this.placeholderElement).remove();
    }

    private onAcceptNodeBefore(node: HTMLElement, acceptingNode: HTMLElement): void {
        $(acceptingNode).before(this.placeholderElement);
    }

    private onAcceptNodeAfter(node: HTMLElement, acceptingNode: HTMLElement): void {
        $(acceptingNode).after(this.placeholderElement);
    }
}
