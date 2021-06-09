import getHtml from './getHtmlFromMarkdown.js';

/** (string) - return {object} */
export default function (markdown = '', opt = { longOutput: false }) {
	const regexLiLevel1 = /^-|\*\s/;
	const regexHr = /^([-*]\s?)+$/;

	const getHtmlFromMarkdown = (markdown) => {
		if (opt && opt.markedSetOptions)
			return getHtml(markdown, opt);

		return getHtml(markdown);
	};

	/** getInlineHtmlStringFromMarkdownBlock(string). Remove wrapping HTML tag. return {string} - HTML */
	const getInlineHtmlStringFromMarkdownBlock = (text = '') =>
		getHtmlFromMarkdown(text).replace(/^<[^>]+>(.*)<\/[^>]+>$/g, '$1');

	/** getHeaderMetadata(string) - recursive to get all values into one object - return {object} */
	const getHeaderMetadata = (mdItems, generated = false, index = 0) => {
		if (generated && mdItems[index + 1])
			return { ...mdItems[index], ...getHeaderMetadata(mdItems, true, index + 1) };
		if (generated)
			return { ...mdItems[index]}

		return getHeaderMetadata(
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
	 * @const markdownBlocks - array of markdown text blocks.
	 *
	 * - trim() to remove leading empty lines or spaces.
	 * - `\n\n+`: the `+` to deal with more lines between blocks.
	 */
	const markdownBlocks = markdown.trim().split(/\n\n+/);

	const getObjectList = (mdEls, longOutput = false, i = 0) => {
		const getFormattedInlineHtmlVal = (val, source, isLong) => isLong ? { inlineHtml: val, markdown: source } : val;
		const getFormattedHtmlVal = (val, source, isLong) => isLong ? { html: val, markdown: source } : val;
		const getHeaderRetVal = (mdEl, elIndex) => {
			// Return title
			if (elIndex === 0)
				return { title: getFormattedInlineHtmlVal( getInlineHtmlStringFromMarkdownBlock(mdEl), mdEl, longOutput ) };
			// Return subtitle, also set it to excerpt dependent on the template style
			if (elIndex === 1 && !mdEl.match(regexLiLevel1))
				return { deck: getFormattedInlineHtmlVal( getInlineHtmlStringFromMarkdownBlock(mdEl), mdEl, longOutput ) };
			// Return metadata (can be index 1)
			if (mdEl.match(regexLiLevel1))
				return getHeaderMetadata(mdEl);

			return { abstract: getFormattedHtmlVal( getHtmlFromMarkdown(mdEl), mdEl, longOutput ) };
		};

		// If next el not <hr>, recurse
		if ( mdEls[i] && !mdEls[i].match(regexHr) ) {
			const thisHeaderRetVal = getHeaderRetVal(mdEls[i], i);
			let restOfRetVals = getObjectList(mdEls, longOutput, i + 1);

			if ('abstract' in thisHeaderRetVal && !longOutput) {
				restOfRetVals['abstract'] = thisHeaderRetVal['abstract'] + (restOfRetVals['abstract'] || '');
				return { ...restOfRetVals };

			} else if ('abstract' in thisHeaderRetVal) {
				restOfRetVals['abstract'] = {
					html: thisHeaderRetVal['abstract'].html + (
						restOfRetVals['abstract'] && restOfRetVals['abstract'].html ? restOfRetVals['abstract'].html : ''
					),
					markdown: thisHeaderRetVal['abstract'].markdown + (
						restOfRetVals['abstract'] && restOfRetVals['abstract'].markdown ? `\n\n${restOfRetVals['abstract'].markdown}` : ''
					),
				};

				return { ...restOfRetVals };
			}

			return { ...thisHeaderRetVal, ...restOfRetVals };

		} else if ( mdEls[i] ) {
			const bodyEls = mdEls.slice(i + 1).join('\n\n');
			// Else return body (last val so no need for spread)
			return { body: getFormattedHtmlVal(getHtmlFromMarkdown(bodyEls), bodyEls, longOutput) };
		}
	};

	return getObjectList(markdownBlocks, opt.longOutput);
};
