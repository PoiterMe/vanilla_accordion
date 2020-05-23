interface Accordion_Configs {
    item?: string | NodeList | Element,
    oneOpen?: boolean;
    oneNeedsToBeActive?: boolean;
    child_selector?: string | null;
    header_selector?: string;
    content_selector?: string;
    activeClass?: string;
    animationTime?: number;
    interact?: (options: Accordion_Configs) => void;
}
declare interface ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
}
if (typeof Object.assign != 'function') {
    (function () {
        Object.assign = function (target) {
            'use strict';
            if (target === undefined || target === null) throw new TypeError('Cannot convert undefined or null to object');
            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (source.hasOwnProperty(nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    })();
}
class Accordion {
    private expandedClassName: string = "expanded";
    private attribute_index: string = "data-index";
    private attribute_target: string = "data-target";
    private timer: number | null = null;
    options: Accordion_Configs;
    nodeArray: any[];
    cache: any[] = [];
    constructor(options: Accordion_Configs = {}) {
        let defaults: Accordion_Configs = {
            item: ".acc",
            oneOpen: true,
            oneNeedsToBeActive: false,
            child_selector: null,
            header_selector: ".acc-header",
            content_selector: ".acc-content",
            activeClass: "active",
            animationTime: 400,
            interact: function () {
            }
        }
        this.options = Object.assign(defaults, options)
        this.initialize();
    }
    private isElement(element: string | NodeList | Element) {
        return element instanceof Element || element instanceof HTMLDocument;
    }
    private isNodeList(element: string | NodeList | Element) {
        return element instanceof NodeList || element instanceof HTMLCollection;
    }
    private nodeListToArray(nodeList: NodeList | HTMLCollection | any) {
        return Array.prototype.slice.call(nodeList);
    }
    private contentItem(accordionItem: HTMLElement, header: HTMLElement): HTMLElement {
        let content: HTMLElement = accordionItem.querySelector(this.options.content_selector),
            headerTarget = header.getAttribute(this.attribute_target);
        if (headerTarget) content = document.querySelector(headerTarget)
        return content;
    }
    private __closeElement(accordionItem) {
        let header: HTMLElement = accordionItem.querySelector(this.options.header_selector);
        let content: HTMLElement = this.contentItem(accordionItem, header);
        content.classList.remove(this.options.activeClass);
        content.style.maxHeight = content.scrollHeight + "px";
        accordionItem.classList.remove(this.expandedClassName)
        setTimeout(() => {
            content.style.maxHeight = "0"
        }, 10)
    }
    private clickListener(header: HTMLElement, content: HTMLElement, children: any, accordionItem: any) {
        content.style.overflow = "hidden"
        if (!accordionItem.classList.contains(this.expandedClassName)) content.style.maxHeight = "0"
        header.addEventListener("click", e => {
            let type = "", _this = this;
            clearTimeout(this.timer)
            if (parseInt(content.style.maxHeight) > 0 || content.style.maxHeight === "") {
                if (_this.options.oneNeedsToBeActive) {
                    let itemsActive = 0;
                    children.forEach(function (child) {
                        if (child.classList.contains(_this.expandedClassName)) itemsActive++;
                    });
                    if (itemsActive <= 1) return;
                }
                type = "close"
                this.__closeElement(accordionItem);
            } else {
                if (this.options.oneOpen) {
                    children.forEach(child => {
                        if (child.classList.contains(this.expandedClassName)) this.__closeElement(child);
                    })
                }
                type = "open"
                content.style.maxHeight = content.scrollHeight + "px";
                accordionItem.classList.add(this.expandedClassName)
                content.classList.add(this.options.activeClass);
                this.timer = setTimeout(function () {
                    content.style.maxHeight = null;
                }, this.options.animationTime + 100)
            }
            this.options.interact.call(e, {
                type,
                header,
                content,
                items: children,
                activeItems: (function () {
                    let activeChildren = [];
                    children.forEach(child => {
                        if (child.classList.contains(_this.expandedClassName)) {
                            activeChildren.push(child);
                        }
                    })
                    return activeChildren;
                })(),
                options: this.options
            })
        })
    }
    private initialize() {
        let nodeArray = [];
        if (typeof this.options.item === "string") {
            nodeArray = this.nodeListToArray(document.querySelectorAll(this.options.item));
        } else if (this.isElement(this.options.item)) {
            nodeArray = [this.options.item]
        } else if (this.isNodeList(this.options.item)) {
            nodeArray = this.nodeListToArray(this.options.item);
        }
        this.nodeArray = nodeArray;
        this.nodeArray.forEach(node => {
            let children = (this.options.child_selector) ? this.nodeListToArray(node.querySelectorAll(this.options.child_selector)) : this.nodeListToArray(node.children);
            children.forEach((accordionItem, accordionIndex) => {
                accordionItem.setAttribute(this.attribute_index, accordionIndex);
                let header: HTMLElement = accordionItem.querySelector(this.options.header_selector),
                    content: HTMLElement = this.contentItem(accordionItem, header);
                if (content && content.style.display === "none") content.style.display = "";
                if (header && content) {
                    content.style.transition = `max-height ${this.options.animationTime}ms ease-out`;
                    this.cache.push({
                        header, content
                    })
                    this.clickListener(header, content, children, accordionItem)
                }
            });
        })
    }
    public toggle(index: number) {
        let cacheItem = this.cache[index];
        if (cacheItem) cacheItem.header.click()
    }
    public interact(callback: () => void) {
        this.options.interact = callback
    }
}

