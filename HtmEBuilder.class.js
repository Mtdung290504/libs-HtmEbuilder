"use strict";

class HtmEBuilder {
    /**
     * Target of this builder
     * @type {HTMLElement}
     */
    #htmlElement;
    #listeners = {};

    /**
     * @param {keyof HTMLElementTagNameMap | HTMLElement} tagNameOrElement
     */
    constructor(tagNameOrElement) {
        if (typeof tagNameOrElement === "string") {
            this.#htmlElement = document.createElement(tagNameOrElement);
        } else if (tagNameOrElement instanceof HTMLElement) {
            this.#htmlElement = tagNameOrElement;
        } else {
            throw new Error(
                "Invalid argument: Expected a tag name or an HTMLElement"
            );
        }
    }

    /**
     * Set id for this target
     * @param {String} id
     * @returns {HtmEBuilder}
     */
    id(id) {
        this.#htmlElement.id = id;
        return this;
    }

    /**
     * Set classes for this target
     * @param {...String} classes
     * @returns {HtmEBuilder}
     */
    class(...classes) {
        this.#htmlElement.className = classes.join(" ");
        return this;
    }

    /**
     * Toggle classes for this target
     * @param {...String} classes
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
     * @param {...String} classes
     * @returns {HtmEBuilder}
     */
    rmClass(...classes) {
        classes.forEach((cls) => {
            this.#htmlElement.classList.remove(cls);
        });
        return this;
    }

    /**
     * Addtional inner HTML for this target
     * @param {String} innerHTML - HTML to add
     * @returns {HtmEBuilder}
     */
    innerHTML(innerHTML) {
        this.#htmlElement.innerHTML += innerHTML;
        return this;
    }

    /**
     * Replace inner HTML for this target
     * @param {String} innerHTML - HTML to replace
     * @returns {HtmEBuilder}
     */
    setInnerHTML(innerHTML) {
        this.#htmlElement.innerHTML = innerHTML;
        return this;
    }

    /**
     * Set text content for this target
     * @param {String} textContent
     * @returns {HtmEBuilder}
     */
    text(textContent) {
        this.#htmlElement.textContent = textContent;
        return this;
    }

    /**
     * Set source for this target if it's instance of video or audio element
     * @param {String} src
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
        } else
            wrn(
                "Element:",
                this.#htmlElement,
                "\n\nIs not instance of Audio or Video, ignore."
            );
        return this;
    }

    /**
     * Remove source for this target if it's instance of video or audio element
     * @param {String} src
     * @returns {HtmEBuilder}
     */
    rmSource(src) {
        if (
            this.#htmlElement instanceof HTMLAudioElement ||
            this.#htmlElement instanceof HTMLVideoElement
        ) {
            const sourceToRemove = qs(this.#htmlElement, `source[src="${src}"]`);
            if (sourceToRemove) {
                this.#htmlElement.removeChild(sourceToRemove);
                sourceToRemove = null;
            } else {
                wrn(
                    "Element:",
                    this.#htmlElement,
                    `\n\nDon't have source: "${src}", ignore.`
                );
            }
        } else
            wrn(
                "Element:",
                this.#htmlElement,
                "\n\nIs not instance of Audio or Video, ignore."
            );
        return this;
    }

    /**
     * Set src for this target if it's instance of image element
     * @param {String} src
     * @returns {HtmEBuilder}
     */
    src(src) {
        if (this.#htmlElement instanceof HTMLImageElement)
            this.#htmlElement.src = src;
        else
            wrn(
                "Element:",
                this.#htmlElement,
                "\n\nIs not instance of Image, ignore."
            );
        return this;
    }

    /**
     * Set href for this target if it's instance of anchor element
     * @param {String} href
     * @returns {HtmEBuilder}
     */
    href(href) {
        if (this.#htmlElement instanceof HTMLAnchorElement)
            this.#htmlElement.href = href;
        else
            wrn(
                "Element:",
                this.#htmlElement,
                "\n\nIs not instance of Anchor, ignore."
            );
        return this;
    }

    /**
     * Set attribute for this target
     * @param {String} key
     * @param {String} value
     * @returns {HtmEBuilder}
     */
    attr(key, value) {
        this.#htmlElement.setAttribute(key, value);
        return this;
    }

    /**
     * Remove attribute for this target
     * @param {String} key
     * @returns {HtmEBuilder}
     */
    rmAttr(key) {
        this.#htmlElement.removeAttribute(key);
        return this;
    }

    /**
     * Set style for this target
     * @param {CSSStyleDeclaration} style
     * @returns {HtmEBuilder}
     */
    style(style) {
        for (const [key, value] of Object.entries(style)) {
            this.#htmlElement.style[key] = value;
        }
        return this;
    }

    /**
     * Append child element into this target
     * @param {HTMLElement} element
     * @returns {HtmEBuilder}
     */
    append(element) {
        this.#htmlElement.appendChild(element);
        return this;
    }

    /**
     * Append child element into child of this target
     * @param {String} selector - Selector of child need to append
     * @param {HTMLElement} element
     * @returns {HtmEBuilder}
     */
    childAppend(selector, element) {
        const childToAppend = qs(this.#htmlElement, selector);
        if(childToAppend)
            childToAppend.appendChild(element);
        else
            wrn(
                "Element:",
                this.#htmlElement,
                `\n\nDon't have selector: "${selector}", ignore.`
            );
        return this;
    }

    /**
     * Add event listener for this target
     * @param {keyof HTMLElementEventMap} event
     * @param {(this: HTMLElement, ev: Event) => any} listener
     * @param {String | null} [id=null] 
     * @param {boolean | AddEventListenerOptions | null} [options=null]
     * @returns {HtmEBuilder}
     */
    on(event, listener, id = null, options = null) {
        this.#htmlElement.addEventListener(event, listener, options);
        if (id) this.#listeners[id] = listener;
        return this;
    }

    /**
     * Remove event listener for this target
     * @param {keyof HTMLElementEventMap} event
     * @param {String} id
     * @param {boolean | AddEventListenerOptions} options
     * @returns {HtmEBuilder}
     */
    rmOn(event, id, options) {
        const listener = this.#listeners[id];
        if (listener)
            this.#htmlElement.removeEventListener(event, listener, options);
        else
            wrn(
                "Element:",
                this.#htmlElement,
                `\n\nDon't have listener id: ${id}, ignore.`
            );
        return this;
    }

    /**
     * Append this target into a parent
     * @param {HTMLElement} htmlElement - Parent need to be append this target into
     * @returns {HtmEBuilder}
     */
    attachTo(htmlElement) {
        htmlElement.appendChild(this.#htmlElement);
        return this;
    }

    /**
     * Get this target
     */
    get el() {
        lg(`Getted element id::${this.#htmlElement.id}:`, this.#htmlElement);
        return this.#htmlElement;
    }

    /**
     * Create builder for element existing on document
     * @param {HTMLElement} element
     * @returns {HtmEBuilder}
     */
    static fromElement(element) {
        if (!(element instanceof HTMLElement)) {
            throw new Error("Expected an instance of HTMLElement");
        }
        return new HtmEBuilder(element);
    }
}

/**
 * Shorter element.querySelector command
 * @param {undefined | null | HTMLElement | Document} [parent=undefined] - Parent element to query
 * @param {...String} selectors
 * @returns {HTMLElement | [HTMLElement] | null}
 */
function qs(parent = undefined, ...selectors) {
    if (selectors.length === 1)
        return (parent ?? document).querySelector(selectors[0]);
    else
        return selectors.map((selector) =>
            (parent ?? document).querySelector(selector)
        );
}

/**
 * Shorter element.querySelectorAll command
 * @param {undefined | null | HTMLElement | Document} [parent=undefined] - Parent element to query
 * @param {...String} selectors
 * @returns {NodeListOf<HTMLElement> | [NodeListOf<HTMLElement>]}
 */
function qsa(parent = undefined, ...selectors) {
    if (selectors.length === 1)
        return (parent ?? document).querySelectorAll(selectors[0]);
    else
        return selectors.map((selector) =>
            (parent ?? document).querySelectorAll(selector)
        );
}

/**
 * Shorter document.querySelector command
 * @param {...String} selectors
 * @returns {HTMLElement | [HTMLElement] | null}
 */
function dQs(...selectors) {
    if (selectors.length === 1) return document.querySelector(selectors[0]);
    else return selectors.map((selector) => document.querySelector(selector));
}

/**
 * Shorter document.querySelectorAll command
 * @param {...String} selectors
 * @returns {NodeListOf<HTMLElement> | [NodeListOf<HTMLElement>]}
 */
function dQsa(...selectors) {
    if (selectors.length === 1) return document.querySelectorAll(selectors[0]);
    else return selectors.map((selector) => document.querySelectorAll(selector));
}

/**
 * Shorted console.log command
 * @param {...any} args
 */
function lg(...args) {
    console.log(...args);
}

/**
 * Shorter console.warn command
 * @param  {...any} data
 */
function wrn(...data) {
    console.warn(...data);
}