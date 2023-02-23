import React from "react";
import Select from "react-select";
import { Label } from "reactstrap";

export default function SearchSelect({
  name,
  label,
  list,
  onChange,
  value,
  isTouched,
  isValid,
  invalidFeedback,
  children,
}) {
  return (
    <div className="row mb-3">
      {label && (
        <div className="col-md-3">
          <Label>{label}</Label>
        </div>
      )}
      <div className={label ? "col-md-9" : "col-md-12"}>
        <div className="d-flex">
          <div style={children ?{ width: "90%",paddingRight:'10px' } :{width:'100%'}}>
            <Select
              isClearable
              value={value}
              name={name}
              options={list}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={onChange}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor:
                    isTouched && !isValid && invalidFeedback ? "red" : "gray",
                }),
              }}
            />
          </div>
          {children}
        </div>
        {isTouched && !isValid && invalidFeedback && (
          <span className="text-danger">{invalidFeedback}</span>
        )}
      </div>
    </div>
  );
}
