export const searchKeys = (searchFields) =>
  Object.keys(searchFields).filter((key) => searchFields[key]);

export const searchFieldsLength = (searchFields, searchTestFields) => {
  const { page, limit,...fields } = searchFields;

  if (page === 1 && limit === 10) {
    if (searchKeys(fields).length > 0) {
      return searchKeys(fields).length;
    } else {
      return searchKeys(searchTestFields).length;
    }
  } else {
    if (searchKeys(searchFields).length > 0) {
      return searchKeys(searchFields).length;
    } else {
      return searchKeys(searchTestFields).length;
    }
  }
};

export const searchUrl = (fields) =>
  searchKeys(fields)
    .map((i) => {
      if (i === "page" || i === "limit") {
        return `_${i}=${fields[i]}`;
      } else {
        return `${i}=${fields[i]}`;
      }
    })
    .join("&");
