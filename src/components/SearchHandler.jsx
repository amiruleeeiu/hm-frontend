import React from "react";
import { Button } from "reactstrap";
import { searchFieldsLength } from "./searchFields";

export default function SearchHandler({
  searchFields,
  searchTextFields,
  handleSearch,
  cancelSearch,
}) {
  return (
    <>
      {searchFieldsLength(searchFields, searchTextFields) > 0 ? (
        <th className="d-flex align-items-center">
          <Button className="me-2" color="info" onClick={handleSearch}>
            <span className="d-flex gap-2">
              <i className="bi bi-search"></i>
              Search
            </span>
          </Button>{" "}
          <Button className="btn btn-danger" onClick={cancelSearch}>
            <span className="d-flex gap-2">
              <i className="bi bi-x-circle"></i>Cancel
            </span>
          </Button>
        </th>
      ) : (
        <th></th>
      )}
    </>
  );
}
