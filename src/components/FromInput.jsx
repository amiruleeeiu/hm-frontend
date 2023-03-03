import React from "react";
import { FormFeedback, FormGroup, Input, Label } from "reactstrap";

export default function FromInput({
  type,
  id,
  name,
  onChange,
  value,
  label,
  placeholder,
  invalidFeedback,
  isValid,
  isTouched,
  onKeyDown,
  disabled,
}) {
  return (
    <FormGroup>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>{label && <Label>{label}</Label>}</div>
        <div style={label ? { width: "74%" } : { width: "100%" }}>
          <Input
            type={type ?? "text"}
            invalidFeedback={invalidFeedback}
            isValid={isValid}
            isTouched={isTouched}
            onKeyDown={onKeyDown}
            disabled={disabled}
            id={id}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            invalid={isTouched && !isValid && invalidFeedback ? true : false}
            value={value}
          />
          {isTouched && !isValid && invalidFeedback && (
            <FormFeedback>{invalidFeedback}</FormFeedback>
          )}
        </div>
      </div>
    </FormGroup>
  );
}
