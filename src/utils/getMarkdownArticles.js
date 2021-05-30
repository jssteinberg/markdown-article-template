import fs from 'fs';
import path from 'path';
import getObjectFromMarkdown from './getMarkdownArticle.js';

/** getObjectListFromMdFiles(string, string, [number=0]) - return [] */
const getObjectListFromMdFiles = (folder, files, index = 0) => {
	const rawFile = fs.readFileSync(path.resolve(folder, files[index]), 'utf8');
	const res = [getObjectFromMarkdown(rawFile)];

	// return if no more files, else iterate recursively
	if (typeof files[index + 1] === 'undefined') return res;
	else return res.concat(getObjectListFromMdFiles(folder, files, (index + 1)));
};

/** getObjectListFromFolderOfMd(string) - return [] */
export default function (folder) {
	try {
		// get all *.md files
		const files = fs.
			readdirSync(folder).
			filter(filename => path.extname(filename) === '.md');

		return getObjectListFromMdFiles(folder, files);//.
			// sort((a,b) => new Date(b.date) - new Date(a.date));
	} catch (error) {
		console.log(error);
		return [];
	}
};
