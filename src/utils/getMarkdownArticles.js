import fs from 'fs';
import path from 'path';
import getObjectFromMarkdown from './getArticleFromMarkdown.js';
import getSortedArticles from './getSortedListFromArticles.js';

/** (string, object[], object, [number=0]) - @return {object[]} */
const getObjectListFromMarkdownFiles = (folder, files, opt, index = 0) => {
	const rawFile = fs.readFileSync(path.resolve(folder, files[index]), 'utf8');
	const res = [{'file': files[index], ...getObjectFromMarkdown(rawFile, opt)}];

	// return if no more files, else loop recursively
	if (typeof files[index + 1] === 'undefined') return res;
	return res.concat(getObjectListFromMarkdownFiles(folder, files, opt, (index + 1)));
};

/** (string, [object]) - @return {object[]} */
export default function (folder, opt) {
	if (!opt.longOutput) opt.longOutput = false;

	try {
		// get all *.md files
		let files = fs.
			readdirSync(folder).
			filter(filename => {
				if (path.extname(filename) === '.md') return true;
				if (opt.inFolder && !filename.match(/^[._]/)) return true;
				return false;
			});

		if (opt.inFolder) files.forEach((el, i) => {
			if (!el.match(/\.md$/))
				files[i] = files[i].replace(/\/$/, '') + '/index.md';
		});

		return getSortedArticles(
			getObjectListFromMarkdownFiles(folder, files, opt),
			opt
		);
	} catch (error) {
		console.log(error);
		return [];
	}
};
