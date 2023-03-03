import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { tConvert } from "../../components/tConvert";

export default function ShowShedule({
  isOpen,
  setIsOpen,
  editItem,
  setEditItem,
}) {
  const toggle = () => {
    setIsOpen(false);
    setEditItem({});
  };

  console.log(editItem);

  const { doctor_name, date, start_time, end_time, status } =
    editItem || {};
  return (
    <Modal isOpen={isOpen} size="lg" toggle={toggle}>
      <ModalHeader toggle={toggle}>Shedule detail</ModalHeader>
      <ModalBody>
        <div className="row">
          <div className="col-md-6">
            <table class="table table-striped">
              <tbody>
                <tr>
                  <th scope="row">Doctor</th>
                  <td>:</td>
                  <td>{doctor_name}</td>
                </tr>
                <tr>
                  <th scope="row">Date</th>
                  <td>:</td>
                  <td>{date}</td>
                </tr>
                <tr>
                  <th scope="row">Start Time</th>
                  <td>:</td>
                  <td>{tConvert(start_time)}</td>
                </tr>
                
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
            <table class="table table-striped">
              <tbody>
              <tr>
                  <th scope="row">End Time</th>
                  <td>:</td>
                  <td>{tConvert(end_time)}</td>
                </tr>
                <tr>
                  <th scope="row">Status</th>
                  <td>:</td>
                  <td>{status ? "Active" : "Inactive"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
