import getObjectListFromFolderOfMd from '../utils/getMarkdownArticles.js';

export async function get(req, res) {
	const data = getObjectListFromFolderOfMd('posts/', {
		longOutput: true,
		markedSetOptions: {
			smartLists: true,
			smartypants: true,
		},
	});

	if (data) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(data));
	} else {
		res.writeHead(404, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ message: `Not found` }));
	}
}
