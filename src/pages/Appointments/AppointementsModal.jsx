import { useFormik } from "formik";
import { default as React, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import FromInput from "../../components/FromInput";
import FromSelect from "../../components/FromSelect";
import SearchSelect from "../../components/SearchSelect";
import formatValue from "../../components/formatValue";
import { selectDataFormate } from "../../components/selectDataFormate";
import { tConvert } from "../../components/tConvert";
import {
  useAddAppointmentMutation,
  useUpdateAppointmentMutation,
} from "../../features/appointmentApi";
import { useGetDistrictsQuery } from "../../features/districtApi";
import { useGetDoctorsQuery } from "../../features/doctorApi";
import { useGetLocationssQuery } from "../../features/locationApi";
import { useGetShedulesQuery } from "../../features/sheduleApi";
import { useGetUpozilasQuery } from "../../features/upozilaApi";

export default function AppointementsModal({
  isOpen,
  setIsOpen,
  editItem,
  setEditItem,
  setToast,
}) {
  const [addAppointment, { isLoading, isSuccess }] =
    useAddAppointmentMutation();

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

  const [totalShedules, setTotalShedules] = useState([]);

  const [appointmentStartTime, setAppointmentStartTime] = useState([]);

  const { data: shedules, isSuccess: isSheduleSuccess } =
    useGetShedulesQuery("");

  // const[data:doctors]=useGet

  const { data: doctorsList, isSuccess: isDoctorsSucccess } =
    useGetDoctorsQuery("");

  const [
    updateAppointment,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdateAppointmentMutation();

  let initial = {
    doctor_name: "",
    doctor_id: "",
    start_time: "",
    end_time: "",
    date: "",
    patient_name: "",
    symptoms: "",
    district_name: "",
    district_id: "",
    upozila_id: "",
    upozila_name: "",
    location_id: "",
    location_name: "",
    status: "Pending",
    create_at: new Date(),
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
      if (!values.upozila_id) {
        errors.upozila_id = "The upozila is Required";
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

      if (editItem?.id) {
        updateAppointment({ id: editItem?.id, data: currentValues });
      } else {
        addAppointment(currentValues);
      }
    },
  });

  console.log(editItem);

  const toggle = () => {
    setIsOpen(false);
    formik.resetForm();
    setEditItem({});
    setAutCompleteName({ doctor_id: "", doctor_name: "" });
    setSelectedDate(null);
    setTotalShedules([]);
    setAppointmentStartTime([]);
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

  const handleDoctorSearchChange = (e) => {
    if (e) {
      const { doctor_name, doctor_id } = e;
      setAutCompleteName({
        doctor_name,
        doctor_id,
      });
      formik.setValues({
        ...formik.values,
        doctor_name,
        doctor_id,
      });

      const currentDoctorShedules = shedules?.data
        .filter((item) => item?.doctor_id === doctor_id)
        .map((i) => new Date(i?.date));
      // setSelectedDate(currentDoctorShedules[0]);
      setTotalShedules(currentDoctorShedules);
    } else {
      setAutCompleteName({
        doctor_name: "",
        doctor_id: "",
      });
      formik.setValues({
        ...formik.values,
        doctor_name: "",
        doctor_id: "",
        start_time: "",
        end_time: "",
        date: "",
      });
      setSelectedDate(null);
      setTotalShedules([]);
      setAppointmentStartTime([]);
    }
  };

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

  function removeDuplicates(arr) {
    return arr.filter((item, index) => {
      if (
        arr
          .slice(index + 1, arr.lenght)
          .find((i) => i?.doctor_id === item?.doctor_id)
      ) {
        return false;
      } else {
        return true;
      }
    });
  }

  const handleDate = (date) => {
    setSelectedDate(date);
    console.log(date);

    const currentTimeObj = shedules?.data.filter(
      (i) =>
        new Date(i?.date).toLocaleDateString() ===
          new Date(date).toLocaleDateString() &&
        i?.doctor_id === formik?.values?.doctor_id
    );

    formik.setValues({
      ...formik.values,
      date,
      start_time: currentTimeObj?.start_time,
      end_time: currentTimeObj?.end_time,
    });

    setAppointmentStartTime(
      currentTimeObj.map((i) => {
        return {
          name: tConvert(i?.start_time),
          end_time: tConvert(i?.end_time),
          id: i?.id,
        };
      })
    );
  };

  useEffect(() => {
    if (formik.values?.start_time) {
      const currentEndTime = appointmentStartTime.find(
        (i) => i?.name === formik.values?.start_time
      );

      formik.setValues({
        ...formik.values,
        end_time: currentEndTime?.end_time,
      });
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values?.start_time]);

  useEffect(() => {
    if (editItem?.id || editItem?.district_name) {
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

      if (editItem?.doctor_id && editItem?.date) {
        setSelectedDate(new Date(editItem?.date));

        const currentDoctorShedules = shedules?.data
          .filter((item) => item?.doctor_id === editItem?.doctor_id)
          .map((i) => new Date(i?.date));
        // setSelectedDate(currentDoctorShedules[0]);
        setTotalShedules(currentDoctorShedules);
      }
      if (editItem?.date) {
        const currentTimeObj = shedules?.data.filter(
          (i) =>
            new Date(i?.date).toLocaleDateString() ===
              new Date(editItem?.date).toLocaleDateString() &&
            i?.doctor_id === editItem?.doctor_id
        );
        setAppointmentStartTime(
          currentTimeObj.map((i) => {
            return {
              name: tConvert(i?.start_time),
              end_time: tConvert(i?.end_time),
              id: i?.id,
            };
          })
        );
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editItem]);

  console.log(formik.values);

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

              <SearchSelect
                list={selectDataFormate(
                  isSheduleSuccess,
                  isSheduleSuccess && removeDuplicates(shedules?.data),
                  "doctor_name"
                )}
                isTouched={formik.touched.doctor_id}
                invalidFeedback={formik.errors.doctor_id}
                isValid={formik.isValid}
                value={formatValue(
                  autoCompleteName?.doctor_name,
                  "Search Doctor"
                )}
                label="Search Doctor"
                name="doctor_name"
                onChange={(e) => handleDoctorSearchChange(e)}
              />

              <div className="d-flex align-items-center justify-content-between mb-3">
                <Label>Date</Label>
                <div style={{ width: "74%" }}>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => handleDate(date)}
                    isClearable
                    includeDates={totalShedules}
                    disabled={totalShedules.length === 0 ? true : false}
                    placeholderText="   Click to select a date"
                  />
                  {formik.touched.date &&
                    !formik.isValid &&
                    formik.errors.date && (
                      <p className="text-danger mb-0">{formik.errors.date}</p>
                    )}
                </div>
              </div>

              <FromSelect
                list={appointmentStartTime ?? []}
                name="start_time"
                id="start_time"
                label="Start Time"
                isTouched={formik.touched.start_time}
                invalidFeedback={formik.errors.start_time}
                isValid={formik.isValid}
                disabled={appointmentStartTime?.length === 0 ? true : false}
                placeholder="Start Time"
                value={formik.values?.start_time ?? "Start Time"}
                onChange={formik.handleChange}
              />
              <FromInput
                name="end_time"
                id="end_time"
                label="End Time"
                disabled={true}
                isTouched={formik.touched.end_time}
                invalidFeedback={formik.errors.end_time}
                isValid={formik.isValid}
                value={formik.values?.end_time ?? ""}
                onChange={formik.handleChange}
              />
            </div>

            <div className="col-md-6">
              <h5 className="mb-4">Patient Info</h5>
              <FromInput
                name="patient_name"
                id="patient_name"
                label="Patient Name"
                placeholder="Patient Name"
                isTouched={formik.touched.patient_name}
                invalidFeedback={formik.errors.patient_name}
                isValid={formik.isValid}
                value={formik.values?.patient_name ?? ""}
                onChange={formik.handleChange}
              />
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
                    });
                  }}
                >
                  <i className="bi bi-plus-circle"></i>
                </Button>
              </SearchSelect>
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
                    });
                  }}
                >
                  <i className="bi bi-plus-circle"></i>
                </Button>
              </SearchSelect>
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
