import React, { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import DeleteAlert from "../../components/DeleteAlert";
import formatValue from "../../components/formatValue";
import FromInput from "../../components/FromInput";
import FromSelect from "../../components/FromSelect";
import { statusList } from "../../components/list";
import ReactPagination from "../../components/ReactPagination";
import { searchFieldsLength, searchUrl } from "../../components/searchFields";
import SearchSelect from "../../components/SearchSelect";
import {
  useDeleteDoctorMutation,
  useGetDoctorQuery,
  useGetDoctorsQuery,
  useUpdateDoctorMutation,
} from "../../features/doctorApi";
import DoctorsModal, {
  doctorTitles,
  locationList,
  options,
} from "./DoctorsModal";

const searchTextFieldsName = {
  first_name: "",
  phone: "",
  email: "",
};

const searchFieldsName = {
  first_name: "",
  phone: "",
  name: "",
  specialest: "",
  title: "",
  collegeHospital: "",
  location: "",
  status: "",
  page: 1,
  limit: 10,
};

const specialestData = [
  { name: "Medicin", id: "1" },
  { name: "NeuroMedicin", id: "2" },
  { name: "Nose Hair", id: "3" },
  { name: "Dentiest", id: "4" },
];

const autoCompleteFieldName = {
  collegeHospital: "",
  location: "",
};

export default function ManageDoctors() {
  const [isOpen, setIsOpen] = useState(false);

  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [editItem, setEditItem] = useState({});
  const [deleteItemId, setDeleteItemId] = useState(null);

  const { search } = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchFields, setSearchFields] = useState(searchFieldsName);

  const [searchTextFields, setSearchTextFields] =
    useState(searchTextFieldsName);

  const [autoCompleteName, setAutCompleteName] = useState(
    autoCompleteFieldName
  );

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [toastObj, setToast] = useState({});

  const [urlString, setUrlString] = useState(``);
  const {
    data: doctors,
    isLoading,
    isSuccess,
    error,
  } = useGetDoctorsQuery(urlString, { refetchOnMountorArgChange: true });

  const [doctorId, setDoctorId] = useState("");
  const {
    data: showDoctor,
    isSuccess: isShowDoctorSuccess,
    isFetching,
    refetch,
  } = useGetDoctorQuery(doctorId, {
    refetchOnMountorArgChange: true,
  });

  const [deleteDoctor, { isSuccess: isDeleteSuccess }] =
    useDeleteDoctorMutation();

  const [
    updateDoctor,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdateDoctorMutation();

  const statusUpdate = (data, e) => {
    console.log(e);
    console.log(data);
    updateDoctor({ id: data?.id, data: { ...data, status: e } });
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
    console.log("search");
    console.log(url);
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
    if (search) {
      const result = Object.fromEntries([...searchParams]);

      const {
        first_name,
        email,
        phone,
        specialest,
        title,
        location,
        collegeHospital,
      } = result;
      setSearchFields({
        ...searchFields,
        first_name,
        email,
        phone,
        specialest,
        title,
        location,
        collegeHospital,
      });
      setSearchTextFields({ ...searchTextFields, first_name, email, phone });
      setAutCompleteName({ ...autoCompleteName, location, collegeHospital });
    }
  }, []);

  useEffect(() => {
    if (!isFetching && isShowDoctorSuccess) {
      setEditItem(showDoctor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, isShowDoctorSuccess, showDoctor]);

  const handleAddDoctor = () => {
    setIsOpen(true);
    setEditItem({});
  };

  const handleDelete = (id) => {
    deleteDoctor(id);
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

  const handleSearchChange = (e, type) => {
    if (e) {
      setAutCompleteName({
        ...autoCompleteName,
        [type]: e.value,
      });
    } else {
      setAutCompleteName({
        ...autoCompleteName,
        [type]: "",
      });
      setSearchFields({ ...searchFields, [type]: "" });
    }

    setSearchFields({ ...searchFields, ...searchTextFields, [type]: e.value });
  };

  useEffect(() => {
    setSearchFields({ ...searchFields, page: page, limit: limit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleAllSearch = () => {
    setSearchFields({ ...searchFields, ...searchTextFields });
  };

  console.log(limit);

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
  if (!isLoading && isSuccess && doctors.data?.length === 0) {
    content = (
      <tbody>
        <tr>
          <td>There is no doctos.</td>
        </tr>
      </tbody>
    );
  }
  if (!isLoading && isSuccess && doctors.data?.length > 0) {
    content = (
      <tbody>
        {doctors.data.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>
              <Link to={`/doctors/${item?.id}`}>
                <Button className="me-2" color="primary" outline>
                  <span className="d-flex gap-2">
                    <i className="bi bi-info-circle"></i>
                    Info
                  </span>
                </Button>
              </Link>
            </td>
            <td>
              {item?.first_name} {item?.last_name}
            </td>
            <td>{item?.phone}</td>
            <td>{item?.email}</td>
            <td>{item?.specialest}</td>
            <td>{item?.title}</td>
            <td>{item?.collegeHospital}</td>
            <td>{item?.location}</td>
            <td>
              <UncontrolledDropdown>
                <DropdownToggle
                  caret
                  color={item?.status ? "success" : "warning"}
                  style={{ width: "100px" }}
                >
                  {item?.status ? "Active" : "Inactive"}
                </DropdownToggle>
                <DropdownMenu style={{ width: "100px" }}>
                  <DropdownItem onClick={() => statusUpdate(item, true)}>
                    Active
                  </DropdownItem>
                  <DropdownItem onClick={() => statusUpdate(item, false)}>
                    Inactive
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </td>
            <td className="d-flex gap-2">
              <Button color="success" onClick={() => handleUpdate(item?.id)}>
                <span className="d-flex gap-2">
                  <i className="bi bi-pencil"></i>Edit
                </span>
              </Button>{" "}
              <Button
                color="danger"
                onClick={() => {
                  setIsOpenAlert(true);
                  setDeleteItemId(item?.id);
                }}
              >
                <span className="d-flex gap-2">
                  <i className="bi bi-trash"></i>Delete
                </span>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h5>Doctors</h5>
        <button
          onClick={handleAddDoctor}
          type="button"
          className="btn btn-primary"
        >
          <span className="d-flex gap-2">
            <i className="bi bi-plus-circle"></i>
            Add Doctor
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
                <th scope="col" style={{ minWidth: "60px" }}>
                  SL
                </th>
                <th>Info</th>
                <th scope="col" style={{ minWidth: "150px" }}>
                  Full Name
                </th>
                <th scope="col" style={{ minWidth: "150px" }}>
                  Phone
                </th>
                <th scope="col" style={{ minWidth: "150px" }}>
                  Email
                </th>
                <th scope="col" style={{ minWidth: "150px" }}>
                  Specialest
                </th>
                <th scope="col" style={{ minWidth: "150px" }}>
                  Title
                </th>
                <th scope="col" style={{ minWidth: "200px" }}>
                  College/Hospital
                </th>
                <th scope="col" style={{ minWidth: "150px" }}>
                  Location
                </th>
                <th scope="col" style={{ minWidth: "160px" }}>
                  Status
                </th>
                <th scope="col" style={{ minWidth: "150px" }}>
                  Actions
                </th>
              </tr>
              <tr>
                <th></th>
                <th></th>
                <th>
                  <FromInput
                    name="first_name"
                    id="first_name"
                    placeholder="Enter Name"
                    value={searchTextFields?.first_name}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                </th>
                <th>
                  <FromInput
                    name="phone"
                    id="phone"
                    placeholder="Enter Phone"
                    value={searchTextFields?.phone}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                </th>
                <th>
                  <FromInput
                    name="email"
                    id="email"
                    placeholder="Enter Email"
                    value={searchTextFields?.email}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                </th>
                <th>
                  <FromSelect
                    list={specialestData ?? []}
                    name="specialest"
                    id="specialest"
                    placeholder="Specialest"
                    value={searchFields?.specialest ?? ""}
                    onChange={handleOnChangeSelect}
                  />
                </th>
                <th>
                  <FromSelect
                    list={doctorTitles ?? []}
                    name="title"
                    id="title"
                    placeholder="Title"
                    value={searchFields?.title ?? ""}
                    onChange={handleOnChangeSelect}
                  />
                </th>
                <td>
                  <SearchSelect
                    list={options ?? []}
                    value={formatValue(
                      autoCompleteName?.collegeHospital,
                      " College/Hospital"
                    )}
                    name="collegeHospital"
                    onChange={(e) => handleSearchChange(e, "collegeHospital")}
                  />
                </td>
                <td>
                  <SearchSelect
                    list={locationList ?? []}
                    value={formatValue(autoCompleteName?.location, "Location")}
                    name="location"
                    onChange={(e) => handleSearchChange(e, "location")}
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

                {searchFieldsLength(searchFields, searchTextFields) > 0 ? (
                  <th className="d-flex align-items-center justify-content-center">
                    <Button
                      className="me-2"
                      color="info"
                      onClick={handleAllSearch}
                    >
                      <span className="d-flex gap-2">
                        <i className="bi bi-search"></i>
                        Search
                      </span>
                    </Button>{" "}
                    <Button className="btn btn-danger" onClick={cancelSearch}>
                      <span className="d-flex gap-2">
                        <i className="bi bi-x-circle"></i>Cancel
                      </span>
                    </Button>
                  </th>
                ) : (
                  <th></th>
                )}
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
          <DoctorsModal
            editItem={editItem}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setToast={setToast}
            setEditItem={setEditItem}
          />
          <ToastContainer />
        </div>

        <ReactPagination
          total={doctors?.total}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
        />
      </div>
    </>
  );
}
