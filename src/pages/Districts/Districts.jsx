import React from "react";
import Layout from "../../components/Layout";
import ManageDistricts from "./ManageDistricts";

export default function Districts() {
  return (
    <Layout title="Districts Page">
      <div className="ms-3">
        <ManageDistricts />
      </div>
    </Layout>
  );
}
