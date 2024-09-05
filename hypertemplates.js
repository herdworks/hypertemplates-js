// Utility functions
function noop() {}

// HyperTemplates component
//
// Usage:
//
//   import { HyperTemplates } from "../index.js";
//   class AppExample extends HyperTemplates {};
class HyperTemplates extends HTMLElement {

    // attributes
    document;
    data;
    attributes;
    elements;

    // instance constructor
    constructor(root=document, data=null) {
        super();
        this.document = root;
        this.data = data;
    };

    // HyperTemplates().connectedCallback() method (default implementation)
    // 
    // WebComponent event handler triggered when element added to DOM
    async connectedCallback() {
        this.data = this.data || await this.get(this.dataset.href);
        this.parseHyperTemplateElements();
        this.processTemplateAttrs();
        this.processTemplateConditionals();
        this.processTemplateContents();
        await this.processTemplateCollections();
    };

    // HyperTemplates().disconnectedCallback() method (default implementation)
    // 
    // WebComponent event handler triggered when element removed from DOM
    disconnectedCallback() {
        noop();
    };

    // HyperTemplates().adoptedCallback() method (default implementation)
    // 
    // WebComponent event handler triggered when element moved to new document (page)
    adoptedCallback() {
        noop();
    };

    // HyperTemplates().attributeChangedCallback() method (default implementation)
    // 
    // WebComponent event handler triggered when element attribute changes
    attributeChangedCallback(name, oldValue, newValue) {
        noop();
    };

    // HyperTemplates().mutationObserver() method
    elementObserver(selector="none", callback=async function(){}) {
        console.debug("Starting element observer for selector: '%s'", selector);
        var observer = new MutationObserver(function(mutationsList, observer) {
            mutationsList.forEach(function(mutation) { Array.from(mutation.addedNodes).filter(function(node){ return node instanceof HTMLElement }).forEach(function(node) {
                for (let element of Array.from(node.querySelectorAll(selector))) {
                    callback(element);
                };
            })});
        });
        observer.observe(document, { childList: true, subtree: true });
    };

    // ===================================================================== //
    //                                                                       //
    //                          HyperTemplates Core                          //
    //                                                                       //
    // ===================================================================== //

    // getters
    get wrapperFunctions() {
        return ["data-hyper-foreach"];
    };

    // HyperTemplates().parseHyperTemplateElements() method
    parseHyperTemplateElements() {
        this.attributes = Array.from(this.document.querySelectorAll(this.query("data-hyper-attrs")));
        this.conditionals = Array.from(this.document.querySelectorAll(this.query("data-hyper-if")));
        this.contents = Array.from(this.document.querySelectorAll(this.query("data-hyper-content")));
        this.collections = Array.from(this.document.querySelectorAll(this.query("data-hyper-foreach")));
    };

    // HyperTemplates().processTemplateAttrs() method
    processTemplateAttrs() {
        for (let [_, element] of Object.entries(this.attributes)) {
            this.processTemplateAttr(element);
        };
    };
    processTemplateAttr(element = new HTMLElement()) {
        let attrs = this.parseElementAttrs(element.dataset.hyperAttrs);
        for (let [key, paths] of attrs) {
            let values = paths.map(function(path){ return this.lookup(this.data, path) }.bind(this));
            let value = values.filter(function(i){ return i })[0];
            if (!!value) { element.setAttribute(key, value) }
            else { console.debug(`Nothing to do for attribute: ${key}`) };
        };
    };
    parseElementAttrs(incoming="") {
        var attrs = incoming.split(";");
        return attrs.map(function(attr) {
            let key, value;
            if (attr.includes(":")) { [key,value] = attr.split(":") }
            else if (attr.includes("=")) { [key,value] = attr.split("=") };
            value = value.split(",");
            return [key.trim(), value];
        });
    };

    // HyperTemplates().processTemplateContents() method
    processTemplateContents() {
        for (let [_, element] of Object.entries(this.contents)) {
            this.processTemplateContent(element);
        };
    };
    processTemplateContent(element = new HTMLElement()) {
        let paths = element.dataset.hyperContent.split(",");
        for (let path of paths) {
            let value = this.lookup(this.data, path);
            if (!!value) { element.innerHTML = value }
            else { console.debug(`Nothing to do for content path: ${path}`) };
        };
    };

    // HyperTempaltes().processTemplateConditionals() method
    processTemplateConditionals() {
        for (let [_, element] of Object.entries(this.conditionals)) {
            this.processTemplateConditional(element);
        };
    };
    processTemplateConditional(element = new HTMLElement()) {
        let paths = element.dataset.hyperIf.split(",");
        for (let path of paths) {
            let value = this.lookup(this.data, path);
            if (!!value) { element.removeAttribute("hidden") }
            else { element.setAttribute("hidden", "") };
        };
    };

    // HyperTemplates().processTemplateForeach() method
    async processTemplateCollections() {
        for (let [_, element] of Object.entries(this.collections)) {
            await this.processTemplateCollection(element);
        };
    };
    async processTemplateCollection(element = new HTMLElement()) {
        let collections = this.parseElementCollection(element.dataset.hyperForeach);
        for (let [key, paths] of collections) {
            let values = paths.map(function(path){ return this.lookup(this.data, path) }.bind(this));
            let value = values.filter(function(i){ return i })[0];
            for (let item of value.toReversed()) {
                let template = element.cloneNode(true);
                template.removeAttribute("data-hyper-foreach");
                element.after(template);
                let data = {};
                data[key] = item;
                let collection = new HyperTemplates(template, data);
                await collection.connectedCallback();
            };
        };
        element.setAttribute("hidden", "");
    };
    parseElementCollection(incoming="") {
        var collections = incoming.split(";");
        return collections.map(function(collection) {
            let key, value;
            if (collection.includes(":")) { [key,value] = collection.split(":") }
            else if (collection.includes("=")) { [key,value] = collection.split("=") };
            value = value.split(",");
            return [key.trim(), value];
        });
    };

    // HyperTemplates().get() method
    //
    // Fetches data from a URL and returns a HyperTemplates data object
    async get(href="index.json") {
        let url = new URL(href, window.location.href);
        console.debug("Fetching data from URL: '%s'", url.href);
        let response = await fetch(url, { method: "GET", headers: {} });
        if (!response.ok) { return {}; };
        return await response.json();
    };

    // HyperTemplates().query() method
    //
    // Constructs a querySelectorAll() query and returns the result
    query(selector) {
        let query = `[${selector}]`;
        for (let hf of this.wrapperFunctions) { query = query.concat(`:not([${hf}] [${selector}])`) };
        return query;
    };

    // HyperTemplates().lookup() method
    //
    // Inspired by: https://stackoverflow.com/a/33397682/23460705
    lookup(data={}, path="") {
        return path.split(".").reduce(function(obj, key) { return (obj || {})[key] }, data) || null;
    };

};
customElements.define("hyper-templates", HyperTemplates);

