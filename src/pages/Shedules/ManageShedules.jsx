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
import { tConvert } from "../../components/tConvert";
import { useGetDoctorsQuery } from "../../features/doctorApi";
import {
  useDeleteSheduleMutation,
  useGetSheduleQuery,
  useGetShedulesQuery,
  useUpdateSheduleMutation,
} from "../../features/sheduleApi";
import SheudlesModal from "./SheudlesModal";
import ShowShedule from "./ShowShedule";

const searchTextFieldsName = {
  date: "",
};

const searchFieldsName = {
  date: "",
  doctor_name: "",
  doctor_id: "",
  page: 1,
  limit: 10,
};

export default function ManageShedules() {
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
    data: shedules,
    isLoading,
    isSuccess,
  } = useGetShedulesQuery(urlString, { refetchOnMountorArgChange: true });

  const [doctorId, setDoctorId] = useState("");
  const {
    data: showShedule,
    isSuccess: isShowSheduleSuccess,
    isFetching,
    refetch,
  } = useGetSheduleQuery(doctorId, {
    refetchOnMountorArgChange: true,
  });

  const [deleteShedule, { isSuccess: isDeleteSuccess }] =
    useDeleteSheduleMutation();

  const [
    updateShedule,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdateSheduleMutation();

  const statusUpdate = (data, e) => {
    updateShedule({ id: data?.id, data: { ...data, status: e } });
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
    deleteShedule(id);
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
  if (!isLoading && isSuccess && shedules.data?.length === 0) {
    content = (
      <tbody>
        <tr>
          <td>There is no doctos.</td>
        </tr>
      </tbody>
    );
  }
  if (!isLoading && isSuccess && shedules.data?.length > 0) {
    content = (
      <tbody>
        {shedules.data.map((item, index) => (
          <tr key={index} className="align-middle">
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
            <td>
              <Link to={`/doctors/${item?.doctor_id}`}>
                {item?.doctor_name}
              </Link>
            </td>
            <td>{item?.date}</td>
            <td>{tConvert(item?.start_time)}</td>
            <td>{tConvert(item?.end_time)}</td>
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
        <h5>Shedules</h5>
        <button
          onClick={handleAddDoctor}
          type="button"
          className="btn btn-primary"
        >
          <span className="d-flex gap-2">
            <i className="bi bi-plus-circle"></i>
            Add Shedules
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
              <tr className="align-middle">
                <th scope="col">SL</th>
                <th>Info</th>
                <th scope="col">Doctor Name</th>
                <th scope="col">Date</th>
                <th scope="col">State Time</th>
                <th scope="col">End Time</th>

                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
              <tr className="align-middle">
                <th></th>
                <th></th>
                <td>
                  <SearchSelect
                    list={selectDataFormate(
                      isDistrictSuccess,
                      doctors?.data,
                      "doctor_name"
                    )}
                    value={formatValue(autoCompleteName?.doctor_name, "Doctor")}
                    name="doctor_name"
                    onChange={(e) => handleSearchChange(e)}
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
        <SheudlesModal
          editItem={isOpen && editItem}
          setEditItem={setEditItem}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          setToast={setToast}
        />

        <ShowShedule
          setIsOpen={setIsOpenShow}
          isOpen={isOpenShow}
          editItem={editItem}
          setEditItem={setEditItem}
        />

        <ReactPagination
          total={shedules?.total}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
        />
      </div>
    </>
  );
}
