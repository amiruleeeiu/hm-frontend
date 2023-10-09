import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
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
import Button from "../../components/bootstrap/Button";
import Input from "../../components/bootstrap/Input";
import { debounce } from "../../components/common/debounce";
import { onlyNumber } from "../../components/onlyNumber";
import { useGetDistrictsQuery } from "../../features/districtApi";
import {
  useAddDoctorMutation,
  useGetSpecialestsQuery,
  useGetTitlesQuery,
  useUpdateDoctorMutation,
} from "../../features/doctorApi";
import { useGetInstitutesQuery } from "../../features/instituteApi";
import { useGetLocationssQuery } from "../../features/locationApi";
import { useGetSubDistrictsQuery } from "../../features/subDistrictApi";

export default function DoctorModal({
  isOpen,
  title,
  setTitle,
  setIsOpen,
  editItem,
  isFetching,
  setEditItem,
  setToast,
}) {
  const [addDoctor, { doctorData, error, isError, isLoading, isSuccess }] =
    useAddDoctorMutation();

  const [shedules, setShedules] = useState([]);

  const [singleShedulem, setSingleShedule] = useState({
    day: "",
    start_time: "",
    end_time: "",
    appointment: 0,
    day_name: "",
  });

  const [sheduleError, setSheduleError] = useState({});

  const [instituteSearchUrl, setInstituteSearchUrl] = useState("");
  const { data: instituteData, isFetching: instituteFetching } =
    useGetInstitutesQuery(instituteSearchUrl, {
      refetchOnMountOrArgChange: true,
    });

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
  const { data: specialestData, isFetching: specialestFetching } =
    useGetSpecialestsQuery();
  const { data: titlesData, isFetching: titleFetching } = useGetTitlesQuery();

  const [dayList, setDayList] = useState([
    { value: "6", text: "Saterday" },
    { value: "0", text: "Sunday" },
    { value: "1", text: "Monday" },
    { value: "2", text: "Tuesday" },
    { value: "3", text: "Wednesday" },
    { value: "4", text: "Thursday" },
    { value: "5", text: "Friday" },
  ]);

  const [autoCompleteName, setAutCompleteName] = useState({
    district_id: "",
    district_name: "Select District",
    subDistrict_id: "",
    subDistrict_name: "Select Sub-district",
  });

  const [
    updateDoctor,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdateDoctorMutation();

  let initial = {
    district_id: "",
    subDistrict_id: "",
    location_id: "",
    name: "",
    phone: "",
    email: "",
    specialest_id: "",
    title_id: "",
    institute_id: "",
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
      if (!values.location_id) {
        errors.location_id = "The location name is Required";
      }
      if (!values.name) {
        errors.name = "The name is Required";
      }
      if (!values.phone) {
        errors.phone = "The phone number is Required";
      }
      // if (values.phone && values.phone.length < 14) {
      //   errors.phone = "The phone number is not valid!";
      // }

      if (!values.email) {
        errors.email = "The email is Required";
      }
      const validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      if (values.email && !validRegex.test(values.email)) {
        errors.email = "The email is not valid! ";
      }

      if (!values.institute_id) {
        errors.institute_id = "The institute is Required";
      }
      if (!values.specialest_id) {
        errors.specialest_id = "The specialest is Required";
      }
      if (!values.title_id) {
        errors.title_id = "The title is Required";
      }

      return errors;
    },
    onSubmit: (values) => {
      const currentValues = {
        ...values,
        shedules: shedules,
        status: values?.status ? "1" : "2",
      };

      if (editItem?.id) {
        updateDoctor({ id: editItem?.id, data: currentValues });
      } else {
        addDoctor(currentValues);
      }
    },
  });

  useEffect(() => {
    if (editItem?.id || editItem?.upozila_id) {
      formik.setValues({
        id: editItem?.id,
        status: editItem?.status == 1 ? true : false,
        phone: editItem?.phone,
        reg_number: editItem?.reg_number,
        name: editItem?.name,
        email: editItem?.email,
        district_id: editItem?.district_id?._id,
        subDistrict_id: editItem?.subDistrict_id?._id,
        location_id: editItem?.location_id?._id,
        title_id: editItem?.title_id?._id,
        specialest_id: editItem?.specialest_id?._id,
        institute_id: editItem?.institute_id?._id,
      });
      setAutCompleteName({
        district_id: editItem?.district_id?._id,
        district_name: editItem?.district_id?.name,
        subDistrict_name: editItem?.subDistrict_id?.name,
        subDistrict_id: editItem?.subDistrict_id?._id,
        location_id: editItem?.location_id?._id,
        location_name: editItem?.location_id?.name,
        title_id: editItem?.title_id?._id,
        title_name: editItem?.title_id?.name,
        specialest_id: editItem?.specialest_id?._id,
        specialest_name: editItem?.specialest_id?.name,
        institute_id: editItem?.institute_id?._id,
        institute_name: editItem?.institute_id?.name,
      });
      setShedules(
        editItem?.shedules.map((i) => {
          return {
            ...i,
            start_time: new Date(i.start_time),
            end_time: new Date(i.end_time),
          };
        })
      );
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

  useEffect(() => {
    if (isUpdateSuccess) {
      setToast({ message: "Successfully Updated", fetch: true });
      toggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess]);

  const handleSelectChange = (e, fieldId, fieldName, setUrlStr) => {
    if (fieldId === "district_id") {
      console.log(e);
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
      console.log(e);
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
    } else {
      if (e) {
        console.log(fieldId);
        console.log(fieldName);
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
      console.log(subDistrict_id);
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

  const handlePhoneNumber = (e) => {
    console.log(e.target.value);
    if (e.target.value.length <= 14) {
      formik.setValues({ ...formik.values, phone: onlyNumber(e.target.value) });
    }
  };

  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true, // This makes it use AM/PM format
  };

  const handleChangeShedule = (e, fieldName) => {
    if (fieldName === "day") {
      const selectedOption = e.target.options[e.target.selectedIndex];
      console.log(e);
      const name = selectedOption.getAttribute("data-name");
      setSingleShedule({
        ...singleShedulem,
        day: e.target.value,
        day_name: name,
      });
    } else {
      setSingleShedule({ ...singleShedulem, [fieldName]: e });
    }
  };

  const removeDay = (e) => {
    // let index;
    // dayList.map((item, i) => {
    //   if (item.value == e) {
    //     index = i;
    //   }
    // });
    const currentDayList = dayList.filter((i) => i.value != e);
    setDayList(currentDayList);
    // return index;
  };

  const handleAddShedule = () => {
    const { day, start_time, end_time } = singleShedulem;
    console.log(singleShedulem.day);

    const errors = {};

    if (!Boolean(day)) {
      errors.day = "Day is required !";
    }
    if (!start_time) {
      errors.start_time = "Start time is required !";
    }
    console.log(sheduleError);
    if (!end_time) {
      errors.end_time = "End time is required !";
    }

    setSheduleError(errors);

    if (singleShedulem?.edit && day && start_time && end_time) {
      shedules.splice(singleShedulem?.index, 1, singleShedulem);
      setSingleShedule({
        day: "",
        start_time: "",
        end_time: "",
        appointment: 0,
        day_name: "",
      });
      setSheduleError({});
      removeDay(day);
    } else if (day && start_time && end_time) {
      if (shedules.find((i) => i.day === singleShedulem?.day)) {
        alert("Cann't create multiple shedule in a single day.");
      } else {
        setShedules([...shedules, singleShedulem]);
        setSingleShedule({
          day: "",
          start_time: "",
          end_time: "",
          appointment: 0,
          day_name: "",
        });
        setSheduleError({});
        removeDay(day);
      }
    }
  };

  const addOption = (item) => {
    dayList.push({ value: item?.day, text: item?.day_name });
  };

  const handleSheduleRemove = (index, item) => {
    addOption(item);
    shedules.splice(index, 1);
  };

  const handleSheduleEdit = (item, index) => {
    addOption(item);
    setSingleShedule({ ...item, edit: true, index });
  };

  useEffect(() => {
    console.log(dayList);
    if (editItem?.id) {
      const updateDayList = dayList.filter((i) => {
        const option = editItem?.shedules.find((j) => j.day == i.value);
        console.log(editItem?.shedules);
        console.log(option);
        if (option?.day) {
          return false;
        } else {
          return true;
        }
      });
      setDayList(updateDayList);
    }
  }, [editItem]);

  console.log(editItem);

  return (
    <form>
      <Modal isOpen={isOpen} size="xl" toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {title === "View" ? "" : title} Doctor
        </ModalHeader>
        <ModalBody>
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
            <Row>
              <Col lg="6">
                <FormGroup>
                  <Label>Doctor Name</Label>
                  <Input
                    name="name"
                    id="name"
                    placeholder="Doctor Name"
                    isTouched={formik.touched.name}
                    invalidFeedback={formik.errors.name}
                    isValid={formik.isValid}
                    value={formik.values?.name ?? ""}
                    onChange={formik.handleChange}
                  />{" "}
                </FormGroup>
              </Col>
              <Col lg="6">
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    name="email"
                    id="email"
                    placeholder="Email"
                    isTouched={formik.touched.email}
                    invalidFeedback={formik.errors.email}
                    isValid={formik.isValid}
                    value={formik.values?.email ?? ""}
                    onChange={formik.handleChange}
                  />{" "}
                </FormGroup>
              </Col>
              <Col lg="6">
                <FormGroup>
                  <Label>Registration Number</Label>
                  <Input
                    name="reg_number"
                    id="reg_number"
                    placeholder="Registration Number"
                    isTouched={formik.touched.reg_number}
                    invalidFeedback={formik.errors.reg_number}
                    isValid={formik.isValid}
                    value={formik.values?.reg_number ?? ""}
                    onChange={formik.handleChange}
                  />{" "}
                </FormGroup>
              </Col>
              <Col lg="6">
                <FormGroup>
                  <Label>Phone</Label>
                  <Input
                    name="phone"
                    id="phone"
                    placeholder="Phone"
                    isTouched={formik.touched.phone}
                    invalidFeedback={formik.errors.phone}
                    isValid={formik.isValid}
                    value={formik.values?.phone ?? ""}
                    onChange={handlePhoneNumber}
                  />{" "}
                </FormGroup>
              </Col>
              <Col lg="6">
                <FormGroup className="">
                  <Label for="specialest">Specialest</Label>
                  <Select
                    id="specialest"
                    value={{
                      value: autoCompleteName?.specialest,
                      label: autoCompleteName?.specialest_name
                        ? autoCompleteName?.specialest_name
                        : "Search Specialest",
                    }}
                    onChange={(e) =>
                      handleSelectChange(e, "specialest_id", "specialest_name")
                    }
                    onInputChange={(e, action) =>
                      handleInputChange(
                        e,
                        action,
                        setsubDistrictSearchUrl,
                        "specialest_id"
                      )
                    }
                    isClearable={autoCompleteName?.specialest_id ? true : false}
                    options={
                      specialestData?.data?.map((i) => ({
                        label: i?.name,
                        value: i?._id,
                      })) ?? []
                    }
                    className="select2-selection"
                    isLoading={specialestFetching}
                    // isDisabled={subDistrictFetching}
                  />
                  {formik.touched.specialest_id &&
                    formik.errors.specialest_id && (
                      <span className="text-danger">
                        {formik.errors.specialest_id}
                      </span>
                    )}
                </FormGroup>
              </Col>{" "}
              <Col lg="6">
                <FormGroup className="">
                  <Label for="institute">Institute</Label>
                  <Select
                    id="institute"
                    value={{
                      value: autoCompleteName?.institute,
                      label: autoCompleteName?.institute_name
                        ? autoCompleteName?.institute_name
                        : "Search Institute",
                    }}
                    onChange={(e) =>
                      handleSelectChange(
                        e,
                        "institute_id",
                        "institute_name",
                        setInstituteSearchUrl
                      )
                    }
                    onInputChange={(e, action) =>
                      handleInputChange(
                        e,
                        action,
                        setInstituteSearchUrl,
                        "institute_id"
                      )
                    }
                    isClearable={autoCompleteName?.institute_id ? true : false}
                    options={
                      instituteData?.data?.data?.map((i) => ({
                        label: i?.name,
                        value: i?._id,
                      })) ?? []
                    }
                    className="select2-selection"
                    isLoading={instituteFetching}
                    // isDisabled={subDistrictFetching}
                  />
                  {formik.touched.institute_id &&
                    formik.errors.institute_id && (
                      <span className="text-danger">
                        {formik.errors.institute_id}
                      </span>
                    )}
                </FormGroup>
              </Col>{" "}
              <Col lg="6">
                <FormGroup className="">
                  <Label for="title">Title</Label>
                  <Select
                    id="title"
                    value={{
                      value: autoCompleteName?.title_id,
                      label: autoCompleteName?.title_name
                        ? autoCompleteName?.title_name
                        : "Search Title",
                    }}
                    onChange={(e) =>
                      handleSelectChange(e, "title_id", "title_name")
                    }
                    onInputChange={(e, action) =>
                      handleInputChange(e, action, "title_id")
                    }
                    isClearable={autoCompleteName?.title_id ? true : false}
                    options={
                      titlesData?.data?.map((i) => ({
                        label: i?.name,
                        value: i?._id,
                      })) ?? []
                    }
                    className="select2-selection"
                    isLoading={titleFetching}
                    // isDisabled={subDistrictFetching}
                  />
                  {formik.touched.title_id && formik.errors.title_id && (
                    <span className="text-danger">
                      {formik.errors.title_id}
                    </span>
                  )}
                </FormGroup>
              </Col>
              <Col lg="6">
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
              </Col>
              <Col lg="6">
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
                      handleSelectChange(
                        e,
                        "subDistrict_id",
                        "subDistrict_name"
                      )
                    }
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
                </FormGroup>
              </Col>
              <Col lg="6">
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
              </Col>{" "}
              <Col lg="12">
                <FormGroup row>
                  <Label sm="2" className="pt-0">
                    Status
                  </Label>
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
              </Col>
              <h5 className="my-3">Weakly Shedule</h5>
              <Col lg="3">
                <Input
                  name="day"
                  type="select"
                  label="Day"
                  onChange={(e) => handleChangeShedule(e, "day")}
                  value={singleShedulem?.day}
                  list={
                    dayList.sort((a, b) => Number(a.value) - Number(b.value)) ??
                    []
                  }
                  invalidFeedback={sheduleError?.day}
                />
                <span className="text-danger">
                  {!singleShedulem?.day && sheduleError?.day}
                </span>
              </Col>
              <Col lg="3">
                <Label>Start Time</Label>
                <ReactDatePicker
                  selected={singleShedulem?.start_time}
                  onChange={(date) => handleChangeShedule(date, "start_time")}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  placeholderText="Start date"
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                />
                <span className="text-danger">
                  {!singleShedulem?.start_time && sheduleError?.start_time}
                </span>
              </Col>
              <Col lg="4" className="mb-3">
                <Label>End Time</Label>
                <div className="d-flex gap-2">
                  <div>
                    <ReactDatePicker
                      selected={singleShedulem?.end_time}
                      onChange={(date) => handleChangeShedule(date, "end_time")}
                      showTimeSelect
                      showTimeSelectOnly // This prop ensures only time is displayed
                      timeIntervals={15}
                      placeholderText="End date"
                      disabled={singleShedulem?.start_time ? false : true}
                      minTime={new Date().setHours(
                        new Date(singleShedulem?.start_time).getHours(),
                        new Date(singleShedulem?.start_time).getMinutes() + 15
                      )}
                      maxTime={new Date().setHours(23, 59)}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                    />
                  </div>
                  <Button color="outline-success" onClick={handleAddShedule}>
                    {singleShedulem?.edit ? "Edit" : "Add"}
                  </Button>
                </div>
                <span className="text-danger">
                  {!singleShedulem?.end_time && sheduleError?.end_time}
                </span>
              </Col>
              {shedules.length > 0 && (
                <Col lg="12">
                  <div className="table-responsive index-table mt-3">
                    <table className="table mb-0">
                      <thead className="">
                        <tr>
                          <th>Day</th>
                          <th>Start Time</th>
                          <th>End Time</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shedules.map((item, index) => (
                          <tr key={index}>
                            <td>{item?.day_name}</td>
                            <td>
                              {item?.start_time?.toLocaleTimeString(
                                "en-US",
                                options
                              )}
                            </td>
                            <td>
                              {item?.end_time?.toLocaleTimeString(
                                "en-US",
                                options
                              )}
                            </td>
                            <td>
                              <Link
                                to="#"
                                onClick={() => handleSheduleEdit(item, index)}
                              >
                                <i className="bi bi-pencil me-2"></i>
                              </Link>
                              &nbsp;
                              <Link
                                to="#"
                                onClick={() => handleSheduleRemove(index, item)}
                              >
                                <i className="ri-delete-bin-6-line"></i>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Col>
              )}
            </Row>
          )}
        </ModalBody>
        {title !== "View" && !isFetching && (
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
        )}
      </Modal>
    </form>
  );
}
