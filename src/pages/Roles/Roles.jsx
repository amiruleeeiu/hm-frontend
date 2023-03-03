import React from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Layout from "../../components/Layout";
import ManageRoles from "./ManageRoles";

export default function Roles() {
  return (
    <Layout title="Roles Page">
      <div className="roles ms-3">
        <Breadcrumb to="/" home="Home" activePage="Roles" />
        <ManageRoles />
      </div>
    </Layout>
  );
}
