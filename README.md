# Pretty-readable: Complete articles in plain-text markdown

A proposal for how to format markdown articles (e.g. **blog posts**) so their readable in their plain-text form **and** can output the necessary meta data without e.g. YAML front matter. This expands upon [markdown's original concept of readable plain-text files](https://daringfireball.net/projects/markdown/syntax#philosophy).


```markdown
# Markdown Article Title

Nicely formatted markdown articles---nice & readable in its plain-text form.

Body content in normal markdown.

---
Johan S. Steinberg
* Tagged: markdown, article, template, api, proposal, markdown-article-template, markdown-post-template
```

Meta data is added without YAML front matter (YFM) in a more markdowny way. It's reminiscent of a simple YFM, but it's valid markdown, and a more natural part of a markdown file.

**The goal** is a markdown file-template for complete articles, including meta data, that is as readable as possible in plain-text and when it's rendered without specific HTML/CSS (for instance at Github). And with a possible (Javascript, JSON, Graphql, ...) output that is fully usable in an application of any kind.

---

*Why not standard YFM/front-matter?* YAML front matter (or separated front matter in general) has become the standard for meta data of markdown articles and blog posts. There are two problems with that:

1. It's not markdown and not a natural part of the text-only markdown content.
2. When the file is parsed in a generic context, front-matter is often output as a table at the top of the article (at Github for instance), or not parsed correctly. Generating bad, less readable HTML, or errors.


## Markdown Template Proposal

```markdown
# Title

A lead paragraph.

The content body in normal markdown.

---
Optional Author Name,
Several Names Separated By Comma
* unordered list item: meta data
* key: single value
* comma separated: array, of, values
* no value---true boolean,
```

The article ends with an horizontal rule immediately followed by the additional (meta) data.

The meta data (which is in the unordered list below the horizontal rule) only support strings and arrays containing the former. The language in question must cast to other types if needed.


## Output

JSON output:

```json
{
  "title": "Title",
  "lead": "A lead paragraph.",
  "body": "<p>The content body in normal markdown.</p>",
  "by": ["Optional Author Name", "Several Names Separated By Comma"],
  "unordered list item": "meta data",
  "key": "single value",
  "comma_separated": ["array", "of", "values"],
  "no_value---true_boolean": "true"
}
```


## The Subtitle Option

```markdown
# Title: Subtitle

A lead paragraph.

The content body in normal markdown.

---
Optional Author Name,
Several Names Separated By Comma
* unordered list item: meta data
* key: single value
* comma separated: array, of, values
* no value---true boolean,
```


## The Abstract Option

An option to treat all markdown elements after the lead paragraph and before the first horizontal rule as the abstract.

```markdown
# Title: Subtitle

A lead paragraph.

An abstract consisting of any markdown elements.

---

The content body in normal markdown.

---
Optional Author Name,
Several Names Separated By Comma
* unordered list item: meta data
* key: single value
* comma separated: array, of, values
* no value---true boolean,
```


## Simple implementation

*Under construction! At the moment [Sapper](https://github.com/jssteinberg/sapper-floor-template) is used to test the implementation.*

See [src/utils/](https://github.com/jssteinberg/markdown-article-template/tree/main/src/utils) for a simple Javascript implementation using the marked library and regex of both markdown and HTML strings to create the output for an API.

Boolean and numbers are both output as strings.

A collection of articles is by default sorted by title, then overridden by `sortBy`. So if any articles are missing a sortBy property they are moved to the end in order by title.

`sortBy`:

- `type`: a string of [Javascript type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures) (it can be lowercase)

```javascript
// How to use utils!
// `opt` parameter
const opt = {
	markedSetOptions: {
		smartLists: true,
		smartypants: true,
		highlight: function(code, lang) {
			return hljs.highlight(code, {language: lang}).value;
		}
	},
	sortBy: {
		property: ['edited', 'redigert'],
		type: 'date',
		index: -1,
	},
	// longOutput: true,
};
```


[phrasing]: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#phrasing_content
[org]: https://daringfireball.net/projects/markdown/syntax#philosophy


---
Johan S. Steinberg

* Tagged: markdown, article, template, api, proposal, markdown-article-template, markdown-post-template
