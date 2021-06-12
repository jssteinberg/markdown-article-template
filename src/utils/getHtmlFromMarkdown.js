import marked from 'marked';

/** return string of HTML from string of markdown
	* @param {string} markdown
	* @param {object} opt
	* @returns {string} - html */
export default function (markdown, opt) {
	const renderer = new marked.Renderer();

	if (!opt.inline) opt.inline = false;

	if (opt && opt.markedSetOptions)
		marked.setOptions(opt.markedSetOptions);
	else
		marked.setOptions({
			smartLists: true,
			smartypants: true,
		});

	if (opt && opt.inline)
		return marked.parseInline(markdown, { renderer });

	return marked(markdown, { renderer }).trim();
};
