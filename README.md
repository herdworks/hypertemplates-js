# HyperTemplates

HyperTemplates are a pure-HTML templating convention & rendering engine.

HyperTemplates can be used on individual pages or as a static site generator for an entire website.

```html
<!DOCTYPE html>
<html lang='en-US'>
    <head>
        <!-- Browser Metadata -->
        <meta charset='utf-8'>
        <meta name='viewport' content='width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes'>

        <!-- Page Metadata -->
        <title data-hyper-content='text:site.title'>HyperTemplates</title>
        <meta name='description' content='A pure-HTML templating engine for the modern web.' data-hyper-attrs='content:page.description,site.description'>
        <link rel='canonical' href='https://hypertemplates.net' data-hyper-attrs='href:page.canonical_url'>
        <link rel='icon' type='image/jpeg' sizes="32x32" href='/favicon.ico' data-hyper-attrs='href:site.favicon'>

        <!-- CSS -->
        <link rel='stylesheet' href='/styles.css' data-hyper-attrs='href:site.stylesheet'>

        <!-- JS -->
        <script src="/index.js" type="module" data-hyper-attrs='src:site.javascript'></script>
        <script src='/hypertemplates.js' type='module'></script>
    </head>
    <body>
        <section id='nav'>
            <!-- site navigation -->
        </section>
        <section id='hero'>
            <h1 data-hyper-content='text:page.title'>HyperTemplates</h1>
            <p data-hyper-content='text:page.summary'>HyperTemplates are a pure-HTML templating engine.</p>
        </section>
        <section id='content' data-hyper-content='html:page.content'>
            <!-- page content -->
        </section>
        <section id='footer'>
            <div class='' data-hyper-template='tag:page.tags'>
                <a href='/tags/example' data-hyper-attrs='href:tag.url'>
                    <span data-hyper-content='text:tag.name'>Example</span>
                </a>
            </div>
        </section>
        <hyper-templates hidden data-hyper-data='index.json'></hyper-templates>
    </body>
</html>
```

## How it works

HyperTemplates uses [HTML5 data attributes] as template parameters.

* `data-hyper-attrs` or `dataset.hyperAttrs`

  Creates a slot for one or more HTML element attributes, overwriting the current attribute values (if present).

* `data-hyper-content` or `dataset.hyperContent`

  Creates a slot for an HTML element's content (i.e. `innerHTML`), overwriting the current contents (if present).

* `data-hyper-if` or `dataset.hyperIf`

  Creates a slot for a conditional HTML element, removing the element if the key is not present.

* `data-hyper-template` or `dataset.hyperTemplate`

  Creates a slot for a collection of HTML elements, repeating all nested HTML elements once per item in the collection.

## Directory Structure

Each HyperTemplates project is a directory, with subdirectories and files that contribute to the content, structure, behavior, and presentation of your site.
The HyperTemplates directory structure and lookup hierarchy is heavily influenced by Hugo (see: [directory structure] and [template lookup order]).

Example HyperTempalates directory structure:

```shell
assets/
  css/
    theme/
    style.js
  js/
    main.js
  img/
content/
  about/
    index.md
  contact/
    index.html
    index.md
    index.js
  banner.png
  index.md
layouts/
  components/
    head.html
    header.html
    footer.html
  home.html
  feed.html
  page.html
public/
  css/*
  js/*
  contact/index.html
  about/index.html
  banner.png
  favicon.ico
  index.html
site.yaml
```

| Content        | File(s)                            | Comments                 |
|----------------|------------------------------------|--------------------------|
| Site metadata  | `/site.yaml`                       |                          |
|                | `/site.json`                       |                          |
|                | `/site.toml`                       |                          |
|                | `/config.yaml`                     |                          |
|                | `/config.json`                     |                          |
|                | `/config.toml`                     |                          |
| Global Assets  | `/assets/css/styles.css`           | Global stylesheets       |
|                | `/assets/js/main.js`               | Global scripts           |
|                | `/assets/img/*`                    | Global image assets      |
| Global Layouts | `/layouts/:layout.html`            | Global layout templates  |
| Homepage       | `/content/index.html`              | Page layout (if present) |
|                | `/content/index.md`                | Page content             |
|                | `/content/index.yaml`              | Page content             |
|                | `/content/index.json`              | Page content             |
|                | `/content/index.toml`              | Page content             |
|                | `/content/*` (regular files)       | Page assets              |
| Page(s)        | `/content/:slug/index.html`        | Page layout (if present) |
|                | `/content/:slug/index.md`          | Page content             |
|                | `/content/:slug/index.yaml`        | Page content             |
|                | `/content/:slug/index.json`        | Page content             |
|                | `/content/:slug/index.toml`        | Page content             |
|                | `/content/:slug/*` (regular files) | Page assets              |
|                |                                    |                          |

> _NOTE: files are listed in order of precedence._

## Pipeline

The HyperTemplates processing pipeline processes templates in five discrete stages:

* Include
* Validate
* Hydrate
* Render
* Publish

## Roadmap

🚧 HyperTemplates are a work in progress! 🚧

| **Stage**             | **Function**                                   | **Status** |
|-----------------------|------------------------------------------------|------------|
| **Include**           | Preprocess HTML imports (Server-side includes) |            |
| **Validate**          | HTML validation                                | v0.1.0     |
| **Hydrate**           | Markdown frontmatter processor                 | v0.1.0     |
|                       | Site data processor                            |            |
| **Render**            | Markdown processor                             | v0.1.0     |
|                       | Page processor                                 | v0.1.0     |
|                       | Feed processor                                 |            |
|                       | HTML linter                                    |            |
|                       | HTML validation                                | v0.1.0     |
| **Publish**           | Git publisher                                  |            |
|                       | SFTP publisher                                 |            |
|                       | S3 publisher                                   |            |
|                       | Cloudflare publisher                           |            |
|                       |                                                |            |

## Use Cases

* Static Site Generator (full builds)
* Static Site Incrementer (single page builds)
* Server-side rendering of static HTML pages
* Server-side rendering of human-readable "feed" pages (e.g. home page, tag pages, etc)
* Server-side rendering of machine-readable "feed" pages (e.g. RSS, Atom, etc)

<!-- Links -->
[HTML5 data attributes]: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*
[directory structure]: https://gohugo.io/getting-started/directory-structure/
[template lookup order]: https://gohugo.io/templates/lookup-order/
