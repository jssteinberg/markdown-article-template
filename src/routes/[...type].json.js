import getObjectListFromMarkdownArticles from '../utils/getMarkdownArticles.js';
import hljs from 'highlight.js';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
hljs.registerLanguage('json', json);
hljs.registerLanguage('markdown', markdown);

export async function get(req, res) {
	const {type} = req.params;
	const isFile = type[0].match(/\..+$/);

	// How to use utils!
	const opt = {
		markedSetOptions: {
			smartLists: true,
			smartypants: true,
			highlight: function(code, lang) {
				return hljs.highlight(code, {language: lang}).value;
			}
		},
		sortBy: {
			property: ['edited', 'redigert'], // index > 0: fallback properties
			type: 'date',
			index: -1, // index to use for sorting in properties that are arrays
		},
		inFolder: true,
		// longOutput: true,
		// sortBy: [
		// 	{
		// 		property: ['edited', 'redigert'],
		// 		type: 'date',
		// 		index: -1, // index to use for sorting in properties that are arrays
		// 	},
		// 	{
		// 		property: ['me_then?'],
		// 		type: 'number',
		// 	},
		// ],
	};
	const data = isFile ?
		getObjectListFromMarkdownArticles(`./`, opt)
		: getObjectListFromMarkdownArticles(`${type[0]}/`, opt);

	if (data) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(isFile ? data.find(val => val.file === type[0]) : data));
	} else {
		res.writeHead(404, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify([]));
	}
}
