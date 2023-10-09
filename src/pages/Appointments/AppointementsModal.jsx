import { useFormik } from "formik";
import { default as React, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import {
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import Button from "../../components/bootstrap/Button";
import Input from "../../components/bootstrap/Input";
import { debounce } from "../../components/common/debounce";
import {
  useAddAppointmentMutation,
  useUpdateAppointmentMutation,
} from "../../features/appointmentApi";
import { useGetDistrictsQuery } from "../../features/districtApi";
import { useGetDoctorsQuery } from "../../features/doctorApi";
import { useGetLocationssQuery } from "../../features/locationApi";
import { useGetSubDistrictsQuery } from "../../features/subDistrictApi";

export default function AppointementsModal({
  isOpen,
  setIsOpen,
  editItem,
  setEditItem,
  setToast,
}) {
  const [addAppointment, { isLoading, isSuccess }] =
    useAddAppointmentMutation();
  console.log(isLoading);
  const [doctorSearchUrl, setDoctorSearchUrl] = useState("");

  const { data: doctorsData, isFetching: doctorFetching } = useGetDoctorsQuery(
    doctorSearchUrl,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [autoCompleteName, setAutCompleteName] = useState({
    doctor_name: "",
    doctor_id: "",
    district_name: "",
    district_id: "",
    upozila_id: "",
    upozila_name: "",
    location_id: "",
    location_name: "",
  });

  const [selectedDate, setSelectedDate] = useState(null);

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

  const [locationSearchUrl, setLocationSearchUrl] = useState({
    text: "",
    skip: true,
  });

  const { data: locationData, isFetching: locationFetching } =
    useGetLocationssQuery(locationSearchUrl?.text, {
      refetchOnMountOrArgChange: true,
      skip: locationSearchUrl?.skip,
    });

  const [totalShedules, setTotalShedules] = useState([]);

  const [doctorShedules, setDoctorShedules] = useState([]);

  const [
    updateAppointment,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdateAppointmentMutation();

  let initial = {
    doctor_id: "",
    start_time: "",
    end_time: "",
    date: "",
    patient_name: "",
    symptoms: "",
    district_id: "",
    subDistrict_id: "",
    location_id: "",
  };

  const formik = useFormik({
    initialValues: initial,
    validate: (values) => {
      const errors = {};

      if (!values.doctor_id) {
        errors.doctor_id = "The Doctor Name is Required";
      }
      if (!values.date) {
        errors.date = "The Date is Required";
      }
      if (!values.patient_name) {
        errors.patient_name = "The patient name is Required";
      }
      if (!values.symptoms) {
        errors.symptoms = "The symptoms is Required";
      }
      if (!values.district_id) {
        errors.district_id = "The district is Required";
      }
      if (!values.subDistrict_id) {
        errors.subDistrict_id = "The subDistrict_id is Required";
      }
      if (!values.location_id) {
        errors.location_id = "The location is Required";
      }
      if (!values.start_time) {
        errors.start_time = "The Start date is Required";
      }

      if (!values.end_time) {
        errors.end_time = "The end date is Required";
      }

      return errors;
    },
    onSubmit: (values) => {
      const currentValues = { ...values };

      console.log(currentValues);

      if (editItem?.id) {
        updateAppointment({ id: editItem?.id, data: currentValues });
      } else {
        addAppointment(currentValues);
      }
    },
  });
  const toggle = () => {
    setIsOpen(false);
    formik.resetForm();
    setEditItem({});
    setAutCompleteName({ doctor_id: "", doctor_name: "" });
    setSelectedDate(null);
    setTotalShedules([]);
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

  const handleDate = (date) => {
    if (date) {
      console.log(date);
      setSelectedDate(date);
      let currentDate = doctorShedules.find((i) => i.day == date.getDay());

      if (currentDate?.day) {
        formik.setValues({
          ...formik.values,
          date: String(date),
          start_time: new Date(currentDate?.start_time),
          end_time: new Date(currentDate?.end_time),
        });
      }
    } else {
      formik.setValues({
        ...formik.values,
        start_time: null,
        end_time: null,
      });
      setSelectedDate(null);
    }
  };
  useEffect(() => {
    if (editItem?.id) {
      formik.setValues({ ...editItem });
      setAutCompleteName({
        doctor_name: editItem?.doctor_name ?? "",
        doctor_id: editItem?.doctor_id ?? "",
        district_name: editItem?.district_name ?? "",
        district_id: editItem?.district_id ?? "",
        upozila_name: editItem?.upozila_name ?? "",
        upozila_id: editItem?.upozila_id ?? "",
        location_name: editItem?.location_name ?? "",
        location_id: editItem?.location_id ?? "",
      });

      // if (editItem?.doctor_id && editItem?.date) {
      //   setSelectedDate(new Date(editItem?.date));

      //   const currentDoctorShedules = shedules?.data
      //     .filter((item) => item?.doctor_id === editItem?.doctor_id)
      //     .map((i) => new Date(i?.date));
      //   // setSelectedDate(currentDoctorShedules[0]);
      //   setTotalShedules(currentDoctorShedules);
      // }
      // if (editItem?.date) {
      //   const currentTimeObj = shedules?.data.filter(
      //     (i) =>
      //       new Date(i?.date).toLocaleDateString() ===
      //         new Date(editItem?.date).toLocaleDateString() &&
      //       i?.doctor_id === editItem?.doctor_id
      //   );
      //   setAppointmentStartTime(
      //     currentTimeObj.map((i) => {
      //       return {
      //         name: tConvert(i?.start_time),
      //         end_time: tConvert(i?.end_time),
      //         id: i?.id,
      //       };
      //     })
      //   );
      // }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editItem?.id]);

  const handleSelectChange = (e, fieldId, fieldName, setUrlStr) => {
    if (fieldId === "district_id") {
      if (e) {
        formik.setValues({
          ...formik.values,
          district_id: e?.value,
          subDistrict_id: "",
          location_id: "",
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
          location_id: "",
          location_name: "",
        });
        setsubDistrictSearchUrl({
          text: `?district_id=${e?.value}`,
          skip: false,
        });
        setLocationSearchUrl({
          text: ``,
          skip: true,
        });
      } else {
        setsubDistrictSearchUrl({
          text: ``,
          skip: true,
        });
        setLocationSearchUrl({
          text: ``,
          skip: true,
        });
        formik.setValues({
          ...formik.values,
          district_id: "",
          subDistrict_id: "",
          location_id: "",
        });
        setAutCompleteName({
          ...autoCompleteName,
          district_id: "",
          district_name: "",
          subDistrict_id: "",
          subDistrict_name: "",
          location_id: "",
          location_name: "",
        });
        // setStateSearchUrl("");
      }
    } else if (fieldId === "subDistrict_id") {
      if (e) {
        formik.setValues({
          ...formik.values,
          [fieldId]: e?.value,
          location_id: "",
        });
        setLocationSearchUrl({
          text: `?subDistrict_id=${e?.value}`,
          skip: false,
        });
        setAutCompleteName({
          ...autoCompleteName,
          subDistrict_id: e?.value,
          subDistrict_name: e?.label,
          location_id: "",
          location_name: "",
        });
      } else {
        formik.setValues({
          ...formik.values,
          location_id: "",
          subDistrict_id: "",
        });
        setLocationSearchUrl({
          text: ``,
          skip: true,
        });
        setAutCompleteName({
          ...autoCompleteName,
          subDistrict_id: "",
          subDistrict_name: "",
          location_id: "",
          location_name: "",
        });
        // setStateSearchUrl("");
      }
    } else if (fieldId === "location_id") {
      if (e) {
        formik.setValues({
          ...formik.values,
          [fieldId]: e?.value,
        });
        setLocationSearchUrl({
          text: ``,
          skip: false,
        });
        setAutCompleteName({
          ...autoCompleteName,
          location_id: e?.value,
          location_name: e?.label,
        });
      } else {
        formik.setValues({
          ...formik.values,
          location_id: "",
        });
        setAutCompleteName({
          ...autoCompleteName,
          location_id: "",
          location_name: "",
        });
        // setStateSearchUrl("");
      }
    } else {
      setSelectedDate(null);
      if (e) {
        setTotalShedules(getSheduleDate(e?.shedules));
        setDoctorShedules(e?.shedules);
        if (setUrlStr) {
          setUrlStr("");
        }
        formik.setValues({
          ...formik.values,
          [fieldId]: e?.value,
        });
        setAutCompleteName({
          ...autoCompleteName,
          [fieldId]: e?.value,
          [fieldName]: e?.label,
        });
      } else {
        formik.setValues({
          ...formik.values,
          [fieldId]: "",
          start_time: null,
          end_time: null,
        });
        setAutCompleteName({
          ...autoCompleteName,
          [fieldId]: "",
          [fieldName]: "",
        });
      }
    }
  };

  const handleInputChange = (value, { action }, setUrlStr, fieldName) => {
    const { district_id, subDistrict_id, location_id } = formik.values;
    if (action === "input-change") {
      if (fieldName === "location_id" && subDistrict_id) {
        debounce(
          { text: `?location_id=${location_id}&name=${value}`, skip: false },
          setUrlStr
        );
      } else if (fieldName === "subDistrict_id" && district_id) {
        debounce(
          { text: `?district_id=${district_id}&name=${value}`, skip: false },
          setUrlStr
        );
      } else if (fieldName === "district_id") {
        debounce(``, setUrlStr);
      } else {
        debounce(`?name=${value}`, setUrlStr);
      }
    } else if (action === "input-blur") {
      if (fieldName === "subDistrict_id" && district_id) {
        debounce(
          { text: `?district_id=${district_id}`, skip: false },
          setUrlStr
        );
      } else if (fieldName === "location_id" && subDistrict_id) {
        debounce(
          { text: `?subDistrict_id=${subDistrict_id}`, skip: false },
          setUrlStr
        );
      } else if (fieldName === "district_id") {
        debounce(``, setUrlStr);
      } else {
        debounce(``, setUrlStr);
      }
    }
  };

  const getSheduleDate = (e) => {
    const date = new Date();
    const weaklyDate = [];

    for (let i = 1; i <= 7; i++) {
      let newDate = new Date(date.setMilliseconds(24 * 60 * 60 * 1000));
      if (e.find((j) => j.day == newDate.getDay())) {
        weaklyDate.push(newDate);
      }
    }
    return weaklyDate;
  };
  return (
    <form>
      <Modal isOpen={isOpen} size="xl" toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {editItem?.id ? "Update" : "Add"} Appointment
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-6">
              <h5 className="mb-4">Doctor Info</h5>
              <FormGroup className="">
                <Label for="location_id">Search Doctor</Label>
                <Select
                  id="doctor_id"
                  value={{
                    value: autoCompleteName?.doctor_id,
                    label: autoCompleteName?.doctor_name
                      ? autoCompleteName?.doctor_name
                      : "Search Doctor",
                  }}
                  onChange={(e) =>
                    handleSelectChange(e, "doctor_id", "doctor_name")
                  }
                  onInputChange={(e, action) =>
                    handleInputChange(
                      e,
                      action,
                      setDoctorSearchUrl,
                      "doctor_id"
                    )
                  }
                  isClearable={autoCompleteName?.doctor_id ? true : false}
                  options={
                    doctorsData?.data?.data?.map((i) => ({
                      label: i?.name,
                      value: i?._id,
                      shedules: i?.shedules,
                    })) ?? []
                  }
                  className="select2-selection"
                  isLoading={doctorFetching}
                  // isDisabled={subDistrictFetching}
                />
                {formik.touched.doctor_id && formik.errors.doctor_id && (
                  <span className="text-danger">{formik.errors.doctor_id}</span>
                )}
              </FormGroup>

              <div className="mb-3">
                <Label>Date</Label>
                <div>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => handleDate(date)}
                    isClearable
                    disabled={autoCompleteName?.doctor_id ? false : true}
                    includeDates={totalShedules}
                    minDate={totalShedules[0]}
                    maxDate={totalShedules[totalShedules.length - 1]}
                    placeholderText=" Click to select a date"
                    shouldCloseOnSelect={true}
                  />
                  {formik.touched.date &&
                    !formik.isValid &&
                    formik.errors.date && (
                      <p className="text-danger mb-0">{formik.errors.date}</p>
                    )}
                </div>
              </div>
              <div className="mb-3">
                <Label>Start Time</Label>
                <DatePicker
                  selected={formik.values.start_time}
                  disabled={true}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  placeholderText=" Start date"
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                />
              </div>
              <div className="mb-3">
                <Label>End Time</Label>
                <DatePicker
                  selected={formik.values.end_time}
                  disabled={true}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  placeholderText=" End date"
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                />
              </div>
            </div>

            <div className="col-md-6">
              <h5 className="mb-4">Patient Info</h5>
              <Input
                label="Patient Name"
                name="patient_name"
                id="patient_name"
                placeholder="Patient Name"
                isTouched={formik.touched.patient_name}
                invalidFeedback={formik.errors.patient_name}
                isValid={formik.isValid}
                value={formik.values?.patient_name ?? ""}
                onChange={formik.handleChange}
              />{" "}
              <Input
                label="Symptoms"
                name="symptoms"
                type="textarea"
                id="symptoms"
                placeholder="Symptoms"
                isTouched={formik.touched.symptoms}
                invalidFeedback={formik.errors.symptoms}
                isValid={formik.isValid}
                value={formik.values?.symptoms ?? ""}
                onChange={formik.handleChange}
              />{" "}
              <FormGroup>
                <Label for="subDistrict_id">District</Label>
                <Select
                  value={{
                    value: autoCompleteName?.district_id,
                    label: autoCompleteName?.district_name
                      ? autoCompleteName?.district_name
                      : "Search District",
                  }}
                  onChange={(e) =>
                    handleSelectChange(e, "district_id", "district_name")
                  }
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
                  classNamePrefix="react-select"
                  isLoading={districtFetching}
                  // isDisabled={districtFetching}
                />
                {formik.touched.district_id && formik.errors.district_id && (
                  <span className="text-danger">
                    {formik.errors.district_id}
                  </span>
                )}
              </FormGroup>
              <FormGroup className="">
                <Label for="subDistrict_id">Sub-district</Label>
                <Select
                  id="subDistrict_id"
                  value={{
                    value: autoCompleteName?.subDistrict_id,
                    label: autoCompleteName?.subDistrict_name
                      ? autoCompleteName?.subDistrict_name
                      : "Search Sub-district",
                  }}
                  onChange={(e) =>
                    handleSelectChange(e, "subDistrict_id", "subDistrict_name")
                  }
                  onInputChange={(e, action) =>
                    handleInputChange(
                      e,
                      action,
                      setsubDistrictSearchUrl,
                      "subDistrict_id"
                    )
                  }
                  isClearable={autoCompleteName?.subDistrict_id ? true : false}
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
              </FormGroup>
              <FormGroup className="">
                <Label for="location_id">Location</Label>
                <Select
                  id="location_id"
                  value={{
                    value: autoCompleteName?.location_id,
                    label: autoCompleteName?.location_name
                      ? autoCompleteName?.location_name
                      : "Search Location",
                  }}
                  onChange={(e) =>
                    handleSelectChange(e, "location_id", "location_name")
                  }
                  onInputChange={(e, action) =>
                    handleInputChange(
                      e,
                      action,
                      setLocationSearchUrl,
                      "location_id"
                    )
                  }
                  isClearable={autoCompleteName?.location_id ? true : false}
                  options={
                    locationData?.data?.data?.map((i) => ({
                      label: i?.name,
                      value: i?._id,
                    })) ?? []
                  }
                  className="select2-selection"
                  isLoading={locationFetching}
                  // isDisabled={subDistrictFetching}
                />
                {formik.touched.location_id && formik.errors.location_id && (
                  <span className="text-danger">
                    {formik.errors.location_id}
                  </span>
                )}
              </FormGroup>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalFooter>
            <Button
              color="primary"
              onClick={formik.handleSubmit}
              size="sm"
              icon={`${editItem?.id ? "bi bi-pencil" : "bi bi-plus-circle"}`}
              disabled={isLoading || isUpdateLoading}
              isLoading={isLoading || isUpdateLoading}
            >
              {editItem?.id ? "Update" : "Save"}
            </Button>
          </ModalFooter>
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
