import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Districts from "./pages/Districts/Districts";
import Doctors from "./pages/Doctors/Doctors";
import ShowDoctor from "./pages/Doctors/ShowDoctor";
import Locations from "./pages/Location/Locations";
import Patients from "./pages/Patients/Patients";
import ShowPatient from "./pages/Patients/ShowPatient";
import Upozila from "./pages/Upozilas/Upozila";

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
            <Route path="/patients/:id" element={<ShowPatient />} />
          </Routes>
          <Routes>
            <Route path="/districts" element={<Districts />} />
          </Routes>
          <Routes>
            <Route path="/upozilas" element={<Upozila />} />
          </Routes>
          <Routes>
            <Route path="/locations" element={<Locations />} />
          </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
