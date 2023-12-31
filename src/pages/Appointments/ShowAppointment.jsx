import React, { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import ActionButton from "../../components/ActionButton";
import DeleteAlert from "../../components/DeleteAlert";
import FromInput from "../../components/FromInput";
import FromSelect from "../../components/FromSelect";
import ReactPagination from "../../components/ReactPagination";
import SearchHandler from "../../components/SearchHandler";
import SearchSelect from "../../components/SearchSelect";
import formatValue from "../../components/formatValue";
import { searchUrl } from "../../components/searchFields";
import { selectDataFormate } from "../../components/selectDataFormate";
import { tConvert } from "../../components/tConvert";
import {
  useDeleteAppointmentMutation,
  useGetAppointmentQuery,
  useGetAppointmentsQuery,
  useUpdateAppointmentMutation,
} from "../../features/appointmentApi";
import { useGetDoctorsQuery } from "../../features/doctorApi";
import { useGetLocationssQuery } from "../../features/locationApi";
import AppointementsModal from "./AppointementsModal";
import ShowAppointment from "./ShowAppointment";

const searchTextFieldsName = {
  date: "",
  patient_name: "",
};

const searchFieldsName = {
  date: "",

  doctor_name: "",
  doctor_id: "",
  page: 1,
  limit: 10,
};

const appointmentStatusList = [
  { name: "Pending", value: "Pending", id: 1 },
  { name: "Accepted", value: "Accepted", id: 2 },
  { name: "Rejected", value: "Rejected", id: 3 },
  { name: "Done", value: "Done", id: 4 },
];

export default function ManageAppointments() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [editItem, setEditItem] = useState({});
  const [deleteItemId, setDeleteItemId] = useState(null);

  const { search } = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchFields, setSearchFields] = useState(searchFieldsName);
  const [autoCompleteName, setAutCompleteName] = useState({
    doctor_id: "",
  });

  const [searchTextFields, setSearchTextFields] =
    useState(searchTextFieldsName);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [toastObj, setToast] = useState({});
  const [isOpenShow, setIsOpenShow] = useState(false);

  const { data: doctors, isSuccess: isDistrictSuccess } = useGetDoctorsQuery(
    "",
    {
      refetchOnMountorArgChange: true,
    }
  );

  const [urlString, setUrlString] = useState(``);
  const {
    data: appointments,
    isLoading,
    isSuccess,
  } = useGetAppointmentsQuery(urlString, { refetchOnMountorArgChange: true });

  const [doctorId, setDoctorId] = useState("");
  const {
    data: showShedule,
    isSuccess: isShowSheduleSuccess,
    isFetching,
    refetch,
  } = useGetAppointmentQuery(doctorId, {
    refetchOnMountorArgChange: true,
  });

  const [deleteAppointment, { isSuccess: isDeleteSuccess }] =
    useDeleteAppointmentMutation();

  const { data: locationList, isSuccess: isLocationSuccess } =
    useGetLocationssQuery("", {
      refetchOnMountorArgChange: true,
    });

  const [
    updateAppointment,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdateAppointmentMutation();

  const statusUpdate = (data, e) => {
    updateAppointment({ id: data?.id, data: { ...data, status: e } });
  };

  useEffect(() => {
    if (toastObj?.message) {
      toast.success(toastObj?.message, { autoClose: 1000 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastObj]);

  useEffect(() => {
    let url = searchUrl(searchFields);
    if (url.length > 0) {
      url = "?".concat(url);
    }
    setUrlString(url);
    setSearchParams(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFields]);

  const handleUpdate = (id) => {
    setIsOpen(true);
    if (doctorId === id) {
      refetch();
    } else {
      setDoctorId(id);
    }
  };

  const showDistrict = (id) => {
    setIsOpenShow(true);
    if (doctorId === id) {
      refetch();
    } else {
      setDoctorId(id);
    }
  };

  useEffect(() => {
    setSearchFields({ ...searchFields, page: page, limit: limit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  useEffect(() => {
    if (search) {
      const result = Object.fromEntries([...searchParams]);

      const { upozila_name, doctor_name, doctor_id } = result;
      setSearchFields({
        ...searchFields,
        upozila_name,
        doctor_name,
        doctor_id,
      });
      setSearchTextFields({ ...searchTextFields, upozila_name });
      setAutCompleteName({ doctor_name, doctor_id });
    }
  }, []);

  useEffect(() => {
    if (!isFetching && isShowSheduleSuccess) {
      setEditItem(showShedule);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, isShowSheduleSuccess, showShedule]);

  const handleAddDoctor = () => {
    setIsOpen(true);
    setEditItem({});
  };

  const handleDelete = (id) => {
    deleteAppointment(id);
    setIsOpenAlert(false);
  };

  const handleChange = (e) => {
    setSearchTextFields({
      ...searchTextFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleKeyDown = (e) => {
    if (e?.key === "Enter") {
      setSearchFields({
        ...searchFields,
        ...searchTextFields,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleOnChangeSelect = (e) => {
    setSearchFields({
      ...searchFields,
      ...searchTextFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchChange = (e, fieldName) => {
    if (fieldName === "doctor_id") {
      if (e) {
        setAutCompleteName({ doctor_id: e.id, doctor_name: e.doctor_name });
        setSearchFields({
          ...searchFields,
          ...searchTextFields,
          doctor_id: e.id,
          doctor_name: e.doctor_name,
        });
      } else {
        setAutCompleteName({ doctor_id: "", doctor_name: "" });
        setSearchFields({
          ...searchFields,
          ...searchTextFields,
          doctor_id: "",
          doctor_name: "",
        });
      }
    } else if (fieldName === "location_id") {
      if (e) {
        setAutCompleteName({
          location_id: e.id,
          location_name: e.location_name,
        });
        setSearchFields({
          ...searchFields,
          ...searchTextFields,
          location_id: e.id,
          location_name: e.location_name,
        });
      } else {
        setAutCompleteName({ location_id: "", location_name: "" });
        setSearchFields({
          ...searchFields,
          ...searchTextFields,
          location_id: "",
          location_name: "",
        });
      }
    }
  };

  const handleAllSearch = () => {
    setSearchFields({ ...searchFields, ...searchTextFields });
  };

  const cancelSearch = () => {
    setSearchFields(searchFieldsName);
    setSearchTextFields(searchTextFieldsName);
    setAutCompleteName({ doctor_id: "", doctor_name: "" });
    setPage(1);
    setLimit(10);
  };

  let content = null;

  if (isLoading && !isSuccess) {
    content = (
      <tbody>
        <tr>
          <td>Loading...</td>
        </tr>
      </tbody>
    );
  }
  if (!isLoading && isSuccess && appointments?.data.data?.length === 0) {
    content = (
      <tbody>
        <tr>
          <td>There is no doctos.</td>
        </tr>
      </tbody>
    );
  }
  if (!isLoading && isSuccess && appointments?.data?.data?.length > 0) {
    content = (
      <tbody>
        {appointments?.data?.data.map((item, index) => (
          <tr key={index} className="align-middle">
            <td>{index + 1}</td>

            <td>{item?.patient_name}</td>
            <td>
              <Link to={`/doctors/${item?.doctor_id}`}>
                {item?.doctor_name}
              </Link>
            </td>
            <td>{item?.date}</td>
            <td>{tConvert(item?.start_time)}</td>
            <td>{tConvert(item?.end_time)}</td>
            <td>{tConvert(item?.location_name)}</td>
            <td>
              <UncontrolledDropdown>
                <DropdownToggle
                  caret
                  color={
                    (item?.status === "Accepted" && "success") ||
                    (item?.status === "Pending" && "info") ||
                    (item?.status === "Rejected" && "danger") ||
                    (item?.status === "Done" && "dark")
                  }
                  style={{ width: "100px" }}
                >
                  {item?.status}
                </DropdownToggle>

                <DropdownMenu style={{ width: "100px" }}>
                  {(item?.status === "Accepted" ||
                    item?.status === "Rejected") && (
                    <DropdownItem onClick={() => statusUpdate(item, "Pending")}>
                      Pending
                    </DropdownItem>
                  )}
                  {item?.status === "Pending" && (
                    <DropdownItem
                      onClick={() => statusUpdate(item, "Accepted")}
                    >
                      Accepted
                    </DropdownItem>
                  )}
                  {item?.status === "Pending" && (
                    <DropdownItem
                      onClick={() => statusUpdate(item, "Rejected")}
                    >
                      Rejected
                    </DropdownItem>
                  )}
                  {item?.status === "Accepted" && (
                    <DropdownItem onClick={() => statusUpdate(item, "Done")}>
                      Done
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </UncontrolledDropdown>
            </td>
            <td>{new Date(item?.create_at).toLocaleString()}</td>
            <td className="d-flex gap-2">
              <ActionButton
                id={item?.id}
                edit={item?.status === "Done" ? false : true}
                handleUpdate={handleUpdate}
                setDeleteItemId={setDeleteItemId}
                setIsOpenAlert={setIsOpenAlert}
              />
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h5>Appointments</h5>
        <button
          onClick={handleAddDoctor}
          type="button"
          className="btn btn-primary"
        >
          <span className="d-flex gap-2">
            <i className="bi bi-plus-circle"></i>
            Add Appointment
          </span>{" "}
        </button>
      </div>
      <div>
        <div style={{ height: "400px" }} className="overflow-scroll">
          <table className="table">
            <thead>
              <tr className="align-middle">
                <th scope="col">SL</th>
                <th scope="col" style={{ minWidth: "170px" }}>
                  Patient Name
                </th>
                <th scope="col" style={{ minWidth: "170px" }}>
                  Doctor Name
                </th>
                <th scope="col" style={{ minWidth: "150px" }}>
                  Date
                </th>
                <th scope="col" style={{ minWidth: "100px" }}>
                  State Time
                </th>
                <th scope="col" style={{ minWidth: "100px" }}>
                  End Time
                </th>
                <th scope="col" style={{ minWidth: "180px" }}>
                  Patient Locations
                </th>

                <th scope="col" style={{ minWidth: "120px" }}>
                  Status
                </th>
                <th scope="col" style={{ minWidth: "180px" }}>
                  Created Time
                </th>
                <th scope="col">Actions</th>
              </tr>
              <tr className="align-middle">
                <th></th>
                <td>
                  <FromInput
                    name="patient_name"
                    id="patient_name"
                    placeholder="Patient Name"
                    value={searchTextFields?.patient_name}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                </td>
                <td>
                  <SearchSelect
                    list={selectDataFormate(
                      isDistrictSuccess,
                      doctors?.data,
                      "doctor_name"
                    )}
                    value={formatValue(autoCompleteName?.doctor_name, "Doctor")}
                    name="doctor_name"
                    onChange={(e) => handleSearchChange(e, "doctor_id")}
                  />
                </td>
                <td>
                  <FromInput
                    name="date"
                    id="date"
                    placeholder="Date"
                    value={searchTextFields?.date}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                </td>

                <td></td>
                <td></td>
                <td>
                  <SearchSelect
                    list={selectDataFormate(
                      isLocationSuccess,
                      locationList?.data,
                      "location_name"
                    )}
                    value={formatValue(
                      autoCompleteName?.location_name,
                      "Location"
                    )}
                    name="location_id"
                    onChange={(e) => handleSearchChange(e, "location_id")}
                  />
                </td>
                <th>
                  <FromSelect
                    list={appointmentStatusList ?? []}
                    name="status"
                    id="status"
                    placeholder="Status"
                    value={searchFields?.status ?? ""}
                    onChange={handleOnChangeSelect}
                  />
                </th>
                <td></td>
                <SearchHandler
                  searchFields={searchFields}
                  searchTextFields={searchTextFields}
                  handleSearch={handleAllSearch}
                  cancelSearch={cancelSearch}
                />
              </tr>
            </thead>
            {content}
          </table>

          <DeleteAlert
            isOpen={isOpenAlert}
            setIsOpen={setIsOpenAlert}
            handleDelete={handleDelete}
            deleteItemId={deleteItemId}
            setDeleteItemId={setDeleteItemId}
          />

          <ToastContainer />
        </div>
        <AppointementsModal
          editItem={isOpen && editItem}
          setEditItem={setEditItem}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          setToast={setToast}
        />

        <ShowAppointment
          setIsOpen={setIsOpenShow}
          isOpen={isOpenShow}
          editItem={editItem}
          setEditItem={setEditItem}
        />

        <ReactPagination
          total={appointments?.total}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
        />
      </div>
    </>
  );
}
