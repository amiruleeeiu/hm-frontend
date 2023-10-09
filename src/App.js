import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Appointements from "./pages/Appointments/Appointements";
import Districts from "./pages/Districts/Districts";
import Doctors from "./pages/Doctors/Doctors";
import ShowDoctor from "./pages/Doctors/ShowDoctor";
import Locations from "./pages/Location/Locations";
import RoleUpdate from "./pages/Roles/RoleUpdate";
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
            <Route path="/appointments" element={<Appointements />} />
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
            <Route path="/roles/:id" element={<RoleUpdate />} />
          </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
