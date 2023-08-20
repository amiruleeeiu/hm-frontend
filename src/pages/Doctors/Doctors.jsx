import React from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Layout from "../../components/Layout";
import ManageDoctors from "./ManageDoctors";

export default function Doctors() {
  return (
    <Layout title="Doctors Page">
      <div className="doctors ms-3">
        <ManageDoctors />
      </div>
    </Layout>
  );
}
