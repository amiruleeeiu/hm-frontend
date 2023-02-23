import React from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Layout from "../../components/Layout";
import ManageDistricts from "./ManageDistricts";

export default function Districts() {
  return (
    <Layout title="Districts Page">
      <div className="ms-3">
        <Breadcrumb to="/" home="Home" activePage="Districts" />
        <ManageDistricts />
      </div>
    </Layout>
  );
}
