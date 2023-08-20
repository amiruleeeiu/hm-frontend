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
  useAddLocationMutation,
  useUpdateLocationMutation,
} from "../../features/locationApi";
import { useGetSubDistrictsQuery } from "../../features/subDistrictApi";

export default function LocationModal({
  isOpen,
  title,
  setTitle,
  setIsOpen,
  editItem,
  isFetching,
  setEditItem,
  setToast,
}) {
  const [addLocation, { error, isError, isLoading, isSuccess }] =
    useAddLocationMutation();

  const [districtSearchUrl, setDistrictSearchUrl] = useState("");
  const { data: districtData, isFetching: districtFetching } =
    useGetDistrictsQuery(districtSearchUrl, {
      refetchOnMountOrArgChange: true,
    });

  const [subDistrictSearchUrl, setsubDistrictSearchUrl] = useState({
    text: "",
    skip: true,
  });
  const { data: subDistrictData, isFetching: subDistrictFetching } =
    useGetSubDistrictsQuery(subDistrictSearchUrl?.text, {
      refetchOnMountOrArgChange: true,
      skip: subDistrictSearchUrl?.skip,
    });

  const [autoCompleteName, setAutCompleteName] = useState({
    district_id: "",
    district_name: "Select District",
    subDistrict_id: "",
    subDistrict_name: "Select Sub-district",
  });

  const [
    updateLocation,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdateLocationMutation();

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
      if (!values.subDistrict_id) {
        errors.subDistrict_id = "The sub-district Name is Required";
      }
      if (!values.name) {
        errors.name = "The location Name is Required";
      }

      return errors;
    },
    onSubmit: (values) => {
      const currentValues = { ...values, status: values?.status ? "1" : "2" };

      if (editItem?.id) {
        updateLocation({ id: editItem?.id, data: currentValues });
      } else {
        addLocation(currentValues);
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
        subDistrict_id: editItem?.subDistrict_id?._id,
      });
      setAutCompleteName({
        district_id: editItem?.district_id?._id,
        district_name: editItem?.district_id?.name,
        subDistrict_name: editItem?.subDistrict_id?.name,
        subDistrict_id: editItem?.subDistrict_id?._id,
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

  useEffect(() => {
    if (isSuccess) {
      setToast({ message: "Successfully Added" });
      toggle();
    }

    if (isError) {
      setToast({ message: error?.data?.message, type: "error" });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error]);

  console.log(formik);

  useEffect(() => {
    if (isUpdateSuccess) {
      setToast({ message: "Successfully Updated", fetch: true });
      toggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess]);

  const handleSelectChange = (e, fieldName) => {
    if (fieldName === "district_id") {
      if (e) {
        formik.setValues({
          ...formik.values,
          district_id: e?.value,
          subDistrict_id: "",
        });
        // setsubDistrictSearchUrl({
        //   text: ``,
        //   skip: true,
        // });
        setAutCompleteName({
          ...autoCompleteName,
          district_id: e?.value,
          district_name: e?.label,
          subDistrict_id: "",
          subDistrict_name: "",
        });
        setsubDistrictSearchUrl({
          text: `?district_id=${e?.value}`,
          skip: false,
        });
      } else {
        setsubDistrictSearchUrl({
          text: ``,
          skip: true,
        });
        formik.setValues({
          ...formik.values,
          district_id: "",
          subDistrict_id: "",
        });
        setAutCompleteName({
          ...autoCompleteName,
          district_id: "",
          district_name: "",
          subDistrict_id: "",
          subDistrict_name: "",
        });
        // setStateSearchUrl("");
      }
    } else {
      if (e) {
        formik.setValues({
          ...formik.values,
          subDistrict_id: e?.value,
        });
        setAutCompleteName({
          ...autoCompleteName,
          subDistrict_id: e?.value,
          subDistrict_name: e?.label,
        });
      } else {
        formik.setValues({
          ...formik.values,
          subDistrict_id: e?.value,
        });
        setAutCompleteName({
          ...autoCompleteName,
          subDistrict_id: "",
          subDistrict_name: "",
        });
      }
    }
  };

  const handleInputChange = (value, { action }, setUrlStr, fieldName) => {
    const { district_id } = formik.values;
    if (action === "input-change") {
      if (fieldName === "subDistrict_id" && district_id) {
        debounce(
          { text: `?district_id=${district_id}&name=${value}`, skip: false },
          setUrlStr
        );
      } else if (fieldName === "district_id") {
        debounce(``, setUrlStr);
      }
    } else if (action === "input-blur") {
      if (fieldName === "subDistrict_id" && district_id) {
        debounce(
          { text: `?district_id=${district_id}`, skip: false },
          setUrlStr
        );
      } else if (fieldName === "district_id") {
        debounce(``, setUrlStr);
      }
    }
  };
  console.log(formik?.values?.status);
  return (
    <form>
      <Modal isOpen={isOpen} size="lg" toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {title === "View" ? "" : title} Location
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
                      <td style={{ minWidth: "40%" }}>Location</td>
                      <td style={{ minWidth: "10%" }}>:</td>
                      <td>{editItem?.name}</td>
                    </tr>
                    <tr>
                      <td>Sub-district</td>
                      <td>:</td>
                      <td>{editItem?.subDistrict_id?.name}</td>
                    </tr>
                    <tr>
                      <td style={{ minWidth: "40%" }}>District Name</td>
                      <td style={{ minWidth: "10%" }}>:</td>
                      <td>{editItem?.subDistrict_id?.name}</td>
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
                <Label for="subDistrict_id" sm="2">
                  District
                </Label>
                <Col lm="10">
                  <Select
                    value={{
                      value: autoCompleteName?.district_id,
                      label: autoCompleteName?.district_name
                        ? autoCompleteName?.district_name
                        : "Search District",
                    }}
                    onChange={(e) => handleSelectChange(e, "district_id")}
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
              <FormGroup row className="">
                <Label for="subDistrict_id" sm="2">
                  Sub-district
                </Label>
                <Col lm="10">
                  <Select
                    id="subDistrict_id"
                    value={{
                      value: autoCompleteName?.subDistrict_id,
                      label: autoCompleteName?.subDistrict_name
                        ? autoCompleteName?.subDistrict_name
                        : "Search Sub-district",
                    }}
                    onChange={(e) => handleSelectChange(e, "subDistrict_id")}
                    onInputChange={(e, action) =>
                      handleInputChange(
                        e,
                        action,
                        setsubDistrictSearchUrl,
                        "subDistrict_id"
                      )
                    }
                    isClearable={
                      autoCompleteName?.subDistrict_id ? true : false
                    }
                    options={
                      subDistrictData?.data?.data?.map((i) => ({
                        label: i?.name,
                        value: i?._id,
                      })) ?? []
                    }
                    className="select2-selection"
                    isLoading={subDistrictFetching}
                    // isDisabled={subDistrictFetching}
                  />
                  {formik.touched.subDistrict_id &&
                    formik.errors.subDistrict_id && (
                      <span className="text-danger">
                        {formik.errors.subDistrict_id}
                      </span>
                    )}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm="2">Location Name</Label>
                <Col sm="10">
                  <FromInput
                    name="name"
                    id="name"
                    placeholder="Location Name"
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
                  <div className="d-flex">
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
