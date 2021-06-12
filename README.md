# Markdown Article Template Proposal

Nicely formatted, readable markdown articles, when reading them in plain-text markdown

---

```markdown
# Markdown Article Template Proposal

Nicely formatted, readable markdown articles, when reading them in plain-text markdown

- Author: Johan S. Steinberg
- #: markdown, article, template, api, proposal

---
```

A file template proposal for readable markdown-only articles (e.g. **blog posts**). Metadata is added without YAML front matter (YFM) in a more markdowny way. It looks a bit like YFM, but is markdown, is simpler, and a more natural part of the article. It's all basic markdown, which of course is parseable as HTML as well.

**The goal** is a markdown template for complete articles including metadata that is as readable as possible as markdown-only, and when it's rendered without specific HTML/CSS (for instance at Github). And with a possible output that is fully usable in an application of any kind.

---

*Why not standard YFM/front-matter?* YAML front matter (or separated front matter in general) has become the standard for metadata of markdown articles and blog posts. There are two problems with that:

1. It's not markdown and not a natural part of the text-only markdown content.
2. When the file is parsed in a generic context, front-matter is often output as a table at the top of the article (at Github for instance), or not parsed correctly. Generating bad, less readable HTML, or errors.

## Markdown Template Proposal

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

The metadata (which is in the unordered list above the horizontal rule) only support strings and arrays containing the former. The language in question must cast to other types if needed.

## Output

JSON output:

```json
{
  "title": "Title",

  "deck": "A subtitle or lead paragraph",

  "unordered list item": "metadata",
  "key": "single value",
  "comma_separated": ["array", "of", "values"],
  "no_value---true_boolean": "true",

  "abstract": "<p>An abstract of any markdown elements.</p>",

  "body": "<p>The content body in <em>normal</em> markdown.</p>"
}
```

Generated key names and values:

- title: A string that can contain inline HTML [HTML phrasing elements][phrasing].
- deck: A string that can contain inline HTML.
- [metadata key]: value(, or values)
- abstract: A string of HTML from markdown before first horizontal rule, after deck and/or metadata.
- body: A string of HTML from markdown after first horizontal rule.

*Optional long output version:*

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
	"comma_separated": ["value", "array"],
	"no_value---true_boolean": "true",

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

See [src/utils/](https://github.com/jssteinberg/markdown-article-template/tree/main/src/utils) for a simple Javascript implementation using the marked library and regex of both markdown and HTML strings to create the output for an API.

Boolean and numbers are both output as strings.

*[Sapper](https://github.com/jssteinberg/sapper-floor-template) is used here to test the implementation.*

[phrasing]: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#phrasing_content
