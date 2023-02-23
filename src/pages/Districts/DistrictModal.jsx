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
import {
  useAddDistrictMutation,
  useGetDistrictsQuery,
  useUpdateDistrictMutation,
} from "../../features/districtApi";
import { useGetLocationssQuery } from "../../features/locationApi";
import { useGetUpozilasQuery } from "../../features/upozilaApi";

export const options = [
  { value: "Kushtia Medical College", label: "Kushtia Medical College" },
  { value: "Jessore Medical College", label: "Jessore Medical College" },
  { value: "Dhaka Medical College", label: "Dhaka Medical College" },
];

export const locationList = [
  { value: "Hospital More", label: "Hospital More" },
  { value: "College More", label: "College More" },
  { value: "Jogoti", label: "Jogoti" },
];

const specialestData = [
  { name: "Medicin", id: "1" },
  { name: "Neurologiest", id: "2" },
  { name: "Nose Hair", id: "3" },
  { name: "Dentiest", id: "4" },
];

export const doctorTitles = [
  { name: "Professor", id: "1" },
  { name: "Associet Professor", id: "2" },
  { name: "Health Doctor", id: "3" },
  { name: "Department Head", id: "4" },
];

export default function DistrictModal({
  isOpen,
  setIsOpen,
  editItem,
  setEditItem,
  setToast,
}) {
  const [addDistrict, { isLoading, isSuccess }] = useAddDistrictMutation();

  const { data: zilas, isSuccess: isZillaSuccess } = useGetDistrictsQuery("");

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
    updateDistrict,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdateDistrictMutation();

  let initial = {
    district_name: "",
    status: true,
  };

  const formik = useFormik({
    initialValues: initial,
    validate: (values) => {
      const errors = {};

      if (!values.district_name) {
        errors.district_name = "The district Name is Required";
      }

      return errors;
    },
    onSubmit: (values) => {
      const currentValues = { ...values };

      if (editItem?.id) {
        updateDistrict({ id: editItem?.id, data: currentValues });
      } else {
        addDistrict(currentValues);
      }
    },
  });

  useEffect(() => {
    if (editItem?.id) {
      formik.setValues({ ...editItem });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editItem]);

  console.log(editItem);

  const toggle = () => {
    setIsOpen(false);
    formik.resetForm();
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

  return (
    <form>
      <Modal isOpen={isOpen} size="" toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {editItem?.id ? "Update" : "Add"} District
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-12">
              <FromInput
                name="district_name"
                id="district_name"
                label="District Name"
                placeholder="District Name"
                isTouched={formik.touched.district_name}
                invalidFeedback={formik.errors.district_name}
                isValid={formik.isValid}
                value={formik.values?.district_name ?? ""}
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
      </Modal>
    </form>
  );
}
