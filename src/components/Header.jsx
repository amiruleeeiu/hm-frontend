import React from "react";
import { Button, Input } from "reactstrap";

export default function Header() {
  return (
    <div className="header d-flex align-items-center justify-content-between">
      <div className="d-flex px-3">
        <Input style={{width:'400px'}}/>
        <Button color="success" className="ms-2">Search</Button>
      </div>
    </div>
  );
}
