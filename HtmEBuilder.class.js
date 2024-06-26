"use strict";

class HtmEBuilder {
    /**
     * The target element of this builder
     * @type {HTMLElement}
     */
    #htmlElement;
    #listeners = {};

    /**
     * @param {keyof HTMLElementTagNameMap | HTMLElement} tagNameOrElement - The tag name or an HTMLElement
     */
    constructor(tagNameOrElement) {
        if (typeof tagNameOrElement === "string") {
            this.#htmlElement = document.createElement(tagNameOrElement);
        } else if (tagNameOrElement instanceof HTMLElement) {
            this.#htmlElement = tagNameOrElement;
        } else {
            throw new Error("Invalid argument: Expected a tag name or an HTMLElement");
        }
    }

    /**
     * Set the ID for this target
     * @param {String} id - The ID to set
     * @returns {HtmEBuilder}
     */
    id(id) {
        this.#htmlElement.id = id;
        return this;
    }

    /**
     * Set classes for this target
     * @param {...String} classes - The classes to set
     * @returns {HtmEBuilder}
     */
    class(...classes) {
        this.#htmlElement.className = classes.join(" ");
        return this;
    }

    /**
     * Toggle classes for this target
     * @param {...String} classes - The classes to toggle
     * @returns {HtmEBuilder}
     */
    tgClass(...classes) {
        classes.forEach((cls) => {
            this.#htmlElement.classList.toggle(cls);
        });
        return this;
    }

    /**
     * Remove classes for this target
     * @param {...String} classes - The classes to remove
     * @returns {HtmEBuilder}
     */
    rmClass(...classes) {
        classes.forEach((cls) => {
            this.#htmlElement.classList.remove(cls);
        });
        return this;
    }

    /**
     * Append inner HTML to this target
     * @param {String} innerHTML - The HTML to append
     * @returns {HtmEBuilder}
     */
    pushHtml(innerHTML) {
        this.#htmlElement.innerHTML += innerHTML;
        return this;
    }

    /**
     * Replace inner HTML of this target
     * @param {String} innerHTML - The HTML to set
     * @returns {HtmEBuilder}
     */
    html(innerHTML) {
        this.#htmlElement.innerHTML = innerHTML;
        return this;
    }

    /**
     * Set text content for this target
     * @param {String} textContent - The text content to set
     * @returns {HtmEBuilder}
     */
    text(textContent) {
        this.#htmlElement.textContent = textContent;
        return this;
    }

    /**
     * Set source for this target if it is an audio or video element
     * @param {String} src - The source to set
     * @returns {HtmEBuilder}
     */
    source(src) {
        if (
            this.#htmlElement instanceof HTMLAudioElement ||
            this.#htmlElement instanceof HTMLVideoElement
        ) {
            this.#htmlElement.appendChild(
                Object.assign(document.createElement("source"), { src })
            );
        } else {
            wrn("Element:", this.#htmlElement, "\n\nIs not an instance of Audio or Video, ignoring.");
        }
        return this;
    }

    /**
     * Remove source for this target if it is an audio or video element
     * @param {String} src - The source to remove
     * @returns {HtmEBuilder}
     */
    rmSource(src) {
        if (
            this.#htmlElement instanceof HTMLAudioElement ||
            this.#htmlElement instanceof HTMLVideoElement
        ) {
            let sourceToRemove = qs(this.#htmlElement, `source[src="${src}"]`);
            if (sourceToRemove) {
                this.#htmlElement.removeChild(sourceToRemove);
                sourceToRemove = null;
            } else {
                wrn("Element:", this.#htmlElement, `\n\nDoesn't have source: "${src}", ignoring.`);
            }
        } else {
            wrn("Element:", this.#htmlElement, "\n\nIs not an instance of Audio or Video, ignoring.");
        }
        return this;
    }

    /**
     * Set the src attribute for this target if it is an image element
     * @param {String} src - The source to set
     * @returns {HtmEBuilder}
     */
    src(src) {
        if (this.#htmlElement instanceof HTMLImageElement) {
            this.#htmlElement.src = src;
        } else {
            wrn("Element:", this.#htmlElement, "\n\nIs not an instance of Image, ignoring.");
        }
        return this;
    }

    /**
     * Set the href attribute for this target if it is an anchor element
     * @param {String} href - The href to set
     * @returns {HtmEBuilder}
     */
    href(href) {
        if (this.#htmlElement instanceof HTMLAnchorElement) {
            this.#htmlElement.href = href;
        } else {
            wrn("Element:", this.#htmlElement, "\n\nIs not an instance of Anchor, ignoring.");
        }
        return this;
    }

    /**
     * Set an attribute for this target
     * @param {String} key - The attribute name
     * @param {String} value - The attribute value
     * @returns {HtmEBuilder}
     */
    attr(key, value) {
        this.#htmlElement.setAttribute(key, value);
        return this;
    }

    /**
     * Remove an attribute from this target
     * @param {String} key - The attribute name
     * @returns {HtmEBuilder}
     */
    rmAttr(key) {
        this.#htmlElement.removeAttribute(key);
        return this;
    }

    /**
     * Set styles for this target
     * @param {CSSStyleDeclaration} style - The styles to set
     * @returns {HtmEBuilder}
     */
    style(style) {
        for (const [key, value] of Object.entries(style)) {
            this.#htmlElement.style[key] = value;
        }
        return this;
    }

    /**
     * Append child element(s) to this target
     * @param {...HTMLElement} elements - The child elements to append
     * @returns {HtmEBuilder}
     */
    append(...elements) {
        elements.forEach(element => this.#htmlElement.appendChild(element));
        return this;
    }

    /**
     * Append child element(s) to a child of this target
     * @param {String} selector - Selector of the child to append to
     * @param {...HTMLElement} elements - The element to append
     * @returns {HtmEBuilder}
     */
    childAppend(selector, ...elements) {
        const childToAppend = qs(this.#htmlElement, selector);
        if (childToAppend) {
            elements.forEach(element => childToAppend.appendChild(element));
        } else {
            wrn("Element:", this.#htmlElement, `\n\nDoesn't have selector: "${selector}", ignoring.`);
        }
        return this;
    }

    /**
     * Add event listener(s) for this target
     * @param {string|string[]} events - The event type(s)
     * @param {(this: HTMLElement, ev: Event) => any} listener - The event listener
     * @param {String | null} [id=null] - The listener ID
     * @param {boolean | AddEventListenerOptions | null} [options=null] - The event listener options
     * @returns {HtmEBuilder}
     */
    on(events, listener, id = null, options = null) {
        if (!Array.isArray(events)) {
            events = [events];
        }
        events.forEach(event => {
            this.#htmlElement.addEventListener(event, listener, options);
            if (id) {
                this.#listeners[id] = this.#listeners[id] || {};
                this.#listeners[id][event] = listener;
            }
        });
        return this;
    }

    /**
     * Remove event listener(s) for this target
     * @param {string|string[]} events - The event type(s)
     * @param {String} id - The listener ID
     * @param {boolean | AddEventListenerOptions} options - The event listener options
     * @returns {HtmEBuilder}
     */
    rmOn(events, id, options) {
        if (!Array.isArray(events)) {
            events = [events];
        }
        const listeners = this.#listeners[id];
        if (listeners) {
            events.forEach(event => {
                const listener = listeners[event];
                if (listener) {
                    this.#htmlElement.removeEventListener(event, listener, options);
                } else {
                    wrn(`No listener found for event: ${event} with ID: ${id}`);
                }
            });
        } else {
            wrn(`No listeners found with ID: ${id}`);
        }
        return this;
    }

    /**
     * Append this target to a parent element
     * @param {HTMLElement} htmlElement - The parent element to append to
     * @returns {HtmEBuilder}
     */
    attachToEle(htmlElement) {
        htmlElement.appendChild(this.#htmlElement);
        return this;
    }

    /**
     * Append this target to a parent element has selector
     * @param {String} selector - The selector of parent element to append to
     * @returns {HtmEBuilder}
     */
    attachToEleHas(selector) {
        const parent = dQs(selector);
        parent.appendChild(this.#htmlElement);
        return this;
    }

    /**
     * Get this target element
     */
    get el() {
        lg(`Retrieved element id: ${this.#htmlElement.id}`, this.#htmlElement);
        return this.#htmlElement;
    }

    /**
     * Create a builder for an existing element in the document
     * @param {HTMLElement} element - The element to create a builder for
     * @returns {HtmEBuilder}
     */
    static fromElement(element) {
        if (!(element instanceof HTMLElement)) {
            throw new Error("Expected an instance of HTMLElement");
        }
        return new HtmEBuilder(element);
    }

    /**
     * Create an instance of HtmEBuilder from a child element of the specified parent element.
     * @param {HTMLElement} parentElement - The parent element to search within
     * @param {String} selector - The CSS selector to find the child element
     * @returns {HtmEBuilder} A new instance of HtmEBuilder for the found child element
     * @throws {Error} Throws an error if the element is not found
     */
    static fromChildOf(parentElement, selector) {
        const element = qs(parentElement, selector);
        if (element) {
            return new HtmEBuilder(element);
        } else {
            throw new Error(`No element found for selector "${selector}" within the specified parent element.`);
        }
    }

    /**
     * Generate a new instance of HtmEBuilder for a specified HTML tag name.
     * @param {keyof HTMLElementTagNameMap} tagName - The tag name of the HTML element to create
     * @returns {HtmEBuilder} A new instance of HtmEBuilder for the created element
     * @throws {Error} Throws an error if the tag name is not a string
     */
    static generate(tagName) {
        if (typeof tagName !== "string") {
            throw new Error("The tag name must be a string.");
        }
        return new HtmEBuilder(tagName);
    }
}

/**
 * Shorter element.querySelector command
 * @param {undefined | null | HTMLElement | Document} [parent=undefined] - The parent element to query
 * @param {...String} selectors - The selectors to query
 * @returns {HTMLElement | [HTMLElement] | null}
 */
function qs(parent = undefined, ...selectors) {
    if (selectors.length === 1) {
        return (parent ?? document).querySelector(selectors[0]);
    } else {
        return selectors.map((selector) => (parent ?? document).querySelector(selector));
    }
}

/**
 * Shorter element.querySelectorAll command
 * @param {undefined | null | HTMLElement | Document} [parent=undefined] - The parent element to query
 * @param {...String} selectors - The selectors to query
 * @returns {NodeListOf<HTMLElement> | [NodeListOf<HTMLElement>]}
 */
function qsa(parent = undefined, ...selectors) {
    if (selectors.length === 1) {
        return (parent ?? document).querySelectorAll(selectors[0]);
    } else {
        return selectors.map((selector) => (parent ?? document).querySelectorAll(selector));
    }
}

/**
 * Shorter document.querySelector command
 * @param {...String} selectors - The selectors to query
 * @returns {HTMLElement | [HTMLElement] | null}
 */
function dQs(...selectors) {
    if (selectors.length === 1) {
        return document.querySelector(selectors[0]);
    } else {
        return selectors.map((selector) => document.querySelector(selector));
    }
}

/**
 * Shorter document.querySelectorAll command
 * @param {...String} selectors - The selectors to query
 * @returns {NodeListOf<HTMLElement> | [NodeListOf<HTMLElement>]}
 */
function dQsa(...selectors) {
    if (selectors.length === 1) {
        return document.querySelectorAll(selectors[0]);
    } else {
        return selectors.map((selector) => document.querySelectorAll(selector));
    }
}

/**
 * Shorter console.log command
 * @param {...any} args - The arguments to log
 */
function lg(...args) {
    console.log(...args);
}

/**
 * Shorter console.warn command
 * @param {...any} data - The data to warn about
 */
function wrn(...data) {
    console.warn(...data);
}