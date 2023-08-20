import React from "react";
import Layout from "../../components/Layout";
import ManageSubDistricts from "./ManageSubDistricts";

export default function SubDistrict() {
  return (
    <Layout title="SubDistrict">
      <div className="ms-3">
        <ManageSubDistricts />
      </div>
    </Layout>
  );
}
