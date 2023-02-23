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
import { useGetDistrictsQuery } from "../../features/districtApi";
import {
  useAddUpozilaMutation,
  useUpdateUpozilaMutation,
} from "../../features/upozilaApi";

export default function UpozilaModal({
  isOpen,
  setIsOpen,
  editItem,
  setEditItem,
  setToast,
}) {
  const [addUpozila, { isLoading, isSuccess }] = useAddUpozilaMutation();

  const [autoCompleteName, setAutCompleteName] = useState({
    district_name: "",
    district_id: "",
  });

  const { data: districts, isSuccess: isDistrictSuccess } =
    useGetDistrictsQuery("", {
      refetchOnMountorArgChange: true,
    });

  const [
    updateUpozila,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdateUpozilaMutation();

  let initial = {
    district_id: "",
    upozila_name: "",
    status: true,
  };


  const formik = useFormik({
    initialValues: initial,
    validate: (values) => {
      const errors = {};

      if (!values.district_id) {
        errors.district_id = "The district Name is Required";
      }
      if (!values.upozila_name) {
        errors.upozila_name = "The upozila Name is Required";
      }

      return errors;
    },
    onSubmit: (values) => {
      const currentValues = { ...values };

      if (editItem?.id) {
        updateUpozila({ id: editItem?.id, data: currentValues });
      } else {
        addUpozila(currentValues);
      }
    },
  });

  useEffect(() => {
    if (editItem?.id || editItem?.district_name) {
      formik.setValues({ ...editItem });
      setAutCompleteName({
        district_id: editItem?.district_id,
        district_name: editItem?.district_name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editItem]);

  const toggle = () => {
    setIsOpen(false);
    formik.resetForm();
    setEditItem({});
    setAutCompleteName({ district_id: "", district_name: "" });
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
      setAutCompleteName({ district_name: e.label, district_id: e.id });
      formik.setValues({
        ...formik.values,
        district_name: e.label,
        district_id: e.id,
      });
    } else {
      setAutCompleteName({ district_name: "", district_id: "" });
      formik.setValues({
        ...formik.values,
        district_name: "",
        district_id: "",
      });
    }
  };

  return (
    <form>
      <Modal isOpen={isOpen} size="" toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {editItem?.id ? "Update" : "Add"} Upozila
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-12">
              <SearchSelect
                list={selectDataFormate(
                  isDistrictSuccess,
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
                name="district"
                onChange={(e) => handleSearchChange(e)}
              />
            </div>
            <div className="col-md-12">
              <FromInput
                name="upozila_name"
                id="upozila_name"
                label="Upozila Name"
                placeholder="Upozila Name"
                isTouched={formik.touched.upozila_name}
                invalidFeedback={formik.errors.upozila_name}
                isValid={formik.isValid}
                value={formik.values?.upozila_name ?? ""}
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
