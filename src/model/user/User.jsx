import { useState, useEffect } from "react";
// import { UserFilters } from "../../components/ui/userFilters";
import { Button } from "../../components/ui/button";
import useFetchAPI from "../../hooks/useFetchAPI";
import moment from "moment"
import ThemeDataTable1 from "../../components/data-table/ThemeDataTable1"
import { useNavigate } from "react-router-dom";
import { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from "../../components/ui/popover";
import NotificationAlert from "../../hooks/NotificationAlert";
import Deleteuser from "./Deleteuser";
import InputTableSearch from "../../components/forminputs/InputTableSearch";
import { useSelector } from "react-redux";


const User = () => {
  const navigate = useNavigate();
  const { currentPlant } = useSelector(
    (state) => state.LoginReducer
  );
  // const [selectedRole, setSelectedRole] = useState("");

  const [inputSearch, setInputSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [order, setOrder] = useState({
    orderBy: "name",
    order: "DESC",
  });

  const [getUsersFetchResponse, getUsersFetchHandler] = useFetchAPI(
    {
      url: `/users`,
      method: "GET",
      authRequired: true,
      sendImmediately: true,
      params: {
        page_size: pageSize,
        page_no: pageNo,
        search: inputSearch,
        order: order.order,
        plant_id: currentPlant?._id
      },
    },
    (e) => {
      return e;
    },
    (e) => {
      return e?.response ?? true;
    }
  );

  const [customColumns, setCustomColumns] = useState([]);
  const retryOrRefreshAction = async () => {
    await getUsersFetchHandler();
  };

  const changePageRowHandle = async (page, pageSizes) => {
    await getUsersFetchHandler({
      params: {
        page_size: pageSizes,
        page_no: page,
        search: inputSearch,
        order: order.order,
        plant_id: currentPlant?._id
      },
    });
    setPageNo(page);
    setPageSize(pageSizes);
  };

  const [savedTableColumns, setSavedTableColumns] = useState([
    { name: "ACTION", key: "actions" },
    { name: "USER NAME", key: "username" },
    { name: "ROLE", key: "role" },
    { name: "EMAIL ID", key: "email" },
    { name: "FIRST NAME", key: "first_name" },
    { name: "LAST NAME", key: "last_name" },
    { name: "PHONE NUMBER", key: "mobile_no" },
    { name: "GENDER", key: "gender" },
    { name: "DATE OF BIRTH", key: "dob" },

  ]);


  const [DeleteUserId, setDeleteUserId] = useState(null)
  const [deleteUsersFetchResponse, deleteUsersFetchHandler] = useFetchAPI(
    {
      url: `/users/delete/${DeleteUserId}`,
      method: "GET",
      authRequired: true,
    },
    (e) => {
      retryOrRefreshAction()
      NotificationAlert(
        "success",
        "User has been deleted successfully."
      );

      return e;
    },
    (e) => {
      return e?.response ?? true;
    }
  );



  // State to control the popover visibility
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const handleDeleteClick = () => {
    setPopoverOpen(!isPopoverOpen);
  };



  useEffect(() => {
    setCustomColumns(
      (savedTableColumns ?? []).map((obj) => {
        return {
          name: obj?.name?.toUpperCase(),
          selector: (row) => {
            switch (obj?.key) {

              case "role":
                return row?.["roleDetails"]?.name

              case "actions":
                return <Popover asChild>
                  <PopoverTrigger asChild>
                    <button className="btn" >. . .</button>
                  </PopoverTrigger>

                  <PopoverContent className="popover-content w-50" >
                    <div className="mb-2">
                      <button className="text-sm" onClick={() => navigate(`/edituser/:${row["_id"]}`)}>
                        Edit User
                      </button>
                    </div>

                    <div>
                      <button className="text-sm" onClick={() => {
                        setDeleteUserId(row?.["_id"])
                        handleDeleteClick()
                      }} >
                        Delete User
                      </button>
                    </div>

                  </PopoverContent>
                </Popover>
              case "dob":
                return (
                  <span>
                    {row?.[obj?.key]
                      ? moment(row?.[obj?.key]).format("DD/MM/YYYY")
                      : ""}
                  </span>
                );


              case "gender":
                return (
                  <span
                    className={`px-2 py-1 rounded text-xs ${row?.[obj?.key] === "male"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {row?.[obj?.key] === "female" ? "Female" : "Male"}
                  </span>

                );
              default:
                return (
                  <span>
                    {row[obj?.key] == null ||
                      row[obj?.key] == "" ||
                      row[obj?.key] == undefined
                      ? ""
                      : row[obj?.key]}
                  </span>
                );
            }
          },

          sortable: false,
          minWidth: () => {
            if (obj?.key === "email" || obj?.key === "dob") {
              return "250px"
            }
            if (obj?.key === "actions") {
              return "100px"
            }
            let width = "200px";
            return width;
          },
        };
      })
    );
  }, [savedTableColumns]);

  const tableSearchChange = async (value) => {
    setInputSearch(value);
    setPageNo(1);
    await getUsersFetchHandler({
      params: {
        page_size: 10,
        page_no: 1,
        search: value,
        order: order.order,
        plant_id: currentPlant?._id
      },
    });
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-[22px] font-semibold">Users</h2>

      <div className="flex justify-between items-center mb-5 mt-4 sm:flex-row sm:justify-between sm:items-center">

        <div>

        </div>
        <Button onClick={() => navigate("/createuser")} className="sm-w-[100%]">
          Add User
        </Button>
      </div>

      <div className="mb-3" >
        <InputTableSearch
          value={inputSearch}
          setValue={tableSearchChange}
          clearable={true}
          className="inputtable-search"
        />
      </div>

      <ThemeDataTable1
        dataRows={getUsersFetchResponse?.data?.usersListing ?? []}
        isLoading={getUsersFetchResponse?.fetching}
        isError={getUsersFetchResponse?.error}
        listComponent={customColumns}
        changeRowPage={changePageRowHandle}
        totalRows={Number(getUsersFetchResponse?.data?.totalUserCount)}
        currentPage={pageNo}
        currentRows={pageSize}
        retryAction={retryOrRefreshAction}
      />


      <Deleteuser
        isModalOpen={isPopoverOpen}
        closeModal={handleDeleteClick}
        deleteUsersFetchHandler={deleteUsersFetchHandler}
      />

    </div>
  );
}
export default User