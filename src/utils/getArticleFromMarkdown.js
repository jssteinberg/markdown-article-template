import getHtml from './getHtmlFromMarkdown.js';

/** (string='', [object]) - @return {object} article */
export default function (markdown = '', opt) {
	/** (string) - @return {string} HTML */
	const getHtmlFromMarkdown = (markdown) => {
		if (opt && opt.markedSetOptions)
			return getHtml(markdown, opt);

		return getHtml(markdown);
	};

	/** (string=''). Remove wrapping HTML tag. @return {string} of HTML */
	const getInlineHtmlStringFromMarkdownBlock = (text = '') =>
		getHtmlFromMarkdown(text).replace(/^<[^>]+>(.*)<\/[^>]+>$/g, '$1');

	/** (string|object[], [index=0]) - index for recursion - @return {object} */
	const getMetadata = (mdItems, index = 0) => {
		// Create array if not
		if (!(mdItems instanceof Array)) {
			// Split on start of line md list char (and whitespace)
			const dataMdLvl1 = mdItems
				.split(/\n[-*]\s+/); // First item may still be list with md-list-chars
			return dataMdLvl1.length ? getMetadata(dataMdLvl1): getMetadata([dataMdLvl1]);
		}

		// Return if item is undefined
		if (typeof mdItems[index] === 'undefined') return {};

		// If first item insn't list, it's author/by
		if (index === 0 && !mdItems[0].match(/^[-*]\s+/)) {
			return {
				by: mdItems[0].split(',').filter(x => !!x).map(x => x.trim()),
				...getMetadata(mdItems, index + 1)
			};
		}

		// Remove possible first item md list
		const prop = mdItems[index].replace(/^[-*]\s+([^]*)/, '$1');

		// Return rest of meta data properties
		return {
			...(function (prop) {
				const propKey = prop
					.replace(/([^:]+)[^]*/, '$1')
					.trim()
					.toLowerCase()
					.replace(/\s/g, '_');
				
				return {
					[propKey]: (
						// Add property value
						function (prop) {
							// Get value. If no ":" it's a true boolean
							const val = prop.match(/:/) ?
								prop.replace(/[^:]+:\s*(.*)/, '$1').trim().split(/\s*,\s*/)
								: "true";

							// If single value, return value, else return array of values
							if (val.length && val.length === 1) return val[0];
							else return val;
						}
					)(prop)
				};
			})(prop),
			...getMetadata(mdItems, index + 1)
		};
	};

	/** @const markdownBlocks - array of markdown text blocks.
	 *
	 * - trim() to remove leading empty lines or spaces.
	 * - `\n\n+`: the `+` to deal with more lines between blocks.
	 */
	const markdownBlocks = markdown.trim().split(/\n\n+/);

	/** (object[], [boolean=false], [number=0]) - @return {object} */
	const getArticleObject = (mdEls, i = 0) => {
		const getHeaderVals = (mdEl, elIndex) => {
			// Return title
			if (elIndex === 0)
				return { title: getInlineHtmlStringFromMarkdownBlock(mdEl) };
			// Return lead
			if (elIndex === 1)
				return { lead: getInlineHtmlStringFromMarkdownBlock(mdEl) };
		};

		// Recurse...
		if ( mdEls[i] && i < 2 ) {
			return {
				...getHeaderVals(mdEls[i], i),
				...getArticleObject(mdEls, i + 1)
			};

		} else if ( mdEls[i] ) {
			const remainingMd = mdEls.slice(i).join('\n\n');
			// Replace - hyphen – en-dash — em-dash, and retrieve values
			const bodyMd = remainingMd.replace(/([^]*)\n\n(-|–|—)+\n[^]*/, '$1');
			const footerDataMd = remainingMd.replace(/[^]*\n\n(-|–|—)+\n([^]*)/, '$2');
			// Else return body (last val so no need for spread)
			return {
				body: getHtmlFromMarkdown(bodyMd),
				...getMetadata(footerDataMd)
			};
		}

		return {};
	};

	return getArticleObject(markdownBlocks);
};
