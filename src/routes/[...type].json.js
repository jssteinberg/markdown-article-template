import getObjectListFromMarkdownArticles from '../utils/getMarkdownArticles.js';

export async function get(req, res) {
	const {type} = req.params;
	const isFile = type[0].match(/\..+$/);
	const data = isFile ?
		getObjectListFromMarkdownArticles(`./`)
		: getObjectListFromMarkdownArticles(`${type[0]}/`);

	if (data) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(isFile ? data.find(val => val.file === type[0]) : data));
	} else {
		res.writeHead(404, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify([]));
	}
}
