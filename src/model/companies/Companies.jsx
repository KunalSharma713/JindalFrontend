
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import useFetchAPI from "../../hooks/useFetchAPI";
import ThemeDataTable1 from "../../components/data-table/ThemeDataTable1";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverTrigger, PopoverContent } from "../../components/ui/popover";
import InputTableSearch from "../../components/forminputs/InputTableSearch";
import ImportCSVModal from "../../components/import-export/ImportCSVModal";
import NotificationAlert from "../../hooks/NotificationAlert";
import { Modal } from "../../components/ui/modal";
import { State } from 'country-state-city';

const Companies = () => {
  const navigate = useNavigate();

  // State for search input
  const [inputSearch, setInputSearch] = useState("");
  // Pagination state
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [order, setOrder] = useState({
    orderBy: "name",
    order: "desc",
  });
  // API call to fetch companies
  const [getCompanyFetchResponse, getCompanyFetchHandler] = useFetchAPI(
    {
      url: `/company`,
      method: "GET",
      authRequired: true,
      sendImmediately: true,
      params: {
        page_size: pageSize,
        page_no: pageNo,
        search: inputSearch,
        order: order.order,
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
    setPageNo(1)
    setInputSearch()
    await getCompanyFetchHandler({
      params: {
        page_size: pageSize,
        page_no: 1,
        search: "",
        order: order.order,
      }
    });
  };

  // Handle page or row size change
  const changePageRowHandle = async (page, pageSizes) => {
    await getCompanyFetchHandler({
      params: {
        page_size: pageSizes,
        page_no: page,
        search: inputSearch,
        order: order.order,
      },
    });
    setPageNo(page);
    setPageSize(pageSizes);
  };

  // Table column configuration
  const [savedTableColumns, setSavedTableColumns] = useState([
    { name: "ACTION", key: "actions" },
    { name: "TRANSPORT VENDOR NAME", key: "company_name" },
    { name: "CITY", key: "city" },
    { name: "STATE", key: "state" },
    { name: "SAP ID", key: "sap_id" },
  ]);

  useEffect(() => {
    setCustomColumns(
      (savedTableColumns ?? []).map((obj) => {

        return {
          name: obj?.name?.toUpperCase(),
          selector: (row) => {

            switch (obj?.key) {
              case "actions":
                return <Popover asChild>
                  <PopoverTrigger asChild>
                    <button className="btn">. . .</button>
                  </PopoverTrigger>

                  <PopoverContent className="popover-content w-50" >
                    <div className="mb-2">
                      <button className="text-sm" onClick={() => navigate(`/editcompany/:${row["_id"]}`)}>
                        Edit Company
                      </button>
                    </div>

                  </PopoverContent>
                </Popover>
              case "state":
                return State?.getStatesOfCountry("IN").find((item) => item?.isoCode == row["state"])?.name
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
            if (obj?.key === "name") {
              return "250px"
            }
            if (obj?.key === "actions") {
              return "70px"
            }
            let width = "200px";
            return width;
          },
          maxWidth: () => {
            if (obj?.key === "name") {
              return "250px"
            }
            if (obj?.key === "actions") {
              return "100px"
            }
            let width = "400px";
            return width;
          },
        };
      })
    );
  }, [savedTableColumns]);



  const tableSearchChange = async (value) => {
    setInputSearch(value);
    setPageNo(1);
    await getCompanyFetchHandler({
      params: {
        page_size: 10,
        page_no: 1,
        search: value,
        order: order.order,
      },
    });
  };



  const [importIsOpen, setimportIsOpen] = useState(false)
  const [importRecordsResponse, importRecordsHandler] = useFetchAPI(
    {
      url: "/bulkupload/company",
      method: "POST",
    },
    (response) => {
      if (response?.status === "success") {
        NotificationAlert(
          "success",
          "Records has been updated."
        );
      } else if ("pending" === response?.status) {
        NotificationAlert(
          "info",
          "Records update in progress."
        );
      } else {
        NotificationAlert(
          "error",
          "Bulk upload failed. Please review the information and try again."
        );
      }

      retryOrRefreshAction()
      setimportIsOpen(false)
      return response;
    },
    (error) => {
      return error;
    }
  );

  const [bulkuploadid, setbulkuploadid] = useState(null)
  const [isopen, setisopen] = useState(false)
  const bulkuploadrecords = () => {
    setisopen(!isopen)
  }

  const [customColumn, setCustomColumn] = useState([]);
  const [savedTableColumn, setSavedTableColumn] = useState([
    { name: "BULK UPLOAD ID", key: "_id" },
    { name: "STATUS", key: "status" },
    { name: "TOTAL RECORDS", key: "total_records" },
    { name: "TOTAL SUCCESS RECORDS", key: "total_success" },
    { name: "TOTAL ERRORS", key: "total_error" },
  ]);


  useEffect(() => {
    setCustomColumn(
      (savedTableColumn ?? []).map((obj) => {

        return {
          name: obj?.name?.toUpperCase(),
          selector: (row) => {

            switch (obj?.key) {
              case "status":
                return <span className={` ${row[obj?.key] == "success" ? "bg-green-100" : row[obj?.key] == "pending" ? "bg-blue-100" : "bg-red-100"}  text-blue-800 text-xs 
                  font-medium me-2 px-2.5 py-0.5 
                  rounded-sm dark:bg-blue-900
                   dark:text-blue-300`}>
                  {row[obj?.key]}
                </span>

              case "_id":
                return <span onClick={() => {
                  bulkuploadrecords()
                  setimportIsOpen(false)
                  setbulkuploadid(row[obj?.key])
                }}
                  className="text-blue-500 cursor-pointer">
                  {row[obj?.key]}
                </span>

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

            let width = "200px";
            return width;
          },
        };
      })
    );
  }, [savedTableColumn]);




  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-[22px] font-semibold">Transport Vendors</h2>

      <div className="flex justify-between items-center mb-5 mt-4 sm:flex-row sm:justify-between sm:items-center">

        <div>
          <ImportCSVModal
            type="company"
            customColumns={customColumn}
            isOpen={importIsOpen}
            header={"Import Transport Vendor"}
            closeModal={setimportIsOpen}
            columnDefinitions={columnDefinitions}
            isPending={importRecordsResponse?.fetching}
            onImport={async (validRows) => {
              let data = await validRows.map(obj => {
                const newObj = {};
                for (const key in obj) {
                  const newKey = key?.replace(/\s+/g, '_').toLowerCase();
                  newObj[newKey] = obj[key];
                }
                return newObj;
              })

              importRecordsHandler({
                body: {
                  records: data
                }
              })

            }}
          />
        </div>
        <BulkuploadRecords
          isOpen={isopen}
          header={"Transport Vendor"}
          closeModal={bulkuploadrecords}
          bulkuploadid={bulkuploadid}
        />


        <div>
          <Button onClick={() => setimportIsOpen(true)} className="sm-w-[100%] mx-2 text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2">
            Import
          </Button>
          <Button onClick={() => navigate("/createcompany")} className="sm-w-[100%]">
            Add Transport Vendor
          </Button>
        </div>
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
        dataRows={getCompanyFetchResponse?.data?.CompanyListing ?? []}
        isLoading={getCompanyFetchResponse?.fetching}
        isError={getCompanyFetchResponse?.error}
        listComponent={customColumns}
        changeRowPage={changePageRowHandle}
        totalRows={Number(getCompanyFetchResponse?.data?.totalCompanyCount)}
        currentPage={pageNo}
        currentRows={pageSize}
        retryAction={retryOrRefreshAction}
      />

    </div>
  );
}
export default Companies

const BulkuploadRecords = ({
  isOpen,
  closeModal,
  header = "",
  bulkuploadid
}) => {
  const [listType, setListType] = useState("success")

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);


  const [customColumns, setCustomColumn] = useState([]);
  const [savedTableColumn, setSavedTableColumn] = useState([
    { name: "TRANSPORT VENDOR NAME", key: "company_name" },
    { name: "USER NAME", key: "username" },
    { name: "FIRST NAME", key: "first_name" },
    { name: "LAST NAME", key: "last_name" },
    { name: "MOBILE NUMBER", key: "mobile_no" },
  ]);

  useEffect(() => {
    setCustomColumn(
      (savedTableColumn ?? []).map((obj) => {

        return {
          name: obj?.name?.toUpperCase(),
          selector: (row) => {

            let userDeatils = row["munshiId"]
            switch (obj?.key) {
              case "username":
              case "first_name":
              case "last_name":
              case "mobile_no":
                return userDeatils[obj?.key]


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
            if (obj?.key === "name") {
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
  }, [savedTableColumn]);

  const [getCompanyFetchResponse, getCompanyFetchHandler] = useFetchAPI(
    {
      url: `/bulkupload/company/succes`,
      method: "POST",
      body: {
        page_size: pageSize,
        page_no: pageNo,
        bulkuploadid: bulkuploadid
      }
    },
    (e) => {
      return e;
    },
    (e) => {
      return e?.response ?? true;
    }
  );


  const changePageRowHandle = async (page, pageSizes) => {
    await getCompanyFetchHandler({
      body: {
        page_size: pageSize,
        page_no: page,
        bulkuploadid: bulkuploadid
      }
    });
    setPageNo(page);
    setPageSize(pageSizes);
  };










  const [EpageNo, setEPageNo] = useState(1);
  const [EpageSize, setEPageSize] = useState(10);
  const [customColumnsErrors, setCustomColumnErrors] = useState([]);
  const [savedTableColumnErrors, setSavedTableColumnErrors] = useState([
    { name: "BULK UPLOAD ID", key: "bulkuploadid" },
    { name: "ERROR", key: "massage" },
  ]);

  const [errorFetchResponse, errorFetchHandler] = useFetchAPI(
    {
      url: `/bulkupload/company/error`,
      method: "POST",
      body: {
        page_size: EpageSize,
        page_no: EpageNo,
        bulkuploadid: bulkuploadid
      }
    },
    (e) => {


      const keysArray = Object.keys(e?.errors?.[0]?.records ?? {}).map(key => ({
        name: key,
        key: key
      }));

      setSavedTableColumnErrors([
        { name: "BULK UPLOAD ID", key: "bulkuploadid" },
        { name: "ERROR", key: "massage" },
        ...keysArray
      ]);

      return e;
    },
    (e) => {
      return e?.response ?? true;
    }
  );





  useEffect(() => {
    setCustomColumnErrors(
      (savedTableColumnErrors ?? []).map((obj) => {

        return {
          name: obj?.name?.toUpperCase(),
          selector: (row) => {


            switch (obj?.key) {
              case "massage":
                return <span className="text-red-500">{row[obj.key]}</span>;
              default:
                return (
                  <span>
                    {row?.[obj?.key] != null && row?.[obj?.key] !== ""
                      ? row[obj.key]
                      : row?.records?.[obj?.key] ?? ""}
                  </span>
                );
            }

          },

          sortable: false,
          minWidth: () => {
            if (obj?.key === "massage") {
              return "550px"
            }

            let width = "200px";
            return width;
          },
        };
      })
    );
  }, [savedTableColumnErrors]);


  const changeErrorPageRowHandle = async (page, pageSizes) => {
    await errorFetchHandler({
      body: {
        page_size: pageSize,
        page_no: page,
        bulkuploadid: bulkuploadid
      }
    });
    setEPageNo(page);
    setEPageSize(pageSizes);
  };


  useEffect(() => {
    if (bulkuploadid && listType === "success") {
      getCompanyFetchHandler({
        body: {
          page_size: pageSize,
          page_no: pageNo,
          bulkuploadid: bulkuploadid
        }
      })
    } else {
      errorFetchHandler({
        body: {
          page_size: pageSize,
          page_no: pageNo,
          bulkuploadid: bulkuploadid
        }
      })
    }
  }, [bulkuploadid, listType])

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        closeModal();
      }}
    >
      <div className="relative w-full  p-4 overflow-y-auto  no-scrollbar rounded-3xl  lg:p-11">

        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {header}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {listType === "success"
              ? "All successfully updated records"
              : "All records with errors or failures"}
          </p>
        </div>

        <Handler
          listType={listType}
          setListType={setListType}
          closeModal={closeModal}
        />


        {listType === "success" && <ThemeDataTable1
          dataRows={getCompanyFetchResponse?.data?.records ?? []}
          isLoading={getCompanyFetchResponse?.fetching}
          isError={getCompanyFetchResponse?.error}
          listComponent={customColumns}
          changeRowPage={changePageRowHandle}
          totalRows={Number(getCompanyFetchResponse?.data?.totalCount)}
          currentPage={pageNo}
          currentRows={pageSize}

        />}



        {listType !== "success" && <ThemeDataTable1
          dataRows={errorFetchResponse?.data?.errors ?? []}
          isLoading={errorFetchResponse?.fetching}
          isError={errorFetchResponse?.error}
          listComponent={customColumnsErrors}
          changeRowPage={changeErrorPageRowHandle}
          totalRows={Number(errorFetchResponse?.data?.totalCount)}
          currentPage={pageNo}
          currentRows={pageSize}

        />}


      </div>
    </Modal>
  );
};



const columnDefinitions = [
  {
    key: "Company Name",
    label: "Company Name",
    type: "String",
    required: true,
    errorMessage: "Company Name is required and must be a non-empty string.",
  },

  {
    key: "State",
    label: "State",
    type: "string",
    required: true,
    errorMessage: "State is required.",
  },
  {
    key: "City",
    label: "City",
    type: "string",
    required: true,
    errorMessage: "City is required and must be a non-empty string.",
  },
  {
    key: "Username",
    label: "Username",
    type: "username",
    required: true,
    errorMessage: "Username is required and must be a non-empty string.",
  },
  {
    key: "First Name",
    label: "First Name",
    type: "name",
    required: true,
    errorMessage: "First Name is required and must be a non-empty string.",
  },
  {
    key: "Last Name",
    label: "Last Name",
    type: "name",
    required: false,
    errorMessage: "Last Name is required and must be a non-empty string.",
  },

  {
    key: "Email",
    label: "Email",
    type: "email",
    required: true,
    errorMessage: "Email is required and must be a non-empty string.",
  },
  {
    key: "Password",
    label: "Password",
    type: "password",
    required: true,
    errorMessage: "Password is required and must be a non-empty string.",
  },
  {
    key: "Mobile Number",
    label: "Mobile Number",
    type: "mobile_number",
    required: false,
    errorMessage: "Mobile Number is required and must be a non-empty string.",
  },
  {
    key: "Gender",
    label: "Gender",
    type: "string",
    required: true,
    errorMessage: "Gender is required and must be a non-empty string.",

  },
  {
    key: "Sap Id",
    label: "Sap Id",
    type: "string",
    required: true,
    errorMessage: "Sap ID is required and must be a non-empty string.",

  }
];




const Handler = ({ listType, setListType, closeModal }) => {
  return <>

    <div className="flex flex-col lg:flex-row lg:gap-4 lg:justify-between my-4">
      {/* Left side buttons */}
      <div className="flex flex-wrap gap-4 lg:flex-grow">
        <button
          type="button"
          onClick={() => setListType("success")}
          className={`px-6 py-3 rounded-md font-semibold transition
      ${listType === "success"
              ? "bg-white text-black border border-black"
              : "bg-gray-200 text-gray-600 border border-gray-300 hover:bg-gray-300"
            }`}
        >
          Success
        </button>

        {/* Request List Button */}
        <button
          type="button"
          onClick={() => setListType("error")}
          className={`px-6 py-3 rounded-md font-semibold transition
      ${listType === "error"
              ? "bg-white text-black border border-black"
              : "bg-gray-200 text-gray-600 border border-gray-300 hover:bg-gray-300"
            }`}
        >
          Error
        </button>
      </div>

      <div className="flex flex-wrap gap-4 lg:ml-auto">
        <button
          type="button"
          onClick={() => closeModal()}
          className={`px-6 py-3 rounded-md font-semibold transition bg-white text-black border border-black`}
        >
          Close
        </button>

      </div>

    </div>
  </>
}