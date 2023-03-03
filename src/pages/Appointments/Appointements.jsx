import React from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Layout from "../../components/Layout";
import ManageAppointments from "./ManageAppointments";

export default function Appointements() {
  return (
    <Layout title="Appointements">
      <div className="ms-3">
        <Breadcrumb activePage="Appointements" />
        <ManageAppointments />
      </div>
    </Layout>
  );
}
