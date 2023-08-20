export function isObjectValueExits(objOne, objTwo) {
	const { page: currentPage, limit: currentLimit, ...otherProperty } = objTwo;

	let textSeach = Object.values(otherProperty).filter(Boolean).length;
	if (textSeach) {
		return textSeach;
	}

	const { order_by_column, page, limit, ...restProperty } = objOne;

	if(page!=1 || limit!=10){
		restProperty.page=page
		restProperty.limit=limit
	}

	return Object.values(restProperty).filter(Boolean).length;
}

export function getUrlStrByObj(obj) {
	const valueExistItem = Object.keys(obj).filter((item) => obj[item]);
	let str = '?';
	valueExistItem.forEach((i) => {
		str += `${i}=${obj[i]}&`;
	});

	return str.slice(0, -1);
}