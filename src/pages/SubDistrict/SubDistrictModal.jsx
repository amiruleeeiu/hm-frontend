import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import Select from "react-select";
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
import { debounce } from "../../components/common/debounce";
import { useGetDistrictsQuery } from "../../features/districtApi";
import {
  useAddSubDistrictMutation,
  useUpdateSubDistrictMutation,
} from "../../features/subDistrictApi";

export default function SubDistrictModal({
  isOpen,
  title,
  setTitle,
  setIsOpen,
  editItem,
  isFetching,
  setEditItem,
  setToast,
}) {
  const [addSubDistrict, { isLoading, isSuccess, error, isError }] =
    useAddSubDistrictMutation();

  const [districtSearchUrl, setDistrictSearchUrl] = useState("");
  const { data: districtData, isFetching: districtFetching } =
    useGetDistrictsQuery(districtSearchUrl, {
      refetchOnMountOrArgChange: true,
    });

  const [autoCompleteName, setAutCompleteName] = useState({
    district_id: "",
    district_name: "Select District",
  });

  const [
    updateSubDistrict,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdateSubDistrictMutation();

  let initial = {
    district_id: "",
    subDistrict_id: "",
    name: "",
    status: "1",
  };

  const formik = useFormik({
    initialValues: initial,
    validate: (values) => {
      const errors = {};

      if (!values.district_id) {
        errors.district_id = "The district Name is Required";
      }

      if (!values.name) {
        errors.name = "The sub-district Name is Required";
      }

      return errors;
    },
    onSubmit: (values) => {
      const currentValues = { ...values, status: values?.status ? "1" : "2" };

      if (editItem?.id) {
        updateSubDistrict({ id: editItem?.id, data: currentValues });
      } else {
        addSubDistrict(currentValues);
      }
    },
  });

  useEffect(() => {
    if (editItem?.id || editItem?.upozila_id) {
      formik.setValues({
        id: editItem?.id,
        status: editItem?.status == 1 ? true : false,
        name: editItem?.name,
        district_id: editItem?.district_id?._id,
      });
      setAutCompleteName({
        district_id: editItem?.district_id?._id,
        district_name: editItem?.district_id?.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editItem]);

  const toggle = () => {
    setIsOpen(false);
    formik.resetForm();
    setEditItem({});
    setAutCompleteName({ upozila_id: "", upozila_name: "" });
  };
  console.log(error);
  useEffect(() => {
    if (isSuccess) {
      setToast({ message: "Successfully Added" });
      toggle();
    }

    if (isError) {
      setToast({ message: error?.data?.message, type: "error" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess,error,isError]);

  console.log(formik);

  useEffect(() => {
    if (isUpdateSuccess) {
      setToast({ message: "Successfully Updated", fetch: true });
      toggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess]);

  const handleSelectChange = (e) => {
    if (e) {
      formik.setValues({
        ...formik.values,
        district_id: e?.value,
      });
      setAutCompleteName({
        ...autoCompleteName,
        district_id: e?.value,
        district_name: e?.label,
      });
    } else {
      formik.setValues({
        ...formik.values,
        district_id: "",
      });
      setAutCompleteName({
        ...autoCompleteName,
        district_id: "",
        district_name: "",
      });
    }
  };

  const handleInputChange = (value, { action }, setUrlStr, fieldName) => {
    const { country_id } = formik.values;
    if (action === "input-change") {
      if (fieldName === "state_id" && country_id) {
        debounce(`?country_id=${country_id}&name=${value}`, setUrlStr);
      } else {
        debounce(`?name=${value}`, setUrlStr);
      }
    } else if (action === "input-blur") {
      if (fieldName === "state_id" && country_id) {
        debounce(`?country_id=${country_id}`, setUrlStr);
      } else {
        debounce(``, setUrlStr);
      }
    }
  };
  console.log(editItem);
  return (
    <form>
      <Modal isOpen={isOpen} size="md" toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {title === "View" ? "" : title} Sub-District
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
                      <td style={{ minWidth: "40%" }}>Sub-district</td>
                      <td style={{ minWidth: "10%" }}>:</td>
                      <td>{editItem?.name}</td>
                    </tr>

                    <tr>
                      <td style={{ minWidth: "40%" }}>District Name</td>
                      <td style={{ minWidth: "10%" }}>:</td>
                      <td>{editItem?.district_id?.name}</td>
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
              <FormGroup row className="mt-3">
                <Label for="subDistrict_id">
                  District
                </Label>
                <Col>
                  <Select
                    value={{
                      value: autoCompleteName?.district_id,
                      label: autoCompleteName?.district_name
                        ? autoCompleteName?.district_name
                        : "Search District",
                    }}
                    onChange={(e) => handleSelectChange(e)}
                    onInputChange={(e, action) =>
                      handleInputChange(
                        e,
                        action,
                        setDistrictSearchUrl,
                        "district_id"
                      )
                    }
                    isClearable={autoCompleteName?.district_id ? true : false}
                    options={
                      districtData?.data?.data?.map((i) => ({
                        label: i?.name,
                        value: i?._id,
                      })) ?? []
                    }
                    className="select2-selection"
                    isLoading={districtFetching}
                    // isDisabled={districtFetching}
                  />
                  {formik.touched.district_id && formik.errors.district_id && (
                    <span className="text-danger">
                      {formik.errors.district_id}
                    </span>
                  )}
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label >Sub-district Name</Label>
                <Col >
                  <FromInput
                    name="name"
                    id="name"
                    placeholder="Sub-district Name"
                    isTouched={formik.touched.name}
                    invalidFeedback={formik.errors.name}
                    isValid={formik.isValid}
                    value={formik.values?.name ?? ""}
                    onChange={formik.handleChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm="2" className="mt-0 pt-0">Status</Label>
                <Col sm="10">
                  <div className="d-flex mt-1">
                    <div>
                      <input
                        type="radio"
                        id="location_active"
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
                      <label for="location_active">Active</label>
                    </div>

                    <div>
                      <input
                        type="radio"
                        id="location_inactive"
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
                      <label for="location_inactive">Inactive</label>
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
              onClick={formik.handleSubmit}
              size="sm"
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
