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
import {
  useAddLocationMutation,
  useUpdateLocationMutation,
} from "../../features/locationApi";
import { useGetUpozilasQuery } from "../../features/upozilaApi";

export default function LocationModal({
  isOpen,
  setIsOpen,
  editItem,
  setEditItem,
  setToast,
}) {
  const [addLocation, { isLoading, isSuccess }] = useAddLocationMutation();

  const [autoCompleteName, setAutCompleteName] = useState({
    upozila_name: "",
    upozila_id: "",
  });

  const { data: upozilas, isSuccess: isUpozilasSuccess } = useGetUpozilasQuery(
    "",
    {
      refetchOnMountorArgChange: true,
    }
  );


  const [
    updateLocation,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdateLocationMutation();

  let initial = {
    upozila_id: "",
    location_name: "",
    status: true,
  };


  const formik = useFormik({
    initialValues: initial,
    validate: (values) => {
      const errors = {};

      if (!values.upozila_id) {
        errors.upozila_id = "The upozila Name is Required";
      }
      if (!values.location_name) {
        errors.location_name = "The location Name is Required";
      }

      return errors;
    },
    onSubmit: (values) => {
      const currentValues = { ...values };

      if (editItem?.id) {
        updateLocation({ id: editItem?.id, data: currentValues });
      } else {
        addLocation(currentValues);
      }
    },
  });

  useEffect(() => {
    if (editItem?.id || editItem?.upozila_id) {
      formik.setValues({ ...editItem });
      setAutCompleteName({
        upozila_id: editItem?.upozila_id,
        upozila_name: editItem?.upozila_name,
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
    if (e) {
      setAutCompleteName({ upozila_name: e.label, upozila_id: e.id });
      formik.setValues({
        ...formik.values,
        upozila_name: e.label,
        upozila_id: e.id,
      });
    } else {
      setAutCompleteName({ upozila_name: "", upozila_id: "" });
      formik.setValues({
        ...formik.values,
        upozila_name: "",
        upozila_id: "",
      });
    }
  };

  return (
    <form>
      <Modal isOpen={isOpen} size="" toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {editItem?.id ? "Update" : "Add"} Location
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-12">
              <SearchSelect
                list={selectDataFormate(
                  isUpozilasSuccess,
                  upozilas?.data,
                  "upozila_name"
                )}
                isTouched={formik.touched.upozila_id}
                invalidFeedback={formik.errors.upozila_id}
                isValid={formik.isValid}
                value={formatValue(
                  autoCompleteName?.upozila_name,
                  "Select Upozila"
                )}
                label="Upozila"
                name="upozila"
                onChange={(e) => handleSearchChange(e)}
              />
            </div>
            <div className="col-md-12">
              <FromInput
                name="location_name"
                id="location_name"
                label="Location Name"
                placeholder="Location Name"
                isTouched={formik.touched.location_name}
                invalidFeedback={formik.errors.location_name}
                isValid={formik.isValid}
                value={formik.values?.location_name ?? ""}
                onChange={formik.handleChange}
              />
            </div>
            <div className="col-md-12">
              <div className="d-flex align-items-center gap-5">
                <label>Status</label>
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
