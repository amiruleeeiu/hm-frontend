import React from "react";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

export default function Status({ item, statusUpdate, dropdown = true }) {
  return (
    <UncontrolledDropdown>
      <DropdownToggle
        caret
        color={item?.status ? "success" : "warning"}
        style={{ width: "100px" }}
      >
        {item?.status ? "Active" : "Inactive"}
      </DropdownToggle>
      {dropdown && (
        <DropdownMenu style={{ width: "100px" }}>
          <DropdownItem onClick={() => statusUpdate(item, true)}>
            Active
          </DropdownItem>
          <DropdownItem onClick={() => statusUpdate(item, false)}>
            Inactive
          </DropdownItem>
        </DropdownMenu>
      )}
    </UncontrolledDropdown>
  );
}
