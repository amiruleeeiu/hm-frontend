import React, { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "reactstrap";
import ActionButton from "../../components/ActionButton";
import DeleteAlert from "../../components/DeleteAlert";
import formatValue from "../../components/formatValue";
import FromInput from "../../components/FromInput";
import FromSelect from "../../components/FromSelect";
import { statusList } from "../../components/list";
import ReactPagination from "../../components/ReactPagination";
import { searchUrl } from "../../components/searchFields";
import SearchHandler from "../../components/SearchHandler";
import SearchSelect from "../../components/SearchSelect";
import { selectDataFormate } from "../../components/selectDataFormate";
import Status from "../../components/Status";
import { useGetLocationssQuery } from "../../features/locationApi";
import {
  useDeletePatientMutation,
  useGetPatientQuery,
  useGetPatientsQuery,
  useUpdatePatientMutation,
} from "../../features/patientApi";
import PatientModal from "./PatientModal";

const searchTextFieldsName = {
  name: "",
  phone: "",
  symptoms: "",
};

const searchFieldsName = {
  name: "",
  phone: "",
  symptoms: "",
  page: 1,
  limit: 10,
};

const autoCompleteFieldName = {
  location_name: "",
  location_id: "",
};

export default function ManagePatients() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [editItem, setEditItem] = useState({});
  const [deleteItemId, setDeleteItemId] = useState(null);

  const { search } = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchFields, setSearchFields] = useState(searchFieldsName);
  const [autoCompleteName, setAutCompleteName] = useState(
    autoCompleteFieldName
  );

  const [searchTextFields, setSearchTextFields] =
    useState(searchTextFieldsName);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [toastObj, setToast] = useState({});
  const [isOpenShow, setIsOpenShow] = useState(false);

  const [urlString, setUrlString] = useState(``);
  const {
    data: patients,
    isLoading,
    isSuccess,
  } = useGetPatientsQuery(urlString, { refetchOnMountorArgChange: true });

  const [doctorId, setDoctorId] = useState("");
  const {
    data: showPatient,
    isSuccess: isShowPatientSuccess,
    isFetching,
    refetch,
  } = useGetPatientQuery(doctorId, {
    refetchOnMountorArgChange: true,
  });

  const [deletePatient, { isSuccess: isDeleteSuccess }] =
    useDeletePatientMutation();

  const [
    updatePatient,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdatePatientMutation();

  const { data: locationList, isSuccess: isLocationSuccess } =
    useGetLocationssQuery("", {
      refetchOnMountorArgChange: true,
    });

  const statusUpdate = (data, e) => {
    updatePatient({ id: data?.id, data: { ...data, status: e } });
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

  useEffect(() => {
    setSearchFields({ ...searchFields, page: page, limit: limit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  useEffect(() => {
    if (search) {
      const result = Object.fromEntries([...searchParams]);

      const { location_name, location_id, phone, name, symptoms } = result;

      console.log(location_id);
      setSearchFields({
        ...searchFields,
        location_name,
        location_id,
        phone,
        name,
        symptoms,
      });
      setSearchTextFields({ ...searchTextFields, phone, name, symptoms });
      setAutCompleteName({ ...autoCompleteName, location_name, location_id });
    }
  }, []);

  console.log(searchFields);

  useEffect(() => {
    if (!isFetching && isShowPatientSuccess) {
      setEditItem(showPatient);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, isShowPatientSuccess, showPatient]);

  const handleAddDoctor = () => {
    setIsOpen(true);
    setEditItem({});
  };

  const handleDelete = (id) => {
    deletePatient(id);
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

  const handleSearchChange = (e) => {
    console.log(e);
    if (e) {
      setAutCompleteName({
        ...autoCompleteName,
        location_name: e.label,
        location_id: e.id,
      });
      setSearchFields({
        ...searchFields,
        ...searchTextFields,
        location_name: e.label,
        location_id: e.id,
      });
    } else {
      setAutCompleteName({
        ...autoCompleteName,
        location_name: "",
        location_id: "",
      });
      setSearchFields({
        ...searchFields,
        ...searchTextFields,
        location_name: "",
        location_id: "",
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

  const handleAllSearch = () => {
    setSearchFields({ ...searchFields, ...searchTextFields });
  };

  const cancelSearch = () => {
    setSearchFields(searchFieldsName);
    setSearchTextFields(searchTextFieldsName);
    setAutCompleteName(autoCompleteFieldName);
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
  if (!isLoading && isSuccess && patients.data?.length === 0) {
    content = (
      <tbody>
        <tr>
          <td>There is no Patient.</td>
        </tr>
      </tbody>
    );
  }
  if (!isLoading && isSuccess && patients.data?.length > 0) {
    content = (
      <tbody>
        {patients.data.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>
              <Link to={`/patients/${item?.id}`}>
                <Button className="me-2" color="primary" outline>
                  <span className="d-flex gap-2">
                    <i className="bi bi-info-circle"></i>
                    Info
                  </span>
                </Button>
              </Link>
            </td>
            <td>{item?.name}</td>
            <td>{item?.phone}</td>
            <td>{item?.symptoms}</td>
            <td>{item?.location_name}</td>
            <td>
              <Status item={item} statusUpdate={statusUpdate} />
            </td>
            <td className="d-flex gap-2">
              <ActionButton
                id={item?.id}
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
        <h5>Patients</h5>
        <button
          onClick={handleAddDoctor}
          type="button"
          className="btn btn-primary"
        >
          <span className="d-flex gap-2">
            <i className="bi bi-plus-circle"></i>
            Add Patient
          </span>{" "}
        </button>
      </div>
      <div>
        <div
          style={{ width: "1180px", height: "400px" }}
          className="overflow-scroll"
        >
          <table className="table">
            <thead>
              <tr>
                <th scope="col">SL</th>
                <th>Info</th>
                <th scope="col">Patient Name</th>
                <th scope="col">Phone</th>
                <th scope="col">Symptoms</th>
                <th scope="col">Location</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
              <tr>
                <th></th>
                <th></th>
                <td>
                  <FromInput
                    name="name"
                    id="name"
                    placeholder="Enter Name"
                    value={searchTextFields?.name}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                </td>
                <td>
                  <FromInput
                    name="phone"
                    id="phone"
                    placeholder="Enter Phone"
                    value={searchTextFields?.phone}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                </td>
                <td>
                  <FromInput
                    name="symptoms"
                    id="symptoms"
                    placeholder="Enter Symptoms"
                    value={searchTextFields?.symptoms}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                </td>
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
                    list={statusList ?? []}
                    name="status"
                    id="status"
                    placeholder="Status"
                    value={searchFields?.status ?? ""}
                    onChange={handleOnChangeSelect}
                  />
                </th>

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
        <PatientModal
          editItem={isOpen && editItem}
          setEditItem={setEditItem}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          setToast={setToast}
        />

        {/* <ShowDistrict
          setIsOpen={setIsOpenShow}
          isOpen={isOpenShow}
          editItem={editItem}
          setEditItem={setEditItem}
        /> */}

        <ReactPagination
          total={patients?.total}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
        />
      </div>
    </>
  );
}
