import marked from 'marked';

/** (string, object) - return string of HTML from string of markdown */
export default function (markdown, opt) {
	const renderer = new marked.Renderer();

	if (!opt.inline) opt.inline = false;

	console.log(opt);

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
