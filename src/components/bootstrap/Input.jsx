import React from "react";
import { FormGroup, Label } from "reactstrap";

export default function Input({
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
  list,
}) {
  return (
    <FormGroup>
      <div className="mb-3">
        <div>{label && <Label>{label}</Label>}</div>
        <div>
          {type === "select" && (
            <select
              name={name}
              id={id}
              class="form-select"
              onChange={onChange}
              value={value}
            >
              <option value="">Select {label}</option>
              {list?.map((i) => (
                <option key={i.value} data-name={i?.text} value={i?.value}>
                  {i.text}
                </option>
              ))}
            </select>
          )}
          {type === "textarea" && (
            <textarea
              type={type ?? "text"}
              invalidFeedback={invalidFeedback}
              onKeyDown={onKeyDown}
              className={`form-control ${
                isTouched && !isValid && invalidFeedback && "is-invalid"
              }`}
              disabled={disabled}
              id={id}
              name={name}
              placeholder={placeholder}
              onChange={onChange}
              value={value}
            />
          )}
          {type !== "select" && type !== "textarea" && (
            <div>
              <input
                type={type ?? "text"}
                invalidFeedback={invalidFeedback}
                onKeyDown={onKeyDown}
                className={`form-control ${
                  isTouched && !isValid && invalidFeedback && "is-invalid"
                }`}
                disabled={disabled}
                id={id}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
              />
              <div class="invalid-feedback">{invalidFeedback}</div>
            </div>
          )}
        </div>
      </div>
    </FormGroup>
  );
}
