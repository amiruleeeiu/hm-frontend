import React from "react";
import { Link } from "react-router-dom";

export default function DetailPageBreadcrumb({
  indexPage,
  indexPageEndPoint,
  activePage,
}) {
  return (
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb text-white">
        <li class="breadcrumb-item">
          <Link to="/" className="text-decoration-none text-dark">
            Home
          </Link>
        </li>
        <li class="breadcrumb-item">
          <Link
            to={indexPageEndPoint}
            className="text-decoration-none text-dark"
          >
            {indexPage}
          </Link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {activePage}
        </li>
      </ol>
    </nav>
  );
}
