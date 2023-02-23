import React from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Layout from "../../components/Layout";
import ManageLocations from "./ManageLocations";

export default function Locations() {
  return (
    <Layout title="Locations">
      <div className="ms-3">
        <Breadcrumb activePage="Locations" />
        <ManageLocations />
      </div>
    </Layout>
  );
}
