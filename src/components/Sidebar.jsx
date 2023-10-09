import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/images/706.jpg";

export default function Sidebar() {
  const MENUES = [
    { title: "Doctor", path: "/doctors" },
    { title: "Patient", path: "/patients" },
    { title: "Appointment", path: "/appointments" },
    { title: "Roles", path: "/roles" },
    { title: "District", path: "/districts" },
    { title: "Sub-District", path: "/sub-districts" },
    { title: "Location", path: "/locations" },
  ];

  return (
    <div className="sidebar">
      <div>
        <Link to="/">
          <img src={logo} alt="" className="w-100" height="70" />
        </Link>
      </div>
      <ul className="sidebar-list list-unstyled">
        {MENUES.map((menu,index) => (
          <li key={index}>
            <NavLink
              to={menu.path}
              className={({ isActive }) =>
                isActive
                  ? "text-decoration-none text-white active d-flex"
                  : "text-decoration-none text-white d-flex"
              }
            >
              {menu.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
