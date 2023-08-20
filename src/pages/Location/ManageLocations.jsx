import React, { useEffect, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
// import { useToasts } from "react-toast-notifications";
import Select from "react-select";
import { useToasts } from "react-toast-notifications";
import { Badge, Button, Card, CardBody, Input, Spinner } from "reactstrap";
import Breadcrumb from "../../components/common/Breadcrumb";
import Pagination from "../../components/common/Pagination";
import SweetAlert from "../../components/common/SweetAlert";
import { debounce } from "../../components/common/debounce";
import {
  getUrlStrByObj,
  isObjectValueExits,
} from "../../components/common/listDataHelper";
import { statusList } from "../../components/common/statusList";
import { useGetDistrictsQuery } from "../../features/districtApi";
import {
  useDeleteLocationMutation,
  useGetLocationQuery,
  useGetLocationssQuery,
} from "../../features/locationApi";
import { useGetSubDistrictsQuery } from "../../features/subDistrictApi";
import LocationModal from "./LocationModal";

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
  limit: 20,
};

const searchTextFieldsData = {
  name: "",
};

function Location() {
  document.title = `Location `;

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
    data: country,
    isSuccess,
    isFetching: isFetchingGetAll,
  } = useGetLocationssQuery(urlString, {
    refetchOnMountOrArgChange: true,
  });

  const [
    deleteCity,
    {
      data: deleteResponse,
      isLoading: deleteLoading,
      isSuccess: deleteSuccess,
    },
  ] = useDeleteLocationMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState({});
  const [toast, setToast] = useState({});

  // // BEGIN :: Upcoming Events
  // const [upcomingEventsInfoOffcanvas, setUpcomingEventsInfoOffcanvas] = useState(false);

  const [limit, setLimit] = useState(10);

  const [fetchCondition, setFetchCondition] = useState({
    id: null,
    skip: true,
  });

  const {
    data: showItem,
    isSuccess: isShowSuccess,
    refetch,
    isFetching,
  } = useGetLocationQuery(fetchCondition.id, {
    skip: fetchCondition.skip,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!isFetching && isShowSuccess) {
      setEditItem(showItem?.data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowSuccess, showItem, isFetching, isSuccess]);

  const handleUpcomingDetails = (user, type) => {
    if (fetchCondition?.id === user.id) {
      refetch();
    } else {
      setFetchCondition({ id: user.id, skip: false });
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

  /** Delete */
  /** Content */
  let content = null;
  if (isFetchingGetAll || deleteLoading) {
    content = (
      <tr>
        <td colSpan={9}>
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
    country?.data?.data?.length === 0
  ) {
    content = (
      <tr>
        <td colSpan={9}>{"No Record Found"}</td>
      </tr>
    );
  } else if (
    !isFetchingGetAll &&
    isSuccess &&
    country?.data?.data?.length > 0
  ) {
    content = country?.data?.data.map((user, i) => {
      return (
        <tr key={user.id}>
          <td>{i + 1}</td>

          <td>
            <div>
              <div>{user?.name}</div>
            </div>
          </td>

          <td>{user?.district_id?.name}</td>
          <td>{user?.subDistrict_id?.name}</td>
          <td>
            <Badge color={user.status == 1 ? "success" : "danger"}>
              {user?.status == 1 ? "Active" : "Inactive"}
            </Badge>
          </td>

          <td>
            <Button
              color="success"
              size="sm"
              onClick={() => {
                handleUpcomingDetails(user, "View");
              }}
            >
              <i class="ri-eye-line"></i>&nbsp; View
            </Button>
            &nbsp;
            <Button
              size="sm"
              color="primary"
              className="btn-light-primary"
              onClick={() => {
                handleUpcomingDetails(user, "Update");
              }}
            >
              <i class="ri-pencil-fill">&nbsp;</i>Edit
            </Button>
            &nbsp;
            <Button
              color="danger"
              size="sm"
              onClick={() => setDeleteItem(user)}
            >
              <i class="ri-delete-bin-6-line"></i>&nbsp;Delete
            </Button>
          </td>
        </tr>
      );
    });
  }

  let meta = country?.data?.meta;

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

  const handleSelectChange = (e, fieldName) => {
    if (fieldName === "district_id") {
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
    } else {
      if (e) {
        setPageAndSearchFields(1, {
          ...searchFields,
          subDistrict_id: e?.value,
          subDistrict_name: e?.label,
        });
      } else {
        setPageAndSearchFields(1, {
          ...searchFields,
          subDistrict_id: "",
          subDistrict_name: "",
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
            <i className="mdi mdi-city-variant text-primary me-1"></i>Location
          </h5>
          <Breadcrumb
            title={"Dashboard"}
            list={[
              { title: "Dashboard", to: "/dashboard" },
              { title: "Locations", to: "/locations?page=1&limit=20" },
            ]}
          />
        </div>
        <div>
          <Button
            className="btn btn-success"
            size="sm"
            onClick={() => {
              setIsOpen(true);
              setTitle("Add");
              setEditItem({});
            }}
          >
            <i class="ri-add-circle-line"></i>&nbsp;Add Location
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
                      Name
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
                  <th style={{ minWidth: "200px" }}>District</th>
                  <th style={{ minWidth: "200px" }}>SubDistrict</th>
                  <th style={{ minWidth: "150px" }}>Status</th>
                  <th style={{ minWidth: "290px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Enter Name"
                      onChange={handleOnChangeSearch}
                      value={searchTextFields.name}
                      onKeyDown={handleKeyDown}
                    />
                  </td>

                  <td>
                    <Select
                      value={{
                        value: searchFields?.district_id,
                        label: searchFields?.district_name
                          ? searchFields?.district_name
                          : "Search District",
                      }}
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
                      className="select2-selection"
                      isLoading={countryfetching}
                    />
                  </td>
                  <td>
                    <Select
                      value={{
                        value: searchFields?.subDistrict_id,
                        label: searchFields?.subDistrict_name
                          ? searchFields?.subDistrict_name
                          : "Search Sub-district",
                      }}
                      onChange={(e) => handleSelectChange(e, "state_id")}
                      onInputChange={(e, action) =>
                        handleInputChange(
                          e,
                          action,
                          setSubDistrictSearchUrl,
                          "state_id"
                        )
                      }
                      isClearable={searchFields?.subDistrict_id ? true : false}
                      options={
                        subDistrict?.data?.data?.map((i) => ({
                          label: i?.name,
                          value: i?._id,
                        })) ?? []
                      }
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
                          color="success"
                          size="sm"
                          className="btn-light-primary"
                          outline
                          onClick={handleSearchSubmit}
                        >
                          <i class="ri-search-line"></i>&nbsp;Search
                        </Button>
                        &nbsp;
                        <Button
                          size="sm"
                          color="danger"
                          outline
                          onClick={clearSearch}
                        >
                          <i class="ri-close-fill"></i>&nbsp;Cancel
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
      {deleteItem?.id && (
        <SweetAlert
          deleteItem={deleteItem}
          onCancel={() => setDeleteItem(null)}
          onConfirm={() => {
            deleteCity(deleteItem?.id);
            setDeleteItem({});
          }}
          confirmBtnText="Yes, delete it!"
        >
          <p className="text-dark">
            You want to delete{" "}
            <strong className="text-dark fs-5">{deleteItem?.name}</strong>{" "}
            location.
          </p>
        </SweetAlert>
      )}
      {isOpen && (
        <LocationModal
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

export default Location;
