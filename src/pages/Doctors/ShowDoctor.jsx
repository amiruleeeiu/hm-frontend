import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "reactstrap";
import DetailPageBreadcrumb from "../../components/DetailPageBreadcrumb";
import Layout from "../../components/Layout";
import { useGetDoctorQuery } from "../../features/doctorApi";
import DoctorsModal from "./DoctorsModal";

export default function ShowDoctor() {
  const { id } = useParams();

  const [editItem, setEditItem] = useState({});

  const {
    data: showDoctor,
    refetch,
    isFetching,
    isSuccess,
  } = useGetDoctorQuery(id, {
    refetchOnMountorArgChange: true,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [toastObj, setToast] = useState({});

  useEffect(() => {
    if (isSuccess && !isFetching) {
      setEditItem(showDoctor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isFetching]);

  const {
    first_name,
    last_name,
    email,
    phone,
    specialest,
    title,
    status,
    district,
    upozila,
    location,
    collegeHospital,
  } = showDoctor || {};

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

  console.log(showDoctor);
  return (
    <Layout title="Doctor information">
      <div className="ms-3">
        <DetailPageBreadcrumb
          indexPage="Doctors"
          indexPageEndPoint={"/doctors"}
          activePage="Doctor Detail"
        />
        <div className="mt-4 d-flex align-items-center justify-content-between">
          <h5>Doctor Detail</h5>
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
                <tr>
                  <th scope="row">Full Name</th>
                  <td>:</td>
                  <td>
                    {first_name} {last_name}
                  </td>
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
                  <th scope="row">Specialest</th>
                  <td>:</td>
                  <td>{specialest}</td>
                </tr>
                <tr>
                  <th scope="row">Title</th>
                  <td>:</td>
                  <td>{title}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
            <table class="table table-striped">
              <tbody>
                <tr>
                  <th scope="row">College/Hospital</th>
                  <td>:</td>
                  <td>{collegeHospital}</td>
                </tr>
                <tr>
                  <th scope="row">District</th>
                  <td>:</td>
                  <td>{district}</td>
                </tr>
                <tr>
                  <th scope="row">Upozila</th>
                  <td>:</td>
                  <td>{upozila}</td>
                </tr>
                <tr>
                  <th scope="row">location</th>
                  <td>:</td>
                  <td>{location}</td>
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
      <DoctorsModal
        editItem={editItem}
        isOpen={isOpen}
        setToast={setToast}
        setIsOpen={setIsOpen}
        setEditItem={setEditItem}
      />
    </Layout>
  );
}
