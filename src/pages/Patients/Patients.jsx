import React from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Layout from "../../components/Layout";
import ManageDistricts from "./ManagePatients";

export default function Patients() {
  return (
    <Layout title="Patients Page">
      <div className="ms-3">
        <Breadcrumb to="/" home="Home" activePage="Patients" />
        <ManageDistricts />
      </div>
    </Layout>
  );
}
