import marked from 'marked';

/** (markdown string) - return string of HTML */
export default function (markdown, opt = { inline: false }) {
	const renderer = new marked.Renderer();

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
