import React from "react";
import { FormFeedback, Input, Label } from "reactstrap";

export default function FromSelect({
  id,
  name,
  onChange,
  placeholder,
  value,
  label,
  list,
  onKeyDown,
  isTouched,
  isValid,
  invalidFeedback,
}) {
  return (
    <div className="d-flex align-items-center justify-content-between mb-3">
      {label && <Label>{label}</Label>}
      <div style={label && { width: "74%" }}>
        <Input
          type="select"
          name={name}
          id={id}
          placeholder={placeholder}
          value={value}
          invalid={isTouched && !isValid && invalidFeedback ? true : false}
          onChange={onChange}
          onKeyDown={onKeyDown}
        >
          <option value={""}>{`Select ${placeholder}`}</option>
          {list.map((item) => {
            if (item?.value === true || item?.value === false) {
              return (
                <option value={item?.value} key={item?.id}>
                  {item?.name}
                </option>
              );
            } else {
              return (
                <option value={item?.name} key={item?.id}>
                  {item?.name}
                </option>
              );
            }
          })}
        </Input>
        {isTouched && !isValid && invalidFeedback && (
          <FormFeedback>{invalidFeedback}</FormFeedback>
        )}
      </div>
    </div>
  );
}
