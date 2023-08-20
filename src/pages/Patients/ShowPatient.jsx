import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "reactstrap";
import DetailPageBreadcrumb from "../../components/DetailPageBreadcrumb";
import Layout from "../../components/Layout";
import { useGetPatientQuery } from "../../features/patientApi";
import PatientModal from "./PatientModal";

export default function ShowPatient() {
  const { id } = useParams();

  const [editItem, setEditItem] = useState({});

  const {
    data: showPatient,
    refetch,
    isFetching,
    isSuccess,
  } = useGetPatientQuery(id, {
    refetchOnMountorArgChange: true,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [toastObj, setToast] = useState({});

  useEffect(() => {
    if (isSuccess && !isFetching) {
      setEditItem(showPatient);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isFetching]);

  const {
    name,
    email,
    phone,
    symptoms,
    status,
    district_name,
    upozila_name,
    location_name,
  } = showPatient || {};

  const handleUpdate = (id) => {
    refetch();
    setIsOpen(true);
  };

  useEffect(() => {
    if (toastObj?.message) {
      toast.success(toastObj?.message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastObj]);

  return (
    <Layout title="Doctor information">
      <div className="ms-3">
        <DetailPageBreadcrumb
          indexPage="Patients"
          indexPageEndPoint={"/patients"}
          activePage="Patient Detail"
        />
        <div className="mt-4 d-flex align-items-center justify-content-between">
          <h5>Patient Detail</h5>
          <Button color="success" onClick={() => handleUpdate(id)}>
            <span className="d-flex gap-2">
              <i className="bi bi-pencil"></i>Update
            </span>
          </Button>{" "}
        </div>
        <div className="row mt-5">
          <div className="col-md-6">
            <table class="table table-striped">
              <tbody>
                <tr >
                  <th scope="row">Full Name</th>
                  <td>:</td>
                  <td>{name}</td>
                </tr>
                <tr>
                  <th scope="row">Email</th>
                  <td>:</td>
                  <td>{email}</td>
                </tr>
                <tr>
                  <th scope="row">Phone</th>
                  <td>:</td>
                  <td>{phone}</td>
                </tr>
                <tr>
                  <th scope="row">Symptoms</th>
                  <td>:</td>
                  <td>{symptoms}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
            <table class="table table-striped">
              <tbody>
                <tr>
                  <th scope="row">District</th>
                  <td>:</td>
                  <td>{district_name}</td>
                </tr>
                <tr>
                  <th scope="row">Upozila</th>
                  <td>:</td>
                  <td>{upozila_name}</td>
                </tr>
                <tr>
                  <th scope="row">location</th>
                  <td>:</td>
                  <td>{location_name}</td>
                </tr>
                <tr>
                  <th scope="row">Status</th>
                  <td>:</td>
                  <td>{status ? "Active" : "Inactive"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
      <PatientModal
        editItem={editItem}
        isOpen={isOpen}
        setToast={setToast}
        setIsOpen={setIsOpen}
        setEditItem={setEditItem}
      />
    </Layout>
  );
}
