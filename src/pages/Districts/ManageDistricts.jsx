import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import DeleteAlert from "../../components/DeleteAlert";
import FromInput from "../../components/FromInput";
import FromSelect from "../../components/FromSelect";
import { statusList } from "../../components/list";
import ReactPagination from "../../components/ReactPagination";
import { searchFieldsLength, searchUrl } from "../../components/searchFields";
import {
  useDeleteDistrictMutation,
  useGetDistrictQuery,
  useGetDistrictsQuery,
  useUpdateDistrictMutation,
} from "../../features/districtApi";
import DistrictModal from "./DistrictModal";
import ShowDistrict from "./ShowDistrict";

const searchTextFieldsName = {
  district_name: "",
};

const searchFieldsName = {
  district_name: "",
  page: 1,
  limit: 10,
};

export default function ManageDistricts() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [editItem, setEditItem] = useState({});
  const [deleteItemId, setDeleteItemId] = useState(null);

  const { search } = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchFields, setSearchFields] = useState(searchFieldsName);

  const [searchTextFields, setSearchTextFields] =
    useState(searchTextFieldsName);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [toastObj, setToast] = useState({});
  const [isOpenShow, setIsOpenShow] = useState(false);

  const [urlString, setUrlString] = useState(``);
  const {
    data: districts,
    isLoading,
    isSuccess,
    error,
  } = useGetDistrictsQuery(urlString, { refetchOnMountorArgChange: true });

  const [doctorId, setDoctorId] = useState("");
  const {
    data: showDoctor,
    isSuccess: isShowDoctorSuccess,
    isFetching,
    refetch,
  } = useGetDistrictQuery(doctorId, {
    refetchOnMountorArgChange: true,
  });

  const [deleteDoctor, { isSuccess: isDeleteSuccess }] =
    useDeleteDistrictMutation();

  const [
    updateDoctor,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdateDistrictMutation();

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

  const showDistrict = (id) => {
    setIsOpenShow(true);
    if (doctorId === id) {
      refetch();
    } else {
      setDoctorId(id);
    }
  };

  useEffect(() => {
    if (search) {
      const result = Object.fromEntries([...searchParams]);

      const { district_name } = result;
      setSearchFields({
        ...searchFields,
        district_name,
      });
      setSearchTextFields({ ...searchTextFields, district_name });
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

  console.log(editItem);

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
    setPage(1);
    setLimit(10);
  };

  let content = null;

  console.log(districts?.data);

  if (isLoading && !isSuccess) {
    content = (
      <tbody>
        <tr>
          <td>Loading...</td>
        </tr>
      </tbody>
    );
  }
  if (!isLoading && isSuccess && districts.data?.length === 0) {
    content = (
      <tbody>
        <tr>
          <td>There is no doctos.</td>
        </tr>
      </tbody>
    );
  }
  if (!isLoading && isSuccess && districts.data?.length > 0) {
    content = (
      <tbody>
        {districts.data.map((item, index) => (
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
        <h5>Districts</h5>
        <button
          onClick={handleAddDoctor}
          type="button"
          className="btn btn-primary"
        >
          <span className="d-flex gap-2">
            <i className="bi bi-plus-circle"></i>
            Add District
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

                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
              <tr>
                <th></th>
                <th></th>
                <td>
                  <FromInput
                    name="district_name"
                    id="district_name"
                    placeholder="Enter District Name"
                    value={searchTextFields?.district_name}
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

                {searchFieldsLength(searchFields, searchTextFields) > 0 ? (
                  <th className="d-flex align-items-center">
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

          <ToastContainer />
        </div>
        <DistrictModal
          editItem={isOpen && editItem}
          setEditItem={setEditItem}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          setToast={setToast}
        />

        <ShowDistrict
          setIsOpen={setIsOpenShow}
          isOpen={isOpenShow}
          editItem={editItem}
          setEditItem={setEditItem}
        />

        <ReactPagination
          total={districts?.total}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
        />
      </div>
    </>
  );
}
