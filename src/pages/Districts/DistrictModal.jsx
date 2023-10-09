import { useFormik } from "formik";
import React, { useEffect } from "react";
import {
  Button,
  Col,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import FromInput from "../../components/FromInput";
import {
  useAddDistrictMutation,
  useUpdateDistrictMutation,
} from "../../features/districtApi";

export default function DistrictModal({
  isOpen,
  title,
  setIsOpen,
  setTitle,
  editItem,
  isFetching,
  setEditItem,
  setToast,
}) {
  const [addDistrict, { districtData, isSuccess, isLoading, isError, error }] =
    useAddDistrictMutation();

  const [
    updateDistrict,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdateDistrictMutation();

  let initial = {
    name: "",
    status: "1",
  };
  console.log(isFetching);

  const formik = useFormik({
    initialValues: initial,
    validate: (values) => {
      const errors = {};

      if (!values.name) {
        errors.name = "The district Name is Required";
      }

      return errors;
    },
    onSubmit: (values) => {
      const currentValues = { ...values, status: values?.status ? "1" : "2" };

      if (editItem?.id) {
        updateDistrict({ id: editItem?.id, data: currentValues });
      } else {
        addDistrict(currentValues);
      }
    },
  });

  console.log(editItem);

  useEffect(() => {
    if (editItem?.id || editItem?.upozila_id) {
      formik.setValues({
        id: editItem?.id,
        status: editItem?.status == 1 ? true : false,
        name: editItem?.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editItem]);

  const toggle = () => {
    setIsOpen(false);
    formik.resetForm();
    setEditItem({});
  };

  console.log(isError);

  console.log(error?.data?.message);

  useEffect(() => {
    if (isSuccess) {
      setToast({ message: "Successfully Added" });
      toggle();
    }

    if (isError) {
      setToast({ message: error?.data?.message, type: 'error' });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, districtData]);

  useEffect(() => {
    if (isUpdateSuccess) {
      setToast({ message: "Successfully Updated", fetch: true });
      toggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess]);

  return (
    <form>
      <Modal isOpen={isOpen} size="md" toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {title === "View" ? "" : title} District
          {!isFetching && title === "View" && (
            <Button
              size="sm"
              outline
              color="primary"
              onClick={() => setTitle("Update")}
            >
              <i className="bi bi-pencil"></i> Update
            </Button>
          )}
        </ModalHeader>
        <ModalBody>
          {title === "View" && !isFetching && (
            <Row>
              <Col>
                <table className="table table-striped">
                  <tbody>
                    <tr>
                      <td style={{ minWidth: "40%" }}>District</td>
                      <td style={{ minWidth: "10%" }}>:</td>
                      <td>{editItem?.name}</td>
                    </tr>

                    <tr>
                      <td>Status</td>
                      <td>:</td>
                      <td>{editItem?.status_name}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          )}
          {isFetching && (
            <div className="text-center my-5 py-5">
              <Spinner
                style={{
                  height: "3rem",
                  width: "3rem",
                }}
                color="primary"
                type="grow"
              />
            </div>
          )}
          {title !== "View" && !isFetching && (
            <div className="row">
              <FormGroup row>
                <Label >District Name</Label>
                <Col >
                  <FromInput
                    name="name"
                    id="name"
                    placeholder="District Name"
                    isTouched={formik.touched.name}
                    invalidFeedback={formik.errors.name}
                    isValid={formik.isValid}
                    value={formik.values?.name ?? ""}
                    onChange={formik.handleChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm="2">Status</Label>
                <Col sm="10">
                  <div className="d-flex mt-2">
                    <div>
                      <input
                        type="radio"
                        id="district_active"
                        className="me-1"
                        value={true}
                        onChange={() =>
                          formik.setValues({
                            ...formik.values,
                            status: true,
                          })
                        }
                        checked={formik?.values?.status}
                      />
                      <label for="district_active">Active</label>
                    </div>

                    <div>
                      <input
                        type="radio"
                        id="district_inactive"
                        value={false}
                        onChange={() =>
                          formik.setValues({
                            ...formik.values,
                            status: false,
                          })
                        }
                        checked={!formik?.values?.status}
                        className="ms-3 me-1"
                      />
                      <label for="district_inactive">Inactive</label>
                    </div>
                  </div>
                </Col>
              </FormGroup>
            </div>
          )}
        </ModalBody>
        {title !== "View" && !isFetching && (
          <ModalFooter>
            <Button
              color="primary"
              size="sm"
              onClick={formik.handleSubmit}
              disabled={isLoading || isUpdateLoading}
            >
              <span className="d-flex gap-2">
                <i
                  className={`${
                    editItem?.id ? "bi bi-pencil" : "bi bi-plus-circle"
                  }`}
                ></i>
                {editItem?.id ? "Update" : "Save"}
                {(isLoading || isUpdateLoading) && (
                  <Spinner size="sm" className="mt-1" />
                )}{" "}
              </span>{" "}
            </Button>
          </ModalFooter>
        )}
      </Modal>
    </form>
  );
}
