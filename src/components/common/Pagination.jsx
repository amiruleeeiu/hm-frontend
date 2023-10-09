/* eslint-disable react/prop-types */
import React from "react";
import { Col, Input, Row } from "reactstrap";

function Pagination({
  total,
  perPage,
  setPerPage,
  currentPage,
  setCurrentPage,
  isPageShow = true,
}) {
  const page = Math.ceil(total / perPage);
  const handlePage = (e) => {
    e.preventDefault();

    setPerPage(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Row className="justify-content-md-end justify-content-center align-items-center mt-3">
      <Col lg="7">
        {isPageShow && (
          <p className="mb-0">
            Showing {(currentPage - 1) * perPage + 1} to{" "}
            {currentPage * perPage < total ? currentPage * perPage : total} of{" "}
            {total} items
          </p>
        )}
      </Col>
      <Col lg="5" className="col-md-auto d-none d-md-block">
        <div
          className="d-flex justify-content-between"
          style={{ float: "right" }}
        >
          {total >= perPage && (
            <div className="d-flex justify-content-center align-items-center bg-light rounded">
              <button
                className={`pagination-btn ${
                  currentPage != 1 && "pagination-btn-hover"
                }`}
                onClick={() => setCurrentPage(1)}
                style={{ border: "none" }}
                disabled={currentPage == 1}
              >
                {"|<"}
              </button>
              <button
                className={`pagination-btn ${
                  currentPage != 1 && "pagination-btn-hover"
                }`}
                onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                disabled={currentPage == 1}
              >
                {"<"}
              </button>
              {currentPage - 1 > 1 && (
                <button
                  className="pagination-btn pagination-btn-hover"
                  onClick={() => setCurrentPage((prevPage) => prevPage - 2)}
                >
                  ...
                </button>
              )}
              {currentPage > 1 && (
                <button
                  className="pagination-btn pagination-btn-hover"
                  onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                >
                  {currentPage - 1}
                </button>
              )}
              <button className="pagination-btn pagination-btn-hover bg-success text-light">
                {currentPage}
              </button>
              {currentPage < page && (
                <button
                  className="pagination-btn pagination-btn-hover"
                  onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                >
                  {currentPage + 1}
                </button>
              )}
              {currentPage + 1 < page && (
                <button
                  className="pagination-btn pagination-btn-hover"
                  onClick={() => setCurrentPage((prevPage) => prevPage + 2)}
                >
                  ...
                </button>
              )}
              <button
                className={`pagination-btn ${
                  currentPage != page && "pagination-btn-hover"
                }`}
                onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                disabled={page == currentPage}
              >
                {">"}
              </button>
              <button
                className={`pagination-btn ${
                  currentPage != page && "pagination-btn-hover"
                }`}
                onClick={() => setCurrentPage(page)}
                disabled={page == currentPage}
              >
                {">|"}
              </button>
            </div>
          )}
          &nbsp;
          {isPageShow && (
            <Input
              value={perPage}
              onChange={(e) => handlePage(e)}
              type="select"
              style={{ width: "70px", float: "right" }}
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Input>
          )}
        </div>
      </Col>
    </Row>
  );
}

// data={meta?.total ?? 0}
// label='items'
// setCurrentPage={handlePagination}
// currentPage={currentPage}
// perPage={meta?.per_page ? parseInt(meta?.per_page) : limit}
// setPerPage={setLimit}

export default Pagination;
