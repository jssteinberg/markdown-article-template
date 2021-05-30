# A File Template Proposal For Articles in Markdown

Nicely formatted, readable markdown articles!

---

This is a proposal for a file template for readable text-only, markdown articles (e.g. **blog posts**). It should of course be parseable to HTML as well. Metadata is added without YAML front matter (YFM) in a more markdowny way. It looks a bit like YFM, but is markdown, is simpler, and a more natural part of the article. It's all basic markdown.

The goal is a template for a full article in pure markdown that is as readable as possible as text-only and when it's rendered without specific HTML/CSS (for instance at Github). And with a possible output that is fully usable in an application of any kind.


## Markdown file

```markdown
# Title

A subtitle or lead paragraph

- unordered list item: metadata
- key: single value
- comma list: value, array

An abstract of any markdown elements.

---

The content body in *normal* markdown.
```

*The horizontal rule separates the article header from the body content.*

Only the title is required.

JSON output:

```json
{
  "title": "Title",

  "deck": "A subtitle or lead paragraph",

  "unordered list items": "metadata",
  "key": "single value",
  "comma list": ["value", "array"],

  "abstract": "<p>An abstract of any markdown elements.</p>",

  "body": "<p>The content body in <em>normal</em> markdown.</p>"
}
```

## Output explanation

Generated key names and values:

- title: A string that can contain [HTML phrasing elements][phrasing] (markdown inline markup).
- deck: A string that can contain [HTML phrasing elements][phrasing].
- [metadata key]: value(, or values)
- abstract: A string of HTML from markdown before first horizontal rule, after deck and/or metadata.
- body: A string of HTML from markdown after first horizontal rule.

## Simple implementation

See [src/utils/](https://github.com/jssteinberg/markdown-article-template/tree/main/src/utils) for a simple Javascript implementation using the marked library and regex of both markdown and HTML strings.

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

```sh
npm install
npm run dev
```

This will start the development server on [localhost:3000](http://localhost:3000). Go to http://localhost:3000/posts.json for the implementation output.

[phrasing]: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#phrasing_content
