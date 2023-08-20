import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Appointements from "./pages/Appointments/Appointements";
import Districts from "./pages/Districts/Districts";
import Doctors from "./pages/Doctors/Doctors";
import ShowDoctor from "./pages/Doctors/ShowDoctor";
import Locations from "./pages/Location/Locations";
import Patients from "./pages/Patients/Patients";
import ShowPatient from "./pages/Patients/ShowPatient";
import RoleUpdate from "./pages/Roles/RoleUpdate";
import Roles from "./pages/Roles/Roles";
import Shedules from "./pages/Shedules/Shedules";
import Upozila from "./pages/SubDistrict/SubDistrict";
import SubDistrict from "./pages/SubDistrict/SubDistrict";

function App() {
  return (
    <Router>
      <div className="dashboard">
        <Sidebar />
        <div className="dashboard-content">
          <Header/>
          <div className="content">
          <Routes>
            <Route path="/doctors" element={<Doctors />} />
          </Routes>
          <Routes>
            <Route path="/doctors/:id" element={<ShowDoctor />} />
          </Routes>
          <Routes>
            <Route path="/patients" element={<Patients />} />
          </Routes>
          <Routes>
            <Route path="/appointments" element={<Appointements />} />
          </Routes>
          <Routes>
            <Route path="/shedules" element={<Shedules />} />
          </Routes>
          <Routes>
            <Route path="/patients/:id" element={<ShowPatient />} />
          </Routes>
          <Routes>
            <Route path="/districts" element={<Districts />} />
          </Routes>
          <Routes>
            <Route path="/sub-districts" element={<SubDistrict />} />
          </Routes>
          <Routes>
            <Route path="/locations" element={<Locations />} />
          </Routes>
          <Routes>
            <Route path="/roles" element={<Roles />} />
          </Routes>
          <Routes>
            <Route path="/roles/:id" element={<RoleUpdate />} />
          </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
