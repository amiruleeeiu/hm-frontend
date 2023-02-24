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
import { searchFieldsLength, searchUrl } from "../../components/searchFields";
import SearchHandler from "../../components/SearchHandler";
import SearchSelect from "../../components/SearchSelect";
import { selectDataFormate } from "../../components/selectDataFormate";
import Status from "../../components/Status";
import { useGetDistrictsQuery } from "../../features/districtApi";
import {
  useDeleteUpozilaMutation,
  useGetUpozilaQuery,
  useGetUpozilasQuery,
  useUpdateUpozilaMutation,
} from "../../features/upozilaApi";
import ShowUpozila from "./ShowUpozila";
import UpozilaModal from "./UpozilaModal";

const searchTextFieldsName = {
  upozila_name: "",
};

const searchFieldsName = {
  district_id: "",
  district_name: "",
  upozila_name: "",
  page: 1,
  limit: 10,
};

export default function ManageUpozilas() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [editItem, setEditItem] = useState({});
  const [deleteItemId, setDeleteItemId] = useState(null);

  const { search } = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchFields, setSearchFields] = useState(searchFieldsName);
  const [autoCompleteName, setAutCompleteName] = useState({
    district_id: "",
  });

  const [searchTextFields, setSearchTextFields] =
    useState(searchTextFieldsName);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [toastObj, setToast] = useState({});
  const [isOpenShow, setIsOpenShow] = useState(false);

  const { data: districts, isSuccess: isDistrictSuccess } =
    useGetDistrictsQuery("", {
      refetchOnMountorArgChange: true,
    });

  const [urlString, setUrlString] = useState(``);
  const {
    data: upozilas,
    isLoading,
    isSuccess,
    error,
  } = useGetUpozilasQuery(urlString, { refetchOnMountorArgChange: true });

  const [doctorId, setDoctorId] = useState("");
  const {
    data: showUpozila,
    isSuccess: isShowUpozilaSuccess,
    isFetching,
    refetch,
  } = useGetUpozilaQuery(doctorId, {
    refetchOnMountorArgChange: true,
  });

  const [deleteUpozila, { isSuccess: isDeleteSuccess }] =
    useDeleteUpozilaMutation();

  const [
    updateUpozila,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdateUpozilaMutation();

  const statusUpdate = (data, e) => {
    updateUpozila({ id: data?.id, data: { ...data, status: e } });
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

      const { upozila_name, district_name, district_id } = result;
      setSearchFields({
        ...searchFields,
        upozila_name,
        district_name,
        district_id,
      });
      setSearchTextFields({ ...searchTextFields, upozila_name });
      setAutCompleteName({ district_name, district_id });
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
    deleteUpozila(id);
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
      setAutCompleteName({ district_id: e.id, district_name: e.district_name });
      setSearchFields({
        ...searchFields,
        ...searchTextFields,
        district_id: e.id,
        district_name: e.district_name,
      });
    } else {
      setAutCompleteName({ district_id: "", district_name: "" });
      setSearchFields({
        ...searchFields,
        ...searchTextFields,
        district_id: "",
        district_name: "",
      });
    }
  };

  const handleAllSearch = () => {
    setSearchFields({ ...searchFields, ...searchTextFields });
  };

  const cancelSearch = () => {
    setSearchFields(searchFieldsName);
    setSearchTextFields(searchTextFieldsName);
    setAutCompleteName({ district_id: "", district_name: "" });
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
  if (!isLoading && isSuccess && upozilas.data?.length === 0) {
    content = (
      <tbody>
        <tr>
          <td>There is no doctos.</td>
        </tr>
      </tbody>
    );
  }
  if (!isLoading && isSuccess && upozilas.data?.length > 0) {
    content = (
      <tbody>
        {upozilas.data.map((item, index) => (
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
            <td>{item?.district_name}</td>
            <td>{item?.upozila_name}</td>
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
        <h5>Upozilas</h5>
        <button
          onClick={handleAddDoctor}
          type="button"
          className="btn btn-primary"
        >
          <span className="d-flex gap-2">
            <i className="bi bi-plus-circle"></i>
            Add Upozila
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
                <th scope="col">District Name</th>
                <th scope="col">Upozila Name</th>

                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
              <tr>
                <th></th>
                <th></th>
                <td>
                  <SearchSelect
                    list={selectDataFormate(
                      isDistrictSuccess,
                      districts?.data,
                      "district_name"
                    )}
                    value={formatValue(
                      autoCompleteName?.district_name,
                      "District"
                    )}
                    name="district"
                    onChange={(e) => handleSearchChange(e)}
                  />
                </td>
                <td>
                  <FromInput
                    name="upozila_name"
                    id="upozila_name"
                    placeholder="Enter District Name"
                    value={searchTextFields?.upozila_name}
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
        <UpozilaModal
          editItem={isOpen && editItem}
          setEditItem={setEditItem}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          setToast={setToast}
        />

        <ShowUpozila
          setIsOpen={setIsOpenShow}
          isOpen={isOpenShow}
          editItem={editItem}
          setEditItem={setEditItem}
        />

        <ReactPagination
          total={upozilas?.total}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
        />
      </div>
    </>
  );
}
