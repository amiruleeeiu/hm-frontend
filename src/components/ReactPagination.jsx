import React from "react";
import { Input, Pagination, PaginationItem, PaginationLink } from "reactstrap";

export default function ReactPagination({
  total,
  page,
  limit,
  setPage,
  setLimit,
}) {
  const pages = () => {
    let n = [];
    for (let i = 0; i < total / limit; i++) {
      n.push(i + 1);
    }
    return n;
  };

  return (
    <div className="d-flex align-items-center justify-content-between mt-2">
      <div>Total number of {total} doctors</div>
      <div className="d-flex align-items-center justify-content-center">
        <Pagination aria-label="Page navigation example">
          <PaginationItem>
            <PaginationLink first href="#" onClick={() => setPage(1)} />
          </PaginationItem>
          {page === 1 ? (
            <PaginationItem disabled>
              <PaginationLink
                href="#"
                previous
                onClick={() => setPage(page - 1)}
              />
            </PaginationItem>
          ) : (
            <PaginationItem>
              <PaginationLink
                href="#"
                previous
                onClick={() => setPage(page - 1)}
              />
            </PaginationItem>
          )}

          {pages().map((item) => {
            if (item === page) {
              return (
                <PaginationItem active>
                  <PaginationLink href="#">{item}</PaginationLink>
                </PaginationItem>
              );
            } else {
              return (
                <PaginationItem>
                  <PaginationLink onClick={() => setPage(item)}>
                    {item}
                  </PaginationLink>
                </PaginationItem>
              );
            }
          })}

          {page !== pages().length ? (
            <PaginationItem>
              <PaginationLink
                href="#"
                previous
                onClick={() => setPage(page + 1)}
              />
            </PaginationItem>
          ) : (
            <PaginationItem disabled>
              <PaginationLink
                href="#"
                previous
                onClick={() => setPage(page + 1)}
              />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink
              href="#"
              last
              onClick={() => setPage(pages()?.length)}
            />
          </PaginationItem>
        </Pagination>
        <Input
          name="select"
          onChange={(e) => {
            setLimit(e.target.value);
            setPage(1);
          }}
          className="form-select ms-2 mb-3"
          value={limit}
          type="select"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </Input>
      </div>
    </div>
  );
}
