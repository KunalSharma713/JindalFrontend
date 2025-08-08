import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import useFetchAPI from "../../hooks/useFetchAPI";
import ThemeDataTable1 from "../../components/data-table/ThemeDataTable1";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../components/ui/popover";
import InputTableSearch from "../../components/forminputs/InputTableSearch";

const TruckTypeList = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sorting] = useState({
    orderBy: "name",
    order: "DESC",
  });

  const [columns] = useState([
    { name: "ACTION", key: "actions" },
    { name: "Truck Type", key: "name" },
    { name: "Truck Code", key: "truck_code" },
    { name: "Description", key: "description" },
  ]);

  const [customColumns, setCustomColumns] = useState([]);

  const [truckTypeResponse, fetchTruckTypes] = useFetchAPI(
    {
      url: `/trucks/getalltrucktype`,
      method: "GET",
      authRequired: true,
      sendImmediately: true,
      params: {
        page_size: rowsPerPage,
        page_no: pageNumber,
        search: searchTerm,
        order: sorting.order,
      },
    },
    (success) => success,
    (error) => error?.response ?? true
  );

  // Fetch on search/page change
  useEffect(() => {
    fetchTruckTypes({
      params: {
        page_size: rowsPerPage,
        page_no: pageNumber,
        search: searchTerm,
        order: sorting.order,
      },
    });
  }, [searchTerm, pageNumber, rowsPerPage]);

  // Update columns
  useEffect(() => {
    const widthMap = {
      actions: "80px",
      name: "200px",
      truck_code: "150px",
      description: "300px",
    };

    setCustomColumns(
      columns.map((col) => ({
        name: col.name.toUpperCase(),
        selector: (row) => {
          if (col.key === "actions") {
            return (
              <Popover asChild>
                <PopoverTrigger asChild>
                  <button className="btn">. . .</button>
                </PopoverTrigger>
                <PopoverContent className="popover-content w-50">
                  <div className="mb-2">
                    <button
                      className="text-sm"
                      onClick={() => navigate(`/edittruck/${row["_id"]}`)}
                    >
                      Edit Truck
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            );
          }

          return (
            <span>
              {row[col.key] == null || row[col.key] === ""
                ? ""
                : row[col.key]}
            </span>
          );
        },
        sortable: false,
        width: widthMap[col.key] || "120px",
      }))
    );
  }, [columns]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPageNumber(1);
  };

  const handlePaginationChange = (page, pageSize) => {
    setPageNumber(page);
    setRowsPerPage(pageSize);
  };

  const refreshData = () => {
    fetchTruckTypes({
      params: {
        page_size: rowsPerPage,
        page_no: pageNumber,
        search: searchTerm,
        order: sorting.order,
      },
    });
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-[22px] font-semibold">Truck Types</h2>

      <div className="flex justify-between items-center mb-5 mt-4 sm:flex-row">
        <div></div>
        <div>
          <Button onClick={() => navigate("/createtruck")}>Add Truck</Button>
        </div>
      </div>

      <div className="mb-3">
        <InputTableSearch
          value={searchTerm}
          setValue={handleSearchChange}
          clearable={true}
          className="inputtable-search"
        />
      </div>

      <ThemeDataTable1
        dataRows={truckTypeResponse?.data?.truckTypes ?? []}
        isLoading={truckTypeResponse?.fetching}
        isError={truckTypeResponse?.error}
        listComponent={customColumns}
        changeRowPage={handlePaginationChange}
        totalRows={Number(truckTypeResponse?.data?.totalCompanyCount || 0)}
        currentPage={pageNumber}
        currentRows={rowsPerPage}
        retryAction={refreshData}
      />
    </div>
  );
};

export default TruckTypeList;
