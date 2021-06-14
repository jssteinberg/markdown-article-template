import fs from 'fs';
import path from 'path';
import getObjectFromMarkdown from './getArticleFromMarkdown.js';

const getSortedArticles = (articles, opt) => {
	const getListSortedByString = (prop, arr) => arr.
		sort((a,b) => {
			// remove tags
			const getSortReadyString = (str) => str.toLowerCase().replace(/<[^>]+>/g, '');
			// get prop val, even if deep
			const getProp = (prop, val) => prop.split('.').reduce((acc, c) => acc && acc[c], val);

			a = getSortReadyString(getProp(prop, a));
			b = getSortReadyString(getProp(prop, b));

			return a > b ? -1 : b > a ? 1 : 0;
		}).
		reverse();

	// Sort by title
	articles = getListSortedByString(articles[0].title.inlineHtml ? 'title.inlineHtml' : 'title', articles);

	if (opt.sortBy) {
		return articles
			// .sort ...
	}

	return articles;
		// Sort by opt prop
};

/** (string, object[], object[, number=0]) - return [] */
const getObjectListFromMarkdownFiles = (folder, files, opt, index = 0) => {
	const rawFile = fs.readFileSync(path.resolve(folder, files[index]), 'utf8');
	const res = [{'file': files[index], ...getObjectFromMarkdown(rawFile, opt)}];

	// return if no more files, else iterate recursively
	if (typeof files[index + 1] === 'undefined') return res;
	else return res.concat(getObjectListFromMarkdownFiles(folder, files, opt, (index + 1)));
};

/** (string[, object]) - return [] */
export default function (folder, opt = {longOutput: false, sortBy: null}) {
	if (!opt.longOutput) opt.longOutput = false;

	try {
		// get all *.md files
		const files = fs.
			readdirSync(folder).
			filter(filename => path.extname(filename) === '.md');

		return getSortedArticles(
			getObjectListFromMarkdownFiles(folder, files, opt), opt
		);
	} catch (error) {
		console.log(error);
		return [];
	}
};
