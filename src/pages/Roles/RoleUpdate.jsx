import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button, Card, CardBody } from "reactstrap";
import Checkbox from "../../components/Checkbox";
import DetailPageBreadcrumb from "../../components/DetailPageBreadcrumb";
import { useGetRoleQuery, useUpdateRoleMutation } from "../../features/roleApi";

export default function RoleUpdate() {
  const { id } = useParams();

  const { data: role, isSuccess, refetch, isFetching } = useGetRoleQuery(id);

  const [updateRole, { isSuccess: isUpdateSuccess }] = useUpdateRoleMutation();

  const [toastObj, setToast] = useState({});
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (isSuccess && !isFetching) {
      setPermissions(role?.permission);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, !isFetching]);

  useEffect(() => {
    if (isUpdateSuccess) {
      refetch();
      setToast({ message: "Successfully Updated" });
    }
  }, [isUpdateSuccess]);

  useEffect(() => {
    if (toastObj?.message) {
      toast.success(toastObj?.message, { autoClose: 1000 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastObj]);

  const handleChange = (e, id) => {
    const updatedPermission = permissions.map((i) => {
      if (i?.id === id) {
        return { ...i, has_access: e.target.checked };
      }
      return i;
    });

    setPermissions(updatedPermission);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateRole({ id, data: { ...role, permission: permissions } });
  };

  return (
    <div>
      <div className="ms-3">
        <DetailPageBreadcrumb
          indexPage="Roles"
          indexPageEndPoint={"/roles"}
          activePage="Roles Update"
        />
      </div>
      <div className="row ms-2">
        {permissions?.length > 0 &&
          permissions.map((i) => (
            <div className="col-md-3 mb-1 p-2" key={i?.id}>
              <Card>
                <CardBody>
                  <div className="ps-3">
                    <Checkbox
                      label={i?.name}
                      value={i?.has_access}
                      onChange={(e) => handleChange(e, i?.id)}
                    />
                  </div>
                </CardBody>
              </Card>
            </div>
          ))}
      </div>
      <div style={{ float: "right" }}>
        <Button color="primary" onClick={handleSubmit} className='mb-3'>
          <span className="d-flex gap-2">
            <i className="bi bi-pencil"></i>Update
          </span>
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
}
