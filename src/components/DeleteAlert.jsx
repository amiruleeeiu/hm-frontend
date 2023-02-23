import React from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";

export default function DeleteAlert({
  isOpen,
  setIsOpen,
  handleDelete,
  deleteItemId,
  setDeleteItemId,
}) {
  const modalClose = () => {
    setIsOpen(false);
  };
  return (
    <Modal isOpen={isOpen} toggle={modalClose} size="sm" centered={true}>
      <ModalHeader toggle={modalClose}>Delete Alert</ModalHeader>
      <ModalBody className="text-center">
        <p>Are you sure to remove ?</p>
        <Button
          className="btn btn-success"
          onClick={() => handleDelete(deleteItemId)}
        >
          Confirm
        </Button>{" "}
        <Button
          className="btn btn-danger"
          onClick={() => {
            setIsOpen(false);
            setDeleteItemId(null);
          }}
        >
          Cancel
        </Button>
      </ModalBody>
    </Modal>
  );
}
