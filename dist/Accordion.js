if (typeof Object.assign != 'function') {
    (function () {
        Object.assign = function (target) {
            'use strict';
            if (target === undefined || target === null)
                throw new TypeError('Cannot convert undefined or null to object');
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
var Accordion = /** @class */ (function () {
    function Accordion(options) {
        if (options === void 0) { options = {}; }
        this.expandedClassName = "expanded";
        this.attribute_index = "data-index";
        this.error_notValid = " is either not valid or cannot be found";
        this.timer = null;
        this.cache = [];
        var defaults = {
            item: ".acc",
            oneOpen: true,
            oneNeedsToBeActive: false,
            child_selector: null,
            header_selector: ".acc-header",
            targetDataAttribute: "data-target",
            content_selector: ".acc-content",
            activeClass: "active",
            animationTime: 100,
            interact: function () {
            }
        };
        this.options = Object.assign(defaults, options);
        try {
            this.initialize();
        }
        catch (e) {
            console.error(e);
        }
    }
    Accordion.prototype.isElement = function (element) {
        return element instanceof Element || element instanceof HTMLDocument;
    };
    Accordion.prototype.isNodeList = function (element) {
        return element instanceof NodeList || element instanceof HTMLCollection;
    };
    Accordion.prototype.nodeListToArray = function (nodeList) {
        return Array.prototype.slice.call(nodeList);
    };
    Accordion.prototype.contentItem = function (accordionItem, header) {
        if (!header)
            return null;
        var content = accordionItem.querySelector(this.options.content_selector), headerTarget = header.getAttribute(this.options.targetDataAttribute);
        if (headerTarget)
            content = document.querySelector(headerTarget);
        return content || null;
    };
    Accordion.prototype.__closeElement = function (accordionItem) {
        var header = accordionItem.querySelector(this.options.header_selector);
        var content = this.contentItem(accordionItem, header);
        content.classList.remove(this.options.activeClass);
        content.style.maxHeight = content.scrollHeight + "px";
        accordionItem.classList.remove(this.expandedClassName);
        setTimeout(function () {
            content.style.maxHeight = "0";
        }, 10);
    };
    Accordion.prototype.clickListener = function (header, content, children, accordionItem) {
        var _this_1 = this;
        content.style.overflow = "hidden";
        if (!accordionItem.classList.contains(this.expandedClassName))
            content.style.maxHeight = "0";
        header.addEventListener("click", function (e) {
            var type = "", _this = _this_1;
            clearTimeout(_this_1.timer);
            if (parseInt(content.style.maxHeight) > 0 || content.style.maxHeight === "") {
                if (_this.options.oneNeedsToBeActive) {
                    var itemsActive_1 = 0;
                    children.forEach(function (child) {
                        if (child.classList.contains(_this.expandedClassName))
                            itemsActive_1++;
                    });
                    if (itemsActive_1 <= 1)
                        return;
                }
                type = "close";
                _this_1.__closeElement(accordionItem);
            }
            else {
                if (_this_1.options.oneOpen) {
                    children.forEach(function (child) {
                        if (child.classList.contains(_this_1.expandedClassName))
                            _this_1.__closeElement(child);
                    });
                }
                type = "open";
                content.style.maxHeight = content.scrollHeight + "px";
                accordionItem.classList.add(_this_1.expandedClassName);
                content.classList.add(_this_1.options.activeClass);
                _this_1.timer = setTimeout(function () {
                    content.style.maxHeight = null;
                }, _this_1.options.animationTime + 100);
            }
            _this_1.options.interact.call(e, {
                type: type,
                header: header,
                content: content,
                items: children,
                activeItems: (function () {
                    var activeChildren = [];
                    children.forEach(function (child) {
                        if (child.classList.contains(_this.expandedClassName)) {
                            activeChildren.push(child);
                        }
                    });
                    return activeChildren;
                })(),
                options: _this_1.options
            });
        });
    };
    Accordion.prototype.initialize = function () {
        var _this_1 = this;
        var nodeArray = [];
        if (typeof this.options.item === "string") {
            nodeArray = this.nodeListToArray(document.querySelectorAll(this.options.item));
        }
        else if (this.isElement(this.options.item)) {
            nodeArray = [this.options.item];
        }
        else if (this.isNodeList(this.options.item)) {
            nodeArray = this.nodeListToArray(this.options.item);
        }
        this.nodeArray = nodeArray;
        this.nodeArray.forEach(function (node) {
            var children = (_this_1.options.child_selector) ? _this_1.nodeListToArray(node.querySelectorAll(_this_1.options.child_selector)) : _this_1.nodeListToArray(node.children);
            children.forEach(function (accordionItem, accordionIndex) {
                accordionItem.setAttribute(_this_1.attribute_index, accordionIndex);
                var header = accordionItem.querySelector(_this_1.options.header_selector) || null, content = _this_1.contentItem(accordionItem, header);
                if (!header)
                    throw "header_selector" + _this_1.error_notValid;
                if (!content)
                    throw "content_selector" + _this_1.error_notValid;
                if (content && content.style.display === "none")
                    content.style.display = "";
                if (header && content) {
                    content.style.transition = "max-height " + _this_1.options.animationTime + "ms ease-out";
                    _this_1.cache.push({
                        header: header, content: content
                    });
                    _this_1.clickListener(header, content, children, accordionItem);
                }
            });
        });
    };
    Accordion.prototype.toggle = function (index) {
        var cacheItem = this.cache[index];
        if (cacheItem)
            cacheItem.header.click();
    };
    Accordion.prototype.interact = function (callback) {
        this.options.interact = callback;
    };
    return Accordion;
}());
//# sourceMappingURL=Accordion.js.map