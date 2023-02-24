import React from "react";
import { Button } from "reactstrap";

export default function ActionButton({
  id,
  handleUpdate,
  setDeleteItemId,
  setIsOpenAlert,
}) {
  return (
    <>
      <Button color="success" onClick={() => handleUpdate(id)}>
        <span className="d-flex gap-2">
          <i className="bi bi-pencil"></i>Edit
        </span>
      </Button>
      <Button
        color="danger"
        onClick={() => {
          setIsOpenAlert(true);
          setDeleteItemId(id);
        }}
      >
        <span className="d-flex gap-2">
          <i className="bi bi-trash"></i>Delete
        </span>
      </Button>
    </>
  );
}
