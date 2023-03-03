import React from "react";
import { FormGroup, Input, Label } from "reactstrap";

export default function Checkbox({ label, value, onChange }) {
  return (
    <FormGroup check>
      <Input type="checkbox" checked={value} onChange={onChange} />
      <Label check>{label}</Label>
    </FormGroup>
  );
}
