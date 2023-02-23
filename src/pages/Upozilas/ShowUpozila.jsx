import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

export default function ShowUpozila({
  isOpen,
  setIsOpen,
  editItem,
  setEditItem,
}) {
  const toggle = () => {
    setIsOpen(false);
    setEditItem({});
  };

  const { district_name, status, upozila_name } = editItem || {};
  return (
    <Modal isOpen={isOpen} size="" toggle={toggle}>
      <ModalHeader toggle={toggle}>Upozila detail</ModalHeader>
      <ModalBody>
        <div className="row">
          <div className="col-md-6">
            <table class="table table-striped">
              <tbody>
                <tr>
                  <th scope="row">District</th>
                  <td>:</td>
                  <td>{district_name}</td>
                </tr>
                <tr>
                  <th scope="row">Status</th>
                  <td>:</td>
                  <td>{status ? "Active" : "Inactive"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
            <table class="table table-striped">
              <tbody>
                <tr>
                  <th scope="row">Upozila</th>
                  <td>:</td>
                  <td>{upozila_name}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
