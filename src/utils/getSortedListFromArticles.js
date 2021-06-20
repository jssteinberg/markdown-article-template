/** (''|[], any) - get prop val, even if deep - @return {any} val */
const getValFromProp = (prop, val, index = 0) => {
	if (prop instanceof Array && prop.length > index) {
		const res = prop[index].split('.').reduce((acc, c) => acc && acc[c], val);
		if (!res) return getValFromProp(prop, val, index + 1);
		else return res;
	} else if (typeof prop === 'string')
		return prop.split('.').reduce((acc, c) => acc && acc[c], val);
};

/** ('', []) - @return {object[]} */
const getListSortedByString = (arr, sortByProp) => arr.
	sort((a,b) => {
		// remove tags
		const getSortReadyString = (str) => typeof str === 'string' ? str.toLowerCase().replace(/<[^>]+>/g, '') : str;

		a = getSortReadyString(getValFromProp(sortByProp, a));
		b = getSortReadyString(getValFromProp(sortByProp, b));

		return a > b ? -1 : b > a ? 1 : 0;
	}).
	reverse();

/** ('YYYY-MM-DD[...]', []) - @return {object[]} */
const getListSortedByDateString = (list, sortBy) => list.
	sort((a,b) => {
		const getSingleDateString = (val) => val instanceof Array ?
			val.slice(sortBy.index ? sortBy.index : 0)[0]
			: val;
		const aDate = getSingleDateString(
			getValFromProp(sortBy.property, a)
		);
		const bDate = getSingleDateString(
			getValFromProp(sortBy.property, b)
		);
		if (aDate && bDate) return new Date(bDate) - new Date(aDate);
		if (aDate) return -1;
		if (bDate) return 1;
		return 0;
	});

/** ([], {}) - @return {object[]} */
const getListSortedByType = (list, sortBy) => {
	if (
		sortBy.type
		&& sortBy.type.toLowerCase() == 'date'
	) return getListSortedByDateString(
		list,
		sortBy
	);

	return getListSortedByString(
		list,
		sortBy.property
	);
};

/** ([], {}, [number]) - recursive if sortBy is [] - @return {object[]} */
const getSortedListFromSortBy = (list, sortBy, i) => {
	// if sortBy is array, recursive
	if (
		sortBy instanceof Array
		&& sortBy.length
		&& (typeof i === 'undefined' || i > -1)
	) {
		const getI = (sub) => typeof i === 'number' ? i - (sub - 1) : sortBy.length - sub;
		return getSortedListFromSortBy(
			getListSortedByType(
				list,
				sortBy[getI(1)]
			),
			sortBy,
			getI(2)
		);
	}
	// if sortBy is object
	else if (
		sortBy instanceof Object
		&& !sortBy.length
	) {
		return getListSortedByType(
			list,
			sortBy
		);
	} else {
		return list;
	}
};

/** ([], {}) - @return {object[]} */
export default function (articles, opt) {
	const {longOutput, sortBy} = opt;
	// Sort by title
	articles = getListSortedByString(
		articles,
		longOutput ?  'title.inlineHtml' : 'title'
	);

	if (sortBy) return getSortedListFromSortBy(articles, sortBy);

	return articles;
};
