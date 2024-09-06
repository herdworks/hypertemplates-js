// HyperTemplates
//
// By Caleb Hailey (caleb@herd.works) 
// © 2024 Herd Works Inc (https://herd.works)
class HyperTemplates extends HTMLElement {

    // attributes
    data;

    // webcomponent lifecycle methods
    constructor() {
        super();
        this.data = null;
    };
    async connectedCallback() {
        await this.process();
    };
    disconnectedCallback() {
        // noop
    };
    adoptedCallback() {
        // noop
    };
    attributeChangedCallback(name, oldValue, newValue) {
        // noop
    };

    // process template
    async process(template=document, data=null) {
        this.data = data || this.data || await this.get(this.dataset.hyperData);
        if (Object.entries(this.data).length == 0) { return }; // guard: nothing to do!
        this.evaluate(template);
        await this.render(template);
    };

    // evaluate template conditionals
    evaluate(template=document) {
        let conditionals = this.selectElements(template, "[data-hyper-if]");
        for (let [_, element] of Object.entries(conditionals)) {
            this.evaluateElement(element);
        };
    };
    evaluateElement(element = new HTMLElement()) {
        let params = element.dataset.hyperIf.split(",");
        for (let param of params) {
            let value = this.lookup(param);
            if (!!value) { element.removeAttribute("hidden") }
            else { element.setAttribute("hidden", "") };
        };
    };

    // render the template
    async render(template=document) {
        let attributes = this.selectElements(template, "[data-hyper-attrs]");
        for (let [_, element] of Object.entries(attributes)) {
            this.renderAttributes(element);
        };
        let contents = this.selectElements(template, "[data-hyper-content]");
        for (let [_, element] of Object.entries(contents)) {
            this.renderContent(element);
        };
        let templates = this.selectElements(template, "[data-hyper-template]");
        for (let [_, element] of Object.entries(templates)) {
            await this.renderTemplate(element);
        };
    };
    renderAttributes(element = new HTMLElement()) {
        let params = this.parseParameters(element.dataset.hyperAttrs);
        for (let [key, param] of params) {
            let value = this.resolveParameter(param);
            if (!!value) { element.setAttribute(key, value) }
            else { console.debug(element) };
        };
    };
    renderContent(element = new HTMLElement()) {
        let params = this.parseParameters(element.dataset.hyperContent);
        for (let [key, param] of params) {
            let value = this.resolveParameter(param);
            switch (true) {
                case !!value && key == "text":
                    element.innerText = value;
                    break;
                case !!value && key == "html":
                    element.innerHTML = value;
                    break;
                default:
                    console.warn(`[WARNING] unknown content mode '${key}';`, element);
            };
        };
    };
    async renderTemplate(template = new HTMLElement()) {
        let params = this.parseParameters(template.dataset.hyperTemplate);
        for (let [key, param] of params) {
            let data = this.resolveParameter(param);
            if (!Array.isArray(data)) { data = [data] }; // normalize nested template data as arrays
            for (let value of data.toReversed()) { // reverse order because template.after() is effectively LIFO
                let element = template.cloneNode(true);
                element.removeAttribute("data-hyper-template");
                await new HyperTemplates().process(element, { [key]: value }); // RECURSION!
                template.after(element); // insert the rendered element after the template placeholder
            };
        };
        template.setAttribute("hidden", ""); // hide placeholder template content
    };
    parseParameters(incoming="") {
        var params = incoming.split(";");
        return params.map(function(param) {
            let key, value, values;
            if (param.includes(":")) { [key,value] = param.split(":") }
            else if (param.includes("=")) { [key,value] = param.split("=") };
            values = value.split(",");
            return [key.trim(), values];
        });
    };
    resolveParameter(incoming=[]) {
        let values = incoming.map(function(i){ return this.lookup(i) }.bind(this));
        return values.filter(function(i){ return i })[0]; // return the first non-null value
    };
    selectElements(template=document, selector="[data-hyper-content]") {
        selector = this.subset(selector, ["[data-hyper-template]"]);
        return Array.from(template.querySelectorAll(selector));
    };

    // generic helper methods
    async get(href="index.json") {
        let url = new URL(href, window.location.href);
        let response = await fetch(url, { method: "GET", headers: {} });
        if (!response.ok) { return {} };
        this.data = await response.json(); // cache data
        return this.data;
    };
    lookup(path="") {
        let value = path.split(".").reduce(function(obj, key) { return (obj || {})[key] }, this.data) || null;
        if (!!!value) { console.warn(`[WARNING] path '${path}' not found;`, this.data) };
        return value;
    };
    subset(selector="[data-hyper-content]", containers=[]) {
        let selected = selector
        for (let container of containers) { selected = selected.concat(`:not(${container} ${selector})`) };
        return selected;
    };

};
customElements.define("hyper-templates", HyperTemplates);
