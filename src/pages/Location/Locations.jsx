import React from "react";
import Layout from "../../components/Layout";
import ManageLocations from "./ManageLocations";

export default function Locations() {
  return (
    <Layout title="Locations">
      <div className="ms-3">
        <ManageLocations />
      </div>
    </Layout>
  );
}
