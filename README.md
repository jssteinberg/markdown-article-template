# Template proposal for articles in Markdown

Nicely formatted, readable markdown articles!

---

```markdown
# Title

A subtitle or lead paragraph

- unordered list item: metadata
- key: single value
- comma separated: array, of, values
- no value---true boolean,

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

  "unordered list item": "metadata",
  "key": "single value",
  "comma separated": ["array", "of", "values"],
  "no value---true boolean" : true,

  "abstract": "<p>An abstract of any markdown elements.</p>",

  "body": "<p>The content body in <em>normal</em> markdown.</p>"
}
```

## Background

A file template proposal for readable markdown-only articles (e.g. **blog posts**). It should of course be parseable to HTML as well. Metadata is added without YAML front matter (YFM) in a more markdowny way. It looks a bit like YFM, but is markdown, is simpler, and a more natural part of the article. It's all basic markdown.

**The goal** is a markdown template for complete articles including metadata that is as readable as possible as markdown-only, and when it's rendered without specific HTML/CSS (for instance at Github). And with a possible output that is fully usable in an application of any kind.

*Why not standard YFM/front-matter?* YAML front matter (or separated front matter in general) has become the standard for metadata of markdown articles and blog posts. There are two problems with that:

1. It's not markdown and not a natural part of the text-only markdown content.
2. If not taken into account when parsing markdown, front-matter is often parsed as a table at the top of the article (at Github for instance), or not parsed correctly. Generating bad, less readable HTML.

## Output explanation

Generated key names and values:

- title: A string that can contain inline HTML [HTML phrasing elements][phrasing].
- deck: A string that can contain inline HTML.
- [metadata key]: value(, or values)
- abstract: A string of HTML from markdown before first horizontal rule, after deck and/or metadata.
- body: A string of HTML from markdown after first horizontal rule.

There's also an outline for a long output version:

```json
{
	"title": {
		"inlineHtml": "Title",
		"markdown": "# Title"
	},

	"deck": {
		"inlineHtml": "A subtitle or lead paragraph",
		"markdown": "A subtitle or lead paragraph"
	},

	"unordered list item": "metadata",
	"key": "single value",
	"comma separated": ["value", "array"],
	"no value---true boolean" : true,

	"abstract": {
		"html": "<p>An abstract of any markdown elements.</p>",
		"markdown": "An abstract of any markdown elements."
	},

	"body": {
		"html": "<p>The content body in <em>normal</em> markdown.</p>",
		"markdown": "The content body in *normal* markdown."
	}
}
```

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
