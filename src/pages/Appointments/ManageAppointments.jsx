import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import Select from "react-select";
import { useToasts } from "react-toast-notifications";
import {
  Card,
  CardBody,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import Button from "../../components/bootstrap/Button";
import Breadcrumb from "../../components/common/Breadcrumb";
import Pagination from "../../components/common/Pagination";
import SweetAlert from "../../components/common/SweetAlert";
import { debounce } from "../../components/common/debounce";
import {
  getUrlStrByObj,
  isObjectValueExits,
} from "../../components/common/listDataHelper";
import { statusList } from "../../components/common/statusList";
import { options } from "../../components/helpers/options";
import { getValue } from "../../components/helpers/reactSelectHelpers";
import {
  useChangeStatusMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentsQuery,
} from "../../features/appointmentApi";
import { useGetDistrictsQuery } from "../../features/districtApi";
import {
  useGetDoctorQuery,
  useGetDoctorsQuery,
  useGetSpecialestsQuery,
  useGetTitlesQuery,
} from "../../features/doctorApi";
import { useGetInstitutesQuery } from "../../features/instituteApi";
import { useGetSubDistrictsQuery } from "../../features/subDistrictApi";
import AppointementsModal from "./AppointementsModal";

const searchFieldsData = {
  name: "",
  status: "",
  sortOrder: "",
  sortBy: "",
  country_id: "",
  country_name: "",
  state_id: "",
  state_name: "",
  page: 1,
  limit: 10,
};

const searchTextFieldsData = {
  name: "",
};

function ManageAppointments() {
  document.title = `Appointment`;

  const { addToast } = useToasts();

  const { search } = useLocation();
  const firstRender = useRef(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = Object.fromEntries([...searchParams]);
  let initialSearchFieldsData = { ...searchFieldsData, ...currentParams };
  const [currentPage, setCurrentPage] = useState(1);

  const [searchFields, setSearchFields] = useState(initialSearchFieldsData);
  const [searchTextFields, setSearchTextFields] =
    useState(searchTextFieldsData);

  const [title, setTitle] = useState("Add");

  const [countrySearchUrl, setCountrySearchUrl] = useState("");
  const { data: countriesData, isFetching: countryfetching } =
    useGetDistrictsQuery(countrySearchUrl, {
      refetchOnMountOrArgChange: true,
    });

  const [subDistrictSearchUrl, setSubDistrictSearchUrl] = useState("");
  const { data: subDistrict, isFetching: statefetching } =
    useGetSubDistrictsQuery(subDistrictSearchUrl, {
      refetchOnMountOrArgChange: true,
    });

  const [urlString, setUrlString] = useState(search ?? "?page=1&limit=10");
  const [editItem, setEditItem] = useState({});
  const {
    data: appointment,
    isSuccess,
    isFetching: isFetchingGetAll,
  } = useGetAppointmentsQuery(urlString, {
    refetchOnMountOrArgChange: true,
  });

  const [
    deleteCity,
    {
      data: deleteResponse,
      isLoading: deleteLoading,
      isSuccess: deleteSuccess,
    },
  ] = useDeleteAppointmentMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState({});
  const [toast, setToast] = useState({});

  // // BEGIN :: Upcoming Events
  // const [upcomingEventsInfoOffcanvas, setUpcomingEventsInfoOffcanvas] = useState(false);

  const [limit, setLimit] = useState(10);

  const { data: specialestData, isFetching: specialestFetching } =
    useGetSpecialestsQuery();
  const { data: titlesData, isFetching: titleFetching } = useGetTitlesQuery();

  const [instituteSearchUrl, setInstituteSearchUrl] = useState("");
  const { data: instituteData, isFetching: instituteFetching } =
    useGetInstitutesQuery(instituteSearchUrl, {
      refetchOnMountOrArgChange: true,
    });
  const [changeStatus, { isSuccess: isStatussuccess }] =
    useChangeStatusMutation();

  const [fetchCondition, setFetchCondition] = useState({
    id: null,
    skip: true,
  });

  const {
    data: showItem,
    isSuccess: isShowSuccess,
    refetch,
    isFetching,
  } = useGetDoctorQuery(fetchCondition.id, {
    skip: fetchCondition.skip,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!isFetching && isShowSuccess) {
      setEditItem(showItem?.data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowSuccess, showItem, isFetching, isSuccess]);

  const [doctorSearchUrl, setDoctorSearchUrl] = useState("");

  const { data: doctorsData, isFetching: doctorFetching } = useGetDoctorsQuery(
    doctorSearchUrl,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const handleUpcomingDetails = (user, type) => {
    if (fetchCondition?.id === user._id) {
      refetch();
    } else {
      setFetchCondition({ id: user._id, skip: false });
    }
    setTitle(type);
    setIsOpen(true);
  };

  /** Set Page and search field */
  const setPageAndSearchFields = (page, searchFieldObj) => {
    setCurrentPage(page);
    setSearchFields(searchFieldObj);
  };

  /** Use Effet for search filter and sort */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;

      return;
    }
    const urlStr = getUrlStrByObj(searchFields);
    setSearchParams(urlStr);
    setUrlString(urlStr);

    /* eslint-disable react-hooks/exhaustive-deps */
  }, [searchFields]);

  /** This is for set search filter and soting value after page refresh */
  useEffect(() => {
    if (search) {
      const params = Object.fromEntries([...searchParams]);
      //setPageAndSearchFields(parseInt(params?.page), params);
      setSearchTextFields({
        ...searchTextFields,
        ...params,
      });
    }
    return () => {};
  }, []);

  // /** Delete  response action */
  useEffect(() => {
    if (deleteSuccess) {
      setToast({
        title: "City notification",
        message: deleteResponse?.message,
      });
    }
  }, [deleteResponse, deleteSuccess]);

  /** Toast message trigger */
  useEffect(() => {
    const content = (
      <div>
        <strong>Location Notification</strong>
        <p>{toast?.message}</p>
      </div>
    );
    if (toast?.message) {
      addToast(content, {
        appearance: toast?.type ? toast?.type : "success",
        autoDismiss: true,
        autoDismissTimeout: 2000,
      });
    }
  }, [toast]);
  /** Per page limit*/
  useEffect(() => {
    if (limit) {
      setPageAndSearchFields(1, { ...searchFields, limit });
    }
  }, [limit]);

  useEffect(() => {
    if (currentPage) {
      setPageAndSearchFields(currentPage, {
        ...searchFields,
        page: currentPage,
        limit,
      });
    }
  }, [currentPage]);

  /** Handle Pagination */

  /** Handle Sorting */
  const handleSort = (sortBy) => {
    let page = 1;
    let sortOrder = searchFields?.sortOrder === "ASC" ? "DESC" : "ASC";
    setPageAndSearchFields(page, {
      ...searchFields,
      page,
      sortOrder,
      sortBy,
    });
  };

  /** Submit by Enter */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      let margeObject = { ...searchFields, ...searchTextFields };
      const { name, value } = e.target;
      setPageAndSearchFields(1, { ...margeObject, [name]: value, page: 1 });
    }
  };
  /** Search Submit */
  const handleSearchSubmit = () => {
    let margeObject = { ...searchFields, ...searchTextFields };
    setPageAndSearchFields(1, { ...margeObject, page: 1 });
  };

  /** Clear Search */
  const clearSearch = () => {
    setSearchParams({});
    setPageAndSearchFields(1, searchFieldsData);
    setSearchTextFields(searchTextFieldsData);
  };

  const statusUpdate = (data, status) => {
    // console.log(status);
    changeStatus({ id: data?._id, data: { ...data, status } });
    // updateAppointment({ id: data?.id, data: { ...data, status: e } });
  };

  /** Delete */
  /** Content */
  let content = null;
  if (isFetchingGetAll || deleteLoading) {
    content = (
      <tr>
        <td colSpan={6}>
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
        </td>
      </tr>
    );
  } else if (
    !isFetchingGetAll &&
    isSuccess &&
    appointment?.data?.data?.length === 0
  ) {
    content = (
      <tr>
        <td colSpan={11}>{"No Record Found"}</td>
      </tr>
    );
  } else if (
    !isFetchingGetAll &&
    isSuccess &&
    appointment?.data?.data?.length > 0
  ) {
    content = appointment?.data?.data.map((item, i) => {
      return (
        <tr key={item.id}>
          <td>{i + 1}</td>

          <td>{item?.patient_name}</td>
          <td>
            <Link to={`/doctors/${item?.doctor_id?.id}`}>
              {item?.doctor_id?.name}
            </Link>
          </td>
          <td>
            <UncontrolledDropdown>
              <DropdownToggle
                caret
                color={
                  (item?.status == "1" && "primary") ||
                  (item?.status == "2" && "info") ||
                  (item?.status == "3" && "danger") ||
                  (item?.status == "4" && "success")
                }
                style={{ width: "100px" }}
              >
                {item?.status_name}
              </DropdownToggle>

              <DropdownMenu style={{ width: "100px" }}>
                {(item?.status === "2" || item?.status == "3") && (
                  <DropdownItem onClick={() => statusUpdate(item, 1)}>
                    Pending
                  </DropdownItem>
                )}
                {item?.status == "1" && (
                  <DropdownItem onClick={() => statusUpdate(item, 2)}>
                    Accepted
                  </DropdownItem>
                )}
                {item?.status == "1" && (
                  <DropdownItem onClick={() => statusUpdate(item, 3)}>
                    Rejected
                  </DropdownItem>
                )}
                {item?.status == "2" && (
                  <DropdownItem onClick={() => statusUpdate(item, 4)}>
                    Done
                  </DropdownItem>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
          </td>
          <td>{new Date(item?.date).toLocaleDateString()}</td>
          <td>
            {new Date(item?.start_time)?.toLocaleTimeString("en-US", options)}
          </td>
          <td>
            {new Date(item?.end_time)?.toLocaleTimeString("en-US", options)}
          </td>

          <td>{item?.district_id?.name}</td>
          <td>{item?.subDistrict_id?.name}</td>
          <td>{item?.location_id?.name}</td>
          <td>
            <Link to={`/doctors/${item.id}`} className="btn btn-success btn-sm">
              <i class="ri-eye-line"></i>&nbsp; View
            </Link>
            &nbsp;
            <Button
              icon="bi bi-pencil"
              size="sm"
              color="primary"
              onClick={() => {
                handleUpcomingDetails(item, "Edit");
              }}
            >
              Edit
            </Button>
            &nbsp;
            <Button
              icon="ri-delete-bin-6-line"
              size="sm"
              color="danger"
              onClick={() => setDeleteItem(item)}
            >
              Delete
            </Button>
          </td>
        </tr>
      );
    });
  }

  let meta = appointment?.data?.meta;

  /** Handle Search */
  const handleOnChangeSearch = (e) => {
    const { name, value, type } = e.target;

    if (type === "select-one") {
      let margeObject = { ...searchFields, ...searchTextFields };
      setPageAndSearchFields(1, { ...margeObject, [name]: value, page: 1 });
    } else {
      setSearchTextFields({
        ...searchTextFields,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (e, fieldId, fieldName) => {
    if (fieldId === "district_id") {
      if (e) {
        setPageAndSearchFields(1, {
          ...searchFields,
          district_id: e?.value,
          district_name: e?.label,
          subDistrict_id: "",
          subDistrict_name: "",
        });
        setSubDistrictSearchUrl(`?district_id=${e?.value}`);
      } else {
        setPageAndSearchFields(1, {
          ...searchFields,
          district_id: "",
          district_name: "",
          subDistrict_id: "",
          subDistrict_name: "",
        });
        setSubDistrictSearchUrl("");
      }
    } else if (fieldName === "doctor_id") {
      if (e) {
        setPageAndSearchFields(1, {
          ...searchFields,
          [fieldId]: e?.value,
          [fieldName]: e?.label,
        });
      } else {
        setPageAndSearchFields(1, {
          ...searchFields,
          [fieldId]: "",
          [fieldName]: "",
        });
      }
    } else {
      if (e) {
        setPageAndSearchFields(1, {
          ...searchFields,
          [fieldId]: e?.value,
          [fieldName]: e?.label,
        });
      } else {
        setPageAndSearchFields(1, {
          ...searchFields,
          [fieldId]: "",
          [fieldName]: "",
        });
      }
    }
  };

  const handleInputChange = (value, { action }, setUrlStr, fieldName) => {
    const { country_id } = searchFields;
    if (action === "input-change") {
      if (fieldName === "state_id" && country_id) {
        debounce(`?country_id=${country_id}&name=${value}`, setUrlStr);
      } else {
        debounce(`?name=${value}`, setUrlStr);
      }
    } else if (action === "input-blur") {
      if (fieldName === "state_id" && country_id) {
        debounce(`?country_id=${country_id}`, setUrlStr);
      } else {
        debounce(``, setUrlStr);
      }
    }
  };

  /** Button show hide for search and clear */
  const lengthSearchField = isObjectValueExits(searchFields, searchTextFields);

  return (
    <div className="page-content">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="mb-3">
            <i className="mdi mdi-city-variant text-primary me-1"></i>
            Appointment
          </h5>
          <Breadcrumb
            title={"Appointment"}
            list={[
              { title: "Dashboard", to: "/dashboard" },
              { title: "Appointment", to: "/doctors?page=1&limit=20" },
            ]}
          />
        </div>
        <div>
          <Button
            icon="ri-add-circle-line"
            size="sm"
            color="success"
            onClick={() => {
              setIsOpen(true);
              setTitle("Add");
              setEditItem({});
            }}
          >
            Add Appointment
          </Button>
        </div>
      </div>
      <Card>
        <CardBody>
          <div className="table-responsive index-table">
            <table className="table table-striped mb-0">
              <thead className="table-light table-nowrap">
                <tr role="row">
                  <th style={{ minWidth: "50px" }}>SL</th>
                  <th style={{ minWidth: "200px" }}>
                    <div
                      onClick={() => handleSort("name")}
                      className="cursor-pointer text-decoration-underline me-1"
                      style={{ cursor: "pointer", minWidth: "200px" }}
                    >
                      Patient Name
                      <i
                        className={
                          searchFields.sortBy === "name"
                            ? searchFields.sortOrder === "ASC"
                              ? "ri-sort-asc ms-1"
                              : "ri-sort-desc ms-1"
                            : "d-none"
                        }
                      ></i>
                    </div>
                  </th>
                  <th style={{ minWidth: "200px" }}>Doctor Name</th>
                  <th style={{ minWidth: "200px" }}>Status</th>
                  <th style={{ minWidth: "220px" }}>Date</th>
                  <th style={{ minWidth: "200px" }}>Start Time</th>
                  <th style={{ minWidth: "200px" }}>End Time</th>
                  <th style={{ minWidth: "200px" }}>District</th>
                  <th style={{ minWidth: "220px" }}>Sub-district</th>
                  <th style={{ minWidth: "220px" }}>Location</th>
                  <th style={{ minWidth: "290px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td>
                    <Input
                      type="text"
                      name="patient_name"
                      placeholder="Enter patient name"
                      onChange={handleOnChangeSearch}
                      value={searchTextFields.patient_name}
                      onKeyDown={handleKeyDown}
                    />
                  </td>
                  <td>
                    <Select
                      value={getValue(
                        searchFields.doctor_id,
                        searchFields?.doctor_name
                      )}
                      onChange={(e) =>
                        handleSelectChange(e, "doctor_id", "doctor_name")
                      }
                      onInputChange={(e, action) =>
                        handleInputChange(e, action, "doctor_id", "doctor_name")
                      }
                      isClearable={searchFields?.doctor_id ? true : false}
                      options={
                        doctorsData?.data?.data?.map((i) => ({
                          label: i?.name,
                          value: i?._id,
                        })) ?? []
                      }
                      placeholder="Search district"
                      className="select2-selection"
                      isLoading={doctorFetching}
                    />
                  </td>
                  <td></td>
                  <td style={{ minWidth: "220px" }}></td>
                  <td></td>
                  <td></td>
                  <td>
                    <Select
                      value={getValue(
                        searchFields.district_id,
                        searchFields?.district_name
                      )}
                      onChange={(e) => handleSelectChange(e, "district_id")}
                      onInputChange={(e, action) =>
                        handleInputChange(
                          e,
                          action,
                          setCountrySearchUrl,
                          "district_id"
                        )
                      }
                      isClearable={searchFields?.district_id ? true : false}
                      options={
                        countriesData?.data?.data?.map((i) => ({
                          label: i?.name,
                          value: i?._id,
                        })) ?? []
                      }
                      placeholder="Search district"
                      className="select2-selection"
                      isLoading={countryfetching}
                    />
                  </td>
                  <td style={{ minWidth: "220px" }}>
                    <Select
                      value={getValue(
                        searchFields.subDistrict_id,
                        searchFields?.subDistrict_name
                      )}
                      onChange={(e) =>
                        handleSelectChange(
                          e,
                          "subDistrict_id",
                          "subDistrict_name"
                        )
                      }
                      onInputChange={(e, action) =>
                        handleInputChange(
                          e,
                          action,
                          setSubDistrictSearchUrl,
                          "subDistrict_id"
                        )
                      }
                      isClearable={searchFields?.subDistrict_id ? true : false}
                      options={
                        subDistrict?.data?.data?.map((i) => ({
                          label: i?.name,
                          value: i?._id,
                        })) ?? []
                      }
                      placeholder="Search sub-district"
                      className="select2-selection"
                      isLoading={statefetching}
                    />
                  </td>

                  <td>
                    <Input
                      name="status"
                      type="select"
                      onChange={handleOnChangeSearch}
                      value={searchFields?.status}
                    >
                      <option value="">Select Status</option>
                      {statusList.map((i) => (
                        <option key={i.value} value={i?.value}>
                          {i.text}
                        </option>
                      ))}
                    </Input>
                  </td>
                  <td>
                    {lengthSearchField !== 0 && (
                      <>
                        <Button
                          icon="ri-search-line"
                          size="sm"
                          color="outline-primary"
                          outline
                          onClick={handleSearchSubmit}
                        >
                          Search
                        </Button>
                        &nbsp;
                        <Button
                          icon="ri-close-fill"
                          size="sm"
                          color="outline-danger"
                          outline
                          onClick={clearSearch}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </td>
                </tr>

                {content}
              </tbody>
            </table>
          </div>
          <Pagination
            total={meta?.total}
            perPage={meta?.limit ? parseInt(meta?.limit) : limit}
            setPerPage={setLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </CardBody>
      </Card>
      {deleteItem?._id && (
        <SweetAlert
          deleteItem={deleteItem}
          onCancel={() => setDeleteItem(null)}
          onConfirm={() => {
            deleteCity(deleteItem?._id);
            setDeleteItem({});
          }}
          confirmBtnText="Yes, delete it!"
        >
          <p className="text-dark">
            You want to delete{" "}
            <strong className="text-dark fs-5">{deleteItem?.name}</strong>{" "}
            appointment.
          </p>
        </SweetAlert>
      )}
      {isOpen && (
        <AppointementsModal
          isOpen={isOpen}
          editItem={editItem}
          setEditItem={setEditItem}
          isFetching={isFetching}
          setToast={setToast}
          title={title}
          setTitle={setTitle}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
}

export default ManageAppointments;
