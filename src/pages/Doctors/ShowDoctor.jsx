import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Badge, Card, CardBody, Col, Spinner } from "reactstrap";
import Button from "../../components/bootstrap/Button";
import Breadcrumb from "../../components/common/Breadcrumb";
import { options } from "../../components/helpers/options";
import { useGetDoctorQuery } from "../../features/doctorApi";
import DoctorModal from "./DoctorModal";

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
    refetch();
  }, []);

  useEffect(() => {
    if (isSuccess && !isFetching) {
      setEditItem(showDoctor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isFetching]);

  const {
    _id,
    name,
    email,
    phone,
    specialest_id,
    title_id,
    institute_id,
    status_name,
    status,
    district_id,
    subDistrict_id,
    location_id,
    reg_number,
    shedules,
  } = showDoctor?.data || {};

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

  console.log(new Date().toLocaleDateString());

  return (
    <div className="page-content">
      <div className="mt-4 d-flex align-items-center justify-content-between">
        <div></div>
      </div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="mb-3">
            <i className="mdi mdi-city-variant text-primary me-1"></i>Doctor
            Detail
          </h5>
          <Breadcrumb
            title={"Doctor Detail"}
            list={[
              { title: "Dashboard", to: "/dashboard" },
              { title: "Doctors", to: "/doctors?page=1&limit=20" },
              { title: "Doctor Detail", to: "" },
            ]}
          />
        </div>
        <div>
          <Button
            icon="bi bi-pencil"
            size="sm"
            color="success"
            disabled={isFetching}
            onClick={() => handleUpdate(id)}
          >
            Update
          </Button>
        </div>
      </div>
      <Card className="mt-2">
        <CardBody>
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
          {!isFetching && (
            <div className="row">
              <div className="col-md-6">
                <table class="table table-striped">
                  <tbody>
                    <tr>
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
                      <th scope="row">Registration Number</th>
                      <td>:</td>
                      <td>{reg_number}</td>
                    </tr>
                    <tr>
                      <th scope="row">Specialest</th>
                      <td>:</td>
                      <td>{specialest_id?.name}</td>
                    </tr>
                    <tr>
                      <th scope="row">Title</th>
                      <td>:</td>
                      <td>{title_id?.name}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <table class="table table-striped">
                  <tbody>
                    <tr>
                      <th scope="row">Institute</th>
                      <td>:</td>
                      <td>{institute_id?.name}</td>
                    </tr>
                    <tr>
                      <th scope="row">District</th>
                      <td>:</td>
                      <td>{district_id?.name}</td>
                    </tr>
                    <tr>
                      <th scope="row">Sub-district</th>
                      <td>:</td>
                      <td>{subDistrict_id?.name}</td>
                    </tr>
                    <tr>
                      <th scope="row">location</th>
                      <td>:</td>
                      <td>{location_id?.name}</td>
                    </tr>
                    <tr>
                      <th scope="row">Status</th>
                      <td>:</td>
                      <td>
                        <Badge color={status == 1 ? "success" : "danger"}>
                          {status_name}
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-lg-12">
                <h5 className="my-3">Weakly Shedule</h5>
                {shedules?.length > 0 && (
                  <Col lg="12">
                    <div className="table-responsive index-table mt-3">
                      <table className="table mb-0">
                        <thead className="">
                          <tr>
                            <th>SL</th>
                            <th>Day</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Pending</th>
                            <th>Accepted</th>
                            <th>Rejected</th>
                            <th>Done</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shedules.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.day_name}</td>
                              <td>
                                {new Date(item?.start_time)?.toLocaleTimeString(
                                  "en-US",
                                  options
                                )}
                              </td>
                              <td>
                                {new Date(item?.end_time)?.toLocaleTimeString(
                                  "en-US",
                                  options
                                )}
                              </td>
                              <td>{item?.appointment?.pending}</td>
                              <td>{item?.appointment?.accepted}</td>
                              <td>{item?.appointment?.rejected}</td>
                              <td>{item?.appointment?.done}</td>
                              <td>
                                <Link
                                  className="text-decoration-none"
                                  to={`/appointments?doctor_name=${name}&doctor_id=${_id}&day=${item?.day}`}
                                >
                                  <i className="ri-eye-fill"></i>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Col>
                )}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
      <ToastContainer />
      {isOpen && (
        <DoctorModal
          isOpen={isOpen}
          editItem={editItem?.data}
          setEditItem={setEditItem}
          isFetching={isFetching}
          setToast={setToast}
          title="Update"
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
}
