// HyperTemplates
//
// By Caleb Hailey (caleb@herd.works) 
// © 2024 Herd Works Inc (https://herd.works)
class HyperTemplates extends HTMLElement {

    // attributes
    data;
    uri;

    // webcomponent lifecycle methods
    constructor(uri=null) {
        super();
        this.data = null;
        this.uri = uri || new URL(window.location.href);
    };
    async connectedCallback() { await this.process() };
    disconnectedCallback() {}; // noop
    adoptedCallback() {}; // noop
    attributeChangedCallback(name, oldValue, newValue) {}; // noop

    // getters
    get parser() { return new DOMParser() };

    // hypertemplates methods
    async process(template=document, data=null) {
        this.data = data || this.data || await this.get(this.dataset.hyperData);
        if (Object.entries(this.data).length == 0) { return }; // guard: nothing to do!
        await this.import(template);
        this.evaluate(template);
        await this.render(template);
    };

    async import(template=document) {
        let imports = this.selectElements(template, "[data-hyper-import]");
        for (let [_, element] of Object.entries(imports)) {
            let text = await this.get(element.dataset.hyperImport);
            let partial = this.parser.parseFromString(text, 'text/html');
            element.after(...Array.from(partial.body.children));
            element.remove(); // remove the import placeholder
        };
    };

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
            if (!!value && key == "text") { element.innerText = value }
            else if (!!value && key == "html") { element.innerHTML = value }
            else { console.warn(`[WARNING] unknown content mode '${key}';`, element) };
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

    // helper methods
    async get(href="index.json") {
        let url = new URL(href, this.uri);
        console.debug(`GET ${url.href}`);
        let response = await fetch(url, { method: "GET", headers: {} });
        if (!response.ok) { return {} };
        switch (true) {
            case response.headers.get("Content-Type").includes("application/json"): this.data = await response.json(); return this.data;
            case response.headers.get("Content-Type").includes("text/html"): return await response.text();
            default: return await response.text();
        };
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
