import React from "react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ to, home, activePage }) {
  return (
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb text-white">
        <li class="breadcrumb-item">
          <Link to={to ?? "/"} className="text-decoration-none text-dark">
            {home ?? "Home"}
          </Link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {activePage}
        </li>
      </ol>
    </nav>
  );
}
