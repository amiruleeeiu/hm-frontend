import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import FromInput from "../../components/FromInput";
import SearchSelect from "../../components/SearchSelect";
import formatValue from "../../components/formatValue";
import { onlyNumber } from "../../components/onlyNumber";
import { selectDataFormate } from "../../components/selectDataFormate";
import { useGetDistrictsQuery } from "../../features/districtApi";
import { useGetLocationssQuery } from "../../features/locationApi";
import {
  useAddPatientMutation,
  useUpdatePatientMutation,
} from "../../features/patientApi";
import { useGetUpozilasQuery } from "../../features/upozilaApi";

const autoCompleteFieldName = {
  location_id: "",
  district_id: "",
  upozila_id: "",
};

export default function PatientModal({
  isOpen,
  setIsOpen,
  editItem,
  setEditItem,
  setToast,
}) {
  const [addPatient, { isLoading, isSuccess }] = useAddPatientMutation();

  const [autoCompleteName, setAutCompleteName] = useState(
    autoCompleteFieldName
  );
  const [isOpenDistrict, setIsOpenDistrict] = useState(false);
  const [isOpenUpozila, setIsOpenUpozila] = useState(false);
  const [isOpenLocation, setIsOpenLocation] = useState(false);
  const [editDistrict, setEditDistrict] = useState({});
  const [editUpozila, setEditUpozila] = useState({});
  const [editLocation, setEditLocation] = useState({});

  const { data: districts, isSuccess: isZillaSuccess } =
    useGetDistrictsQuery("");

  const [upozilaSearchUrl, setUpozilaSearchUrl] = useState({
    url: "",
    skip: true,
  });

  const { data: upozilas, isSuccess: isUpozilaSuccess } = useGetUpozilasQuery(
    upozilaSearchUrl.url,
    { refetchOnMountOrArgChange: true, skip: upozilaSearchUrl?.skip }
  );

  const [locationSearchUrl, setLocationSearchUrl] = useState({
    url: "",
    skip: true,
  });

  const { data: locations, isSuccess: isLocationSuccess } =
    useGetLocationssQuery(locationSearchUrl.url, {
      refetchOnMountOrArgChange: true,
      skip: locationSearchUrl?.skip,
    });

  const [
    updatePatient,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdatePatientMutation();

  let initial = {
    name: "",
    symptoms: "",
    phone: "",
    email: "",
    location_id: "",
    district_id: "",
    upozila_id: "",
    status: true,
  };

  const formik = useFormik({
    initialValues: initial,
    validate: (values) => {
      const errors = {};

      if (!values.name) {
        errors.name = "The Name is Required";
      }
      if (!values.phone) {
        errors.phone = "The phone is Required";
      }

      if (!values.symptoms) {
        errors.symptoms = "The symptoms is Required";
      }
      if (!values.location_id) {
        errors.location_id = "The location is Required";
      }
      if (!values.district_id) {
        errors.district_id = "The district is Required";
      }
      if (!values.upozila_id) {
        errors.upozila_id = "The upozila is Required";
      }

      return errors;
    },
    onSubmit: (values) => {
      const currentValues = { ...values };

      if (editItem?.id) {
        updatePatient({ id: editItem?.id, data: currentValues });
      } else {
        addPatient(currentValues);
      }
    },
  });

  useEffect(() => {
    if (editItem?.id) {
      formik.setValues({ ...editItem });
      setAutCompleteName({
        ...autoCompleteName,
        location_id: editItem?.location_id ?? "",
        location_name: editItem?.location_name ?? "",
        district_name: editItem?.district_name ?? "",
        district_id: editItem?.district_id ?? "",
        upozila_id: editItem?.upozila_id ?? "",
        upozila_name: editItem?.upozila_name ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editItem]);

  const toggle = () => {
    setIsOpen(false);
    formik.resetForm();
    setAutCompleteName(autoCompleteFieldName);
    setEditItem({});
  };

  useEffect(() => {
    if (isSuccess) {
      setToast({ message: "Successfully Added" });
      toggle();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    if (isUpdateSuccess) {
      setToast({ message: "Successfully Updated", fetch: true });
      toggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess]);

  const handleSearchChange = (e, type) => {
    if (e && type === "district_id") {
      setAutCompleteName({
        ...autoCompleteName,
        [type]: e.id,
        district_name: e.value,
      });
      formik.setValues({
        ...formik.values,
        [type]: e.id,
        district_name: e.value,
      });
      setUpozilaSearchUrl({ url: `?district_id=${e.id}`, skip: false });
    } else if (e && type === "upozila_id") {
      setAutCompleteName({
        ...autoCompleteName,
        [type]: e.id,
        upozila_name: e.value,
      });
      formik.setValues({
        ...formik.values,
        [type]: e.value,
        upozila_name: e.value,
      });
      setLocationSearchUrl({ url: `?upozila_id=${e.id}`, skip: false });
    } else if (e && type === "location_id") {
      setAutCompleteName({
        ...autoCompleteName,
        [type]: e.id,
        location_name: e.value,
      });
      formik.setValues({
        ...formik.values,
        [type]: e.id,
        location_name: e.value,
      });
    } else if (e === null && type === "district_id") {
      setAutCompleteName({
        ...autoCompleteName,
        [type]: "",
        district_name: "",
        upozila_id: "",
        upozila_name: "",
        location_id: "",
        location_name: "",
      });
      formik.setValues({
        ...formik.values,
        [type]: "",
        district_name: "",
        upozila_id: "",
        upozila_name: "",
        location_id: "",
        location_name: "",
      });
      setUpozilaSearchUrl({ url: ``, skip: true });
      setLocationSearchUrl({ url: ``, skip: true });
    } else if (e === null && type === "upozila_id") {
      setAutCompleteName({
        ...autoCompleteName,
        [type]: "",
        upozila_name: "",
        location_id: "",
        location_name: "",
      });
      formik.setValues({
        ...formik.values,
        [type]: "",
        upozila_name: "",
        location_id: "",
        location_name: "",
      });
      setLocationSearchUrl({ url: ``, skip: true });
    } else {
      setAutCompleteName({
        ...autoCompleteName,
        [type]: "",
        location_name: "",
      });
      formik.setValues({
        ...formik.values,
        [type]: "",
        location_name: "",
      });
    }
  };

  console.log(formik.values);

  return (
    <form>
      <Modal isOpen={isOpen} size="xl" toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {editItem?.id ? "Update" : "Add"} District
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-6">
              <FromInput
                name="name"
                id="name"
                label="Name"
                placeholder="Name"
                isTouched={formik.touched.name}
                invalidFeedback={formik.errors.name}
                isValid={formik.isValid}
                value={formik.values?.name ?? ""}
                onChange={formik.handleChange}
              />
            </div>
            <div className="col-md-6">
              <FromInput
                name="phone"
                id="phone"
                label="Phone"
                placeholder="Phone"
                isTouched={formik.touched.phone}
                invalidFeedback={formik.errors.phone}
                isValid={formik.isValid}
                value={onlyNumber(formik.values?.phone) ?? ""}
                onChange={formik.handleChange}
              />
            </div>
            <div className="col-md-6">
              <FromInput
                name="email"
                id="email"
                label="Email"
                placeholder="Email"
                value={formik.values?.email ?? ""}
                onChange={formik.handleChange}
              />
            </div>
            <div className="col-md-6">
              <FromInput
                name="symptoms"
                type="textarea"
                id="symptoms"
                label="Symptoms"
                placeholder="Symptoms"
                isTouched={formik.touched.symptoms}
                invalidFeedback={formik.errors.symptoms}
                isValid={formik.isValid}
                value={formik.values?.symptoms ?? ""}
                onChange={formik.handleChange}
              />
            </div>
            <div className="col-md-6">
              {/* <div className="row px-4">
                <div className="col-md-11"> */}
              <SearchSelect
                list={selectDataFormate(
                  isZillaSuccess,
                  districts?.data,
                  "district_name"
                )}
                isTouched={formik.touched.district_id}
                invalidFeedback={formik.errors.district_id}
                isValid={formik.isValid}
                value={formatValue(
                  autoCompleteName?.district_name,
                  "Select District"
                )}
                label="District"
                name="district_id"
                onChange={(e) => handleSearchChange(e, "district_id")}
              >
                <Button color="primary" onClick={() => setIsOpenDistrict(true)}>
                  <i className="bi bi-plus-circle"></i>
                </Button>
              </SearchSelect>
            </div>
            <div className="col-md-6">
              <SearchSelect
                list={selectDataFormate(
                  isUpozilaSuccess,
                  upozilas?.data,
                  "upozila_name"
                )}
                value={formatValue(
                  autoCompleteName?.upozila_name,
                  "Select Upozila"
                )}
                isTouched={formik.touched.upozila_id}
                invalidFeedback={formik.errors.upozila_id}
                isValid={formik.isValid}
                label="Upozila"
                name="upozila_id"
                onChange={(e) => handleSearchChange(e, "upozila_id")}
              >
                <Button
                  color="primary"
                  onClick={() => {
                    setIsOpenUpozila(true);
                    setEditUpozila({
                      district_id: autoCompleteName?.district_id,
                      district_name: autoCompleteName?.district_name,
                      status: true,
                    });
                  }}
                >
                  <i className="bi bi-plus-circle"></i>
                </Button>
              </SearchSelect>
            </div>
            <div className="col-md-6">
              <SearchSelect
                list={selectDataFormate(
                  isLocationSuccess,
                  locations?.data,
                  "location_name"
                )}
                value={formatValue(
                  autoCompleteName?.location_name,
                  "Select Location"
                )}
                isTouched={formik.touched.location_id}
                invalidFeedback={formik.errors.location_id}
                isValid={formik.isValid}
                label="Location"
                name="location_id"
                onChange={(e) => handleSearchChange(e, "location_id")}
              >
                <Button
                  color="primary"
                  onClick={() => {
                    setIsOpenLocation(true);
                    setEditLocation({
                      upozila_id: autoCompleteName?.upozila_id,
                      upozila_name: autoCompleteName?.upozila_id,
                      status: true,
                    });
                  }}
                >
                  <i className="bi bi-plus-circle"></i>
                </Button>
              </SearchSelect>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-5">
                <label>Status</label>
                <div className="d-flex">
                  <div>
                    <input
                      type="radio"
                      id="available"
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
                    <label for="available">Active</label>
                  </div>

                  <div>
                    <input
                      type="radio"
                      id="notAvailable"
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
                    <label for="notAvailable">Inactive</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={formik.handleSubmit}
            disabled={isLoading || isUpdateLoading}
          >
            {(isLoading || isUpdateLoading) && <Spinner size="sm"></Spinner>}{" "}
            <span className="d-flex gap-2">
              <i
                className={`${
                  editItem?.id ? "bi bi-pencil" : "bi bi-plus-circle"
                }`}
              ></i>
              {editItem?.id ? "Update" : "Add"}
            </span>{" "}
          </Button>
        </ModalFooter>
        {/* <DistrictModal
          editItem={editDistrict}
          setEditItem={setEditDistrict}
          setIsOpen={setIsOpenDistrict}
          isOpen={isOpenDistrict}
          setToast={setToast}
        />
        <UpozilaModal
          editItem={editUpozila}
          setEditItem={setEditUpozila}
          setIsOpen={setIsOpenUpozila}
          isOpen={isOpenUpozila}
          setToast={setToast}
        />
        <LocationModal
          editItem={editLocation}
          setEditItem={setEditLocation}
          setIsOpen={setIsOpenLocation}
          isOpen={isOpenLocation}
          setToast={setToast}
        /> */}
      </Modal>
    </form>
  );
}
