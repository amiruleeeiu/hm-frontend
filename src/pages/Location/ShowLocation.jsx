import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

export default function ShowLocation({
  isOpen,
  setIsOpen,
  editItem,
  setEditItem,
}) {
  const toggle = () => {
    setIsOpen(false);
    setEditItem({});
  };

  const { location_name, status, upozila_name } = editItem || {};
  return (
    <Modal isOpen={isOpen} size="lg" toggle={toggle}>
      <ModalHeader toggle={toggle}>Location detail</ModalHeader>
      <ModalBody>
        <div className="row">
          <div className="col-md-6">
            <table class="table table-striped">
              <tbody>
                <tr>
                  <th scope="row">Location</th>
                  <td>:</td>
                  <td>{location_name}</td>
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
