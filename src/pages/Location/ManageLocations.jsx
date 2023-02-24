import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
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
import {
  useDeleteLocationMutation,
  useGetLocationQuery,
  useGetLocationssQuery,
  useUpdateLocationMutation,
} from "../../features/locationApi";
import { useGetUpozilasQuery } from "../../features/upozilaApi";
import LocationModal from "./LocationModal";
import ShowLocation from "./ShowLocation";

const searchTextFieldsName = {
  location_name: "",
};

const searchFieldsName = {
  location_name: "",
  upozila_name: "",
  upozila_id: "",
  page: 1,
  limit: 10,
};

export default function ManageLocations() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [editItem, setEditItem] = useState({});
  const [deleteItemId, setDeleteItemId] = useState(null);

  const { search } = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchFields, setSearchFields] = useState(searchFieldsName);
  const [autoCompleteName, setAutCompleteName] = useState({
    upozila_id: "",
  });

  const [searchTextFields, setSearchTextFields] =
    useState(searchTextFieldsName);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [toastObj, setToast] = useState({});
  const [isOpenShow, setIsOpenShow] = useState(false);

  const [urlString, setUrlString] = useState(``);
  const {
    data: locations,
    isSuccess,
    isLoading,
  } = useGetLocationssQuery(urlString, { refetchOnMountorArgChange: true });

  const { data: upozilas, isSuccess: isUpozilasSuccess } = useGetUpozilasQuery(
    "",
    { refetchOnMountorArgChange: true }
  );

  const [locationId, setLocationId] = useState("");
  const {
    data: showUpozila,
    isSuccess: isShowUpozilaSuccess,
    isFetching,
    refetch,
  } = useGetLocationQuery(locationId, {
    refetchOnMountorArgChange: true,
  });

  const [deleteLocation, { isSuccess: isDeleteSuccess }] =
    useDeleteLocationMutation();

  const [
    updateLocation,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdateLocationMutation();

  const statusUpdate = (data, e) => {
    updateLocation({ id: data?.id, data: { ...data, status: e } });
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
    if (locationId === id) {
      refetch();
    } else {
      setLocationId(id);
    }
  };

  const showDistrict = (id) => {
    setIsOpenShow(true);
    if (locationId === id) {
      refetch();
    } else {
      setLocationId(id);
    }
  };

  useEffect(() => {
    setSearchFields({ ...searchFields, page: page, limit: limit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  useEffect(() => {
    if (search) {
      const result = Object.fromEntries([...searchParams]);

      const { upozila_name, location_name, upozila_id, status } = result;
      setSearchFields({
        ...searchFields,
        status,
        upozila_name,
        location_name,
        upozila_id,
      });
      setSearchTextFields({ ...searchTextFields, location_name });
      setAutCompleteName({ upozila_id, upozila_name });
    }
  }, []);

  useEffect(() => {
    if (!isFetching && isShowUpozilaSuccess) {
      setEditItem(showUpozila);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, isShowUpozilaSuccess, showUpozila]);

  const handleAddDoctor = () => {
    setIsOpen(true);
    setEditItem({});
  };

  const handleDelete = (id) => {
    deleteLocation(id);
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

  const handleSearchChange = (e) => {
    if (e) {
      setAutCompleteName({ upozila_id: e.id, upozila_name: e.upozila_name });
      setSearchFields({
        ...searchFields,
        ...searchTextFields,
        upozila_id: e.id,
        upozila_name: e.upozila_name,
      });
    } else {
      setAutCompleteName({ upozila_id: "", upozila_name: "" });
      setSearchFields({
        ...searchFields,
        ...searchTextFields,
        upozila_id: "",
        upozila_name: "",
      });
    }
  };

  const handleAllSearch = () => {
    setSearchFields({ ...searchFields, ...searchTextFields });
  };

  const cancelSearch = () => {
    setSearchFields(searchFieldsName);
    setSearchTextFields(searchTextFieldsName);
    setAutCompleteName({ upozila_id: "", upozila_name: "" });
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
  if (!isLoading && isSuccess && locations.data?.length === 0) {
    content = (
      <tbody>
        <tr>
          <td>There is no Locations.</td>
        </tr>
      </tbody>
    );
  }
  if (!isLoading && isSuccess && locations.data?.length > 0) {
    content = (
      <tbody>
        {locations.data.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>
              <Button
                className="me-2"
                color="primary"
                outline
                onClick={() => showDistrict(item?.id)}
              >
                <span className="d-flex gap-2">
                  <i className="bi bi-info-circle"></i>
                  Info
                </span>
              </Button>
            </td>
            <td>{item?.upozila_name}</td>
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
        <h5>Locations</h5>
        <button
          onClick={handleAddDoctor}
          type="button"
          className="btn btn-primary"
        >
          <span className="d-flex gap-2">
            <i className="bi bi-plus-circle"></i>
            Add Location
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
                <th scope="col">Upozila Name</th>
                <th scope="col">Location Name</th>

                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
              <tr>
                <th></th>
                <th></th>
                <td>
                  <SearchSelect
                    list={selectDataFormate(
                      isUpozilasSuccess,
                      upozilas?.data,
                      "upozila_name"
                    )}
                    value={formatValue(
                      autoCompleteName?.upozila_name,
                      "Enter Upozila"
                    )}
                    name="upozila"
                    onChange={(e) => handleSearchChange(e)}
                  />
                </td>
                <td>
                  <FromInput
                    name="location_name"
                    id="location_name"
                    placeholder="Enter Location Name"
                    value={searchTextFields?.location_name}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
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
        <LocationModal
          editItem={isOpen && editItem}
          setEditItem={setEditItem}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          setToast={setToast}
        />

        <ShowLocation
          setIsOpen={setIsOpenShow}
          isOpen={isOpenShow}
          editItem={editItem}
          setEditItem={setEditItem}
        />

        <ReactPagination
          total={locations?.total}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
        />
      </div>
    </>
  );
}
