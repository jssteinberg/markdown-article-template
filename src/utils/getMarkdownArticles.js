import fs from 'fs';
import path from 'path';
import getObjectFromMarkdown from './getArticleFromMarkdown.js';

/** getObjectListFromMarkdownFiles(string, [], {}, [number=0]) - return [] */
const getObjectListFromMarkdownFiles = (folder, files, opt, index = 0) => {
	const rawFile = fs.readFileSync(path.resolve(folder, files[index]), 'utf8');
	const res = [{'file': files[index], ...getObjectFromMarkdown(rawFile, opt)}];

	// return if no more files, else iterate recursively
	if (typeof files[index + 1] === 'undefined') return res;
	else return res.concat(getObjectListFromMarkdownFiles(folder, files, opt, (index + 1)));
};

/** (string, [{longOutput: boolean}]) - return [] */
export default function (folder, opt = { longOutput: false }) {
	try {
		// get all *.md files
		const files = fs.
			readdirSync(folder).
			filter(filename => path.extname(filename) === '.md');

		return getObjectListFromMarkdownFiles(folder, files, opt);//.
			// sort((a,b) => new Date(b.date) - new Date(a.date));
	} catch (error) {
		console.log(error);
		return [];
	}
};
