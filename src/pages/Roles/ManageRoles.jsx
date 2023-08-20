import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { useGetRolesQuery } from "../../features/roleApi";

export default function ManageRoles() {
  const { data: roles, isLoading, isSuccess, isError } = useGetRolesQuery();

  let content = null;

  if (isLoading && !isSuccess) {
    content = (
      <tr>
        <td>Loading...</td>
      </tr>
    );
  }

  if (!isLoading && isSuccess && roles?.length === 0) {
    content = (
      <tr>
        <td>There is no content</td>
      </tr>
    );
  }

  if (!isLoading && isSuccess && roles?.data?.length > 0) {
    content = (
      <tbody>
        {roles?.data.map((item, index) => (
          <tr className="align-middle">
            <td>{index + 1}</td>
            <td>{item?.name}</td>
            <td style={{minWidth:'500px'}}>
              {item?.permission
                .filter((i) => i.has_access)
                .map((j) => (
                  <span className="permission_bg">{j?.name} </span>
                ))}
            </td>
            <td>
              <Link to={`/roles/${item?.id}`}>
                <Button color="primary" onClick={() => handleUpdate()}>
                  <span className="d-flex gap-2">
                    <i className="bi bi-pencil"></i>Edit
                  </span>
                </Button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  const handleUpdate = () => {};
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>SL</th>
          <th>Title</th>
          <th>Permission</th>
          <th>Action</th>
        </tr>
      </thead>
      {content}
    </table>
  );
}
