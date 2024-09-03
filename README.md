# HyperTemplates

HyperTemplates are a pure-HTML templating engine.

```html
<!DOCTYPE html>
<html>
    <head>
        <!-- Browser Metadata -->
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes' />

        <!-- Page Metadata -->
        <title data-ht-content='title'>HyperTemplates</title>
        <meta name='description' content='A pure-HTML templating engine for the modern web.' data-ht-attr-content='page.description,site.description' />
        <link rel='canonical' href='https://hypertemplates.com' data-ht-attr-href='canonical' />
        <link rel='icon' type='image/jpeg' sizes="32x32" href='/favicon.ico' data-ht-attr-href='favicon' />

        <!-- CSS -->
        <link rel='stylesheet' href='/theme/css/index.css' data-ht-attr-href='stylesheet' />

        <!-- JS -->
        <script defer="" src="/index.js" type="module" data-ht-attr-src='javascript'></script>

        <!-- Data -->
        <meta data />
        <meta itemprop='foo' content='bar'>
    </head>
    <body>
        <section id='nav'>
            <!-- site navigation -->
        </section>
        <section id='hero'>
            <h1 data-ht-content='title'>HyperTemplates</h1>
            <p data-ht-content='description'>HyperTemplates are a pure-HTML templating engine.</p>
        </section>
        <section id='content' data-ht-content='article'>
            <!-- page content -->
        </section>
        <section id='footer'>
            <div class='' data-ht-content-for='featured-tags'>
                <a href='/tags/example' data-ht-attr-href='url'>
                    <span data-ht-content='name'>Example</span>
                </a>
            </div>
        </section>
    </body>
</html>
```

## How it works

HyperTemplates uses [HTML5 data attributes] as template instructions.

* `data-ht-attr-<attribute>=<[scope.key]>`

  Creates a slot for an HTML element attribute, overwriting the current attribute value (if present).

* `data-ht-content=<[scope.key]>`

  Creates a slot for an HTML element's content (i.e. `innerHTML`), overwriting the current contents (if present).

* `data-ht-content-if=<[scope.key]>`

  Creates a slot for a conditional HTML element, removing the element if the key is not present.

* `data-ht-content-for=<[scope.key]>`

  Creates a slot for a collection of HTML elements, repeating all nested HTML elements once per item in the collection.

HyperTemplates consumes data from Markdown (frontmatter), JSON/YAML, and HTML (itemprop) files to hydrate data objects with three top-level keys: `site`, `feeds`, and `page`:

```javascript
{
    site: {
        baseURL: "",
        title: "",
        description: "",
        author: {
            name: "",
            url: "",
        },
        metadata: {},
    },
    feeds: {
        default: {
            baseURL: "",
            title: "",
            description: "",
            tags: [],
            metadata: {},
        },
        blog: {
            baseURL: "/blog",
            title: "Blog",
            description: "My Blog",
            tags: [],
            metadata: {},
        }
    },
    page: {
        created_at: "2024-09-02T10:00:00-07:00",
        modified_at: "2024-09-02T10:00:00-07:00",
        draft: false,
        feed: false,
        canonical_url: "",
        title: "",
        description: "",
        summary: "",
        tags: [],
        content: "", // HTML
        metadata: {},
    },
}
```

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
