# A Template Proposal For Markdown Articles

A template proposal for readable markdown articles (e.g. **blog posts**), without front-matter. Meta data looks a bit like YAML front-matter, but isn't quite the same. This template uses basic markdown syntax for an article header and its meta data. Readability in text-only and when it's rendered without specific HTML/CSS, for instance at Github, is the goal.

---

## The Template

```markdown
# Title

A subtitle or lead paragraph

- list items: of metadata
- a list of values: becomes, an, array

A an abstract of any markdown elements.

---

The content body in *normal* markdown.
```

*The horizontal rule separates the article header from the body content.*

Only the title is required.

## Proposal for generated data fields

- title
- deck
- ...metadata (key: value(s))
- abstract
- html

Abstract and html are the only properties that contains HTML flow elements. Title and deck can contain HTML phrasing elements.

## Simple implementation

See `src/utils/` for a simple Javascript implementation using the marked library and regex of both markdown and HTML strings.

Sapper is used here to test the implementation.

## About the sapper template

https://github.com/jssteinberg/sapper-floor-template

- The default Sapper template,
- updated to latest packages,
- accessible routing (A11yAppWrapper.svelte component),
- added postcss, postcss-import, svelte-preprocess and floor-typography-css,

...for setting up a [Sapper](https://github.com/sveltejs/sapper) project.

Uses Rollup as bundler.

## Running the code in development mode

```bash
cd my-app
npm install
npm run dev
```

This will start the development server on [localhost:3000](http://localhost:3000). Go to http://localhost:3000/posts.json for the implementation output.
