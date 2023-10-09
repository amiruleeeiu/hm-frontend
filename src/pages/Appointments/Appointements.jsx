import React from "react";
import Layout from "../../components/Layout";
import ManageAppointments from "./ManageAppointments";

export default function Appointements() {
  return (
    <Layout title="Appointements">
      <div className="ms-3">
        <ManageAppointments />
      </div>
    </Layout>
  );
}
