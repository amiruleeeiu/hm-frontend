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
import formatValue from "../../components/formatValue";
import FromInput from "../../components/FromInput";
import SearchSelect from "../../components/SearchSelect";
import { selectDataFormate } from "../../components/selectDataFormate";
import { useGetDoctorsQuery } from "../../features/doctorApi";
import {
  useAddSheduleMutation,
  useUpdateSheduleMutation,
} from "../../features/sheduleApi";

export default function SheudlesModal({
  isOpen,
  setIsOpen,
  editItem,
  setEditItem,
  setToast,
}) {
  const [addShedule, { isLoading, isSuccess }] = useAddSheduleMutation();

  const [autoCompleteName, setAutCompleteName] = useState({
    doctor_name: "",
    doctor_id: "",
  });

  // const[data:doctors]=useGet

  const { data: doctorsList, isSuccess: isDoctorsSucccess } =
    useGetDoctorsQuery("");

  const [
    updateShedule,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdateSheduleMutation();

  let initial = {
    doctor_name: "",
    doctor_id: "",
    start_time: "",
    end_time: "",
    date: "",
    status: true,
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
        updateShedule({ id: editItem?.id, data: currentValues });
      } else {
        addShedule(currentValues);
      }
    },
  });

  console.log(formik.values);

  useEffect(() => {
    if (editItem?.id || editItem?.district_name) {
      formik.setValues({ ...editItem });
      setAutCompleteName({
        doctor_id: editItem?.doctor_id,
        doctor_name: editItem?.doctor_name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editItem]);

  const toggle = () => {
    setIsOpen(false);
    formik.resetForm();
    setEditItem({});
    setAutCompleteName({ doctor_id: "", doctor_name: "" });
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

  const handleSearchChange = (e) => {
    console.log(e);
    if (e) {
      setAutCompleteName({ doctor_name: e.label, doctor_id: e.id });
      formik.setValues({
        ...formik.values,
        doctor_name: e.label,
        doctor_id: e.id,
      });
    } else {
      setAutCompleteName({ doctor_name: "", doctor_id: "" });
      formik.setValues({
        ...formik.values,
        doctor_name: "",
        doctor_id: "",
      });
    }
  };

  return (
    <form>
      <Modal isOpen={isOpen} size="lg" toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {editItem?.id ? "Update" : "Add"} Shedules
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-6">
              <SearchSelect
                list={selectDataFormate(
                  isDoctorsSucccess,
                  doctorsList?.data,
                  "doctor_name"
                )}
                isTouched={formik.touched.doctor_id}
                invalidFeedback={formik.errors.doctor_id}
                isValid={formik.isValid}
                value={formatValue(
                  autoCompleteName?.doctor_name,
                  "Select Doctor"
                )}
                label="Select Doctor"
                name="doctor_name"
                onChange={(e) => handleSearchChange(e)}
              />
            </div>

            <div className="col-md-6">
              <FromInput
                type="date"
                name="date"
                id="date"
                label="Date"
                placeholder="Upozila Name"
                isTouched={formik.touched.date}
                invalidFeedback={formik.errors.date}
                isValid={formik.isValid}
                value={formik.values?.date ?? ""}
                onChange={formik.handleChange}
              />
            </div>
            <div className="col-md-6">
              <FromInput
                type="time"
                name="start_time"
                id="start_time"
                label="Start Time"
                isTouched={formik.touched.start_time}
                invalidFeedback={formik.errors.start_time}
                isValid={formik.isValid}
                value={formik.values?.start_time ?? ""}
                onChange={formik.handleChange}
              />
            </div>
            <div className="col-md-6">
              <FromInput
                type="time"
                name="end_time"
                id="end_time"
                label="End Time"
                isTouched={formik.touched.end_time}
                invalidFeedback={formik.errors.end_time}
                isValid={formik.isValid}
                value={formik.values?.end_time ?? ""}
                onChange={formik.handleChange}
              />
            </div>

            <div className="col-md-6">
              <div className="d-flex align-items-center gap-5">
                <label>Status</label>
                <div className="d-flex">
                  <div>
                    <input
                      type="radio"
                      id="upozila_active"
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
                    <label for="upozila_active">Active</label>
                  </div>

                  <div>
                    <input
                      type="radio"
                      id="upozila_inactive"
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
                    <label for="upozila_inactive">Inactive</label>
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
      </Modal>
    </form>
  );
}
