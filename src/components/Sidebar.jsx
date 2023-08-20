import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/images/706.jpg";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div>
        <Link to="/">
          <img src={logo} alt="" className="w-100" height="70" />
        </Link>
      </div>
      <ul className="sidebar-list list-unstyled">
        <li>
          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              isActive
                ? "text-decoration-none text-white active"
                : "text-decoration-none text-white"
            }
          >
            Doctors
          </NavLink>
        </li>
        <li>
          <NavLink to="/patients" className="text-decoration-none text-white">
            Patients
          </NavLink>
        </li>
        <li>
          <NavLink to="/shedules" className="text-decoration-none text-white">
            Dr.Shedule
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/appointments"
            className="text-decoration-none text-white"
          >
            Appointments
          </NavLink>
        </li>
        <li>
          <NavLink to="/roles" className="text-decoration-none text-white">
            Roles
          </NavLink>
        </li>
        <li>
          <NavLink to="/districts" className="text-decoration-none text-white">
            District
          </NavLink>
        </li>
        <li>
          <NavLink to="/sub-districts" className="text-decoration-none text-white">
            Sub-District
          </NavLink>
        </li>
        <li>
          <NavLink to="/locations" className="text-decoration-none text-white">
            Location
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
