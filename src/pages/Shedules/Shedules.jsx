import React from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Layout from "../../components/Layout";
import ManageShedules from "./ManageShedules";

export default function Shedules() {
  return (
    <Layout title="Shedules">
      <div className="ms-3">
        <Breadcrumb activePage="Shedules" />
        <ManageShedules />
      </div>
    </Layout>
  );
}
