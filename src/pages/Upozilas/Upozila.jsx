import React from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Layout from "../../components/Layout";
import ManageUpozilas from "./ManageUpozilas";

export default function Upozila() {
  return (
    <Layout title="Upozilas">
      <div className="ms-3">
        <Breadcrumb activePage="Doctors" />
        <ManageUpozilas />
      </div>
    </Layout>
  );
}
