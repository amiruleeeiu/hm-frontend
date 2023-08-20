/* eslint-disable react/prop-types */
import React from "react";
import { Button, Modal, ModalBody } from "reactstrap";

// eslint-disable-next-line react/prop-types
function SweetAlert({
  deleteItem,
  onConfirm,
  onCancel,
  confirmBtnText,
  children,
  buttonColor = "danger",
}) {
  return (
    <Modal
      isOpen={deleteItem ? true : false}
      size="sm"
      toggle={onCancel}
      centered
    >
      <ModalBody className="text-center">
        <div>
          <div className=" d-flex justify-content-center mb-2">
            <div
              className="border border-danger rounded-circle"
              style={{ width: "80px", height: "80px" }}
            >
              <span className="text-danger" style={{ fontSize: "50px" }}>
                !
              </span>
            </div>
          </div>
          <h3>Are you sure?</h3>
          {children}
          <div>
            <Button onClick={onCancel} className="py-0 px-1">
              Cancel
            </Button>{" "}
            &nbsp;
            <Button
              onClick={onConfirm}
              color={buttonColor}
              className="py-0 px-1"
            >
              {confirmBtnText}
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default SweetAlert;
