import fs from 'fs';
import path from 'path';
import getObjectFromMarkdown from './getArticleFromMarkdown.js';

/** (''|[], any) - get prop val, even if deep - return any val */
const getValFromProp = (prop, val, index = 0) => {
	if (prop instanceof Array && prop.length > index) {
		const res = prop[index].split('.').reduce((acc, c) => acc && acc[c], val);
		if (!res) return getValFromProp(prop, val, index + 1);
		else return res;
	} else if (typeof prop === 'string')
		return prop.split('.').reduce((acc, c) => acc && acc[c], val);
};

/** (string, []) - return [] */
const getListSortedByString = (prop, arr) => arr.
	sort((a,b) => {
		// remove tags
		const getSortReadyString = (str) => str.toLowerCase().replace(/<[^>]+>/g, '');

		a = getSortReadyString(getValFromProp(prop, a));
		b = getSortReadyString(getValFromProp(prop, b));

		return a > b ? -1 : b > a ? 1 : 0;
	}).
	reverse();

/** (string, []) - return [] */
const getListSortedByDateString = (opt, arr) => arr.
	sort((a,b) => {
		const getSingleDateString = (val) => val instanceof Array ? val.slice(opt.sortBy.index ? opt.sortBy.index : 0)[0] : val;
		const aDate = getSingleDateString(
			getValFromProp(opt.sortBy.property, a)
		);
		const bDate = getSingleDateString(
			getValFromProp(opt.sortBy.property, b)
		);
		if (aDate && bDate) return new Date(bDate) - new Date(aDate);
		if (aDate) return -1;
		if (bDate) return 1;
		return 0;
	});

/** ([], {}) - return [] */
const getSortedArticles = (articles, opt) => {
	// Sort by title
	articles = getListSortedByString(
		articles[0].title.inlineHtml ?
			'title.inlineHtml'
			: 'title', articles
	);

	if (opt.sortBy) {
		return getListSortedByDateString(
			opt,
			articles
		);
	}

	return articles;
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
