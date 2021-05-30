import marked from 'marked';

/** getHtmlFromMarkdown(string) - return string of HTML */
const getHtmlFromMarkdown = (markdown, opt) => {
	const renderer = new marked.Renderer();

	marked.setOptions({
		smartLists: true,
		smartypants: true,
	});

	if (opt && opt.inline)
		return marked.parseInline(markdown, { renderer });

	return marked(markdown, { renderer }).trim();
};

/** (string) - return {object} */
export default function (markdown = '') {
	const regexLiLevel1 = /^-|\*\s/;
	const regexHr = /^([-*]\s?)+$/;
	/** getTitle(string) - (and subtitle). Keep inline html. return {string} - HTML */
	const getTitle = (text) => getHtmlFromMarkdown(text).replace(/^<[^>]+>(.*)<\/[^>]+>$/, '$1');
	/** getMetadata(string) - recursive to get all values into one object - return {object} */
	const getMetadata = (mdItems, generated = false, index = 0) => {
		if (generated && mdItems[index + 1])
			return { ...mdItems[index], ...getMetadata(mdItems, true, index + 1) };
		if (generated)
			return { ...mdItems[index]}

		return getMetadata(
			mdItems.
				split('\n').
				filter(x => x.match(/^\s*[-*]\s*.+:\s*.+/)).
				map((mdItem) => {
					let res = {};

					res[mdItem.replace(/[-|*]\s*([^:]+)[^]*/, '$1').trim().toLowerCase()] = (() => {
						const val = mdItem.replace(/[-|*][^:]+:(.*)/, '$1').trim().split(/\s*,\s*/);

						/* If single value, return value, else return array of values */
						if (val.length === 1) return val[0];
						else return val;
					})();

					return res;
				}),
			true
		);
	};

	/**
	 * @const textBlocks - array of text blocks.
	 *
	 * - trim() to remove leading empty lines or spaces.
	 * - \n+ to deal with more lines between blocks.
	 */
	const textBlocks = markdown.trim().split(/\n\n+/);

	const getObjectList = (mdEls, i = 0) => {
		const getHeaderRetVal = (mdEl, elIndex) => {
			// Return title
			if (elIndex === 0)
				return { title: getTitle(mdEl) };
			// Return subtitle, also set it to excerpt dependent on the template style
			if (elIndex === 1 && !mdEl.match(regexLiLevel1))
				return { deck: getTitle(mdEl) };
			// Return metadata (can be index 1)
			if (mdEl.match(regexLiLevel1))
				return getMetadata(mdEl);

			return { abstract: getHtmlFromMarkdown(mdEl) };
		};

		// If next el not <hr>, recurse
		if ( mdEls[i] && !mdEls[i].match(regexHr) ) {
			const thisHeaderRetVal = getHeaderRetVal(mdEls[i], i);
			let restOfRetVals = getObjectList(mdEls, i + 1);

			if ('abstract' in thisHeaderRetVal) {
				restOfRetVals['abstract'] = thisHeaderRetVal['abstract'] + (restOfRetVals['abstract'] || '');
				return { ...restOfRetVals };
			}

			return { ...thisHeaderRetVal, ...restOfRetVals };

		} else if ( mdEls[i] ) {
			// else return body (last val so no need for spread)
			return { body: getHtmlFromMarkdown(mdEls.slice(i + 1).join('\n\n')) };
		}
	};

	return getObjectList(textBlocks);
};
