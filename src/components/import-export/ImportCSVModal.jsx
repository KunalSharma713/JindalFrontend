import React, { useEffect, useState } from "react";
import CSVImportDropzone from "../CSVImportDropzone";
import { parseCSV, validateCSVData } from "../../utils/csvUtils";
import DataTable from "../DataTable";
import { useApi } from "../../hooks/useApi";
// Import Modal
const ImportCSVModal = ({
  type = "",
  isOpen,
  closeModal,
  columnDefinitions = [],
  onImport = () => {},
  header = "Import Records",
  subHeder = "Upldoad CSV file to import records.",
  isPending = false,
  customColumns,
}) => {
  const { apiRequest, loading } = useApi();
  const [listType, setListType] = useState("Uploaded");
  const [validationResults, setValidationResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileAccepted = async (file) => {
    setIsLoading(true);
    setFileName(file.name);

    try {
      const data = await parseCSV(file);
      const validated = validateCSVData(data, columnDefinitions);
      setValidationResults(validated);
    } catch (error) {
      console.error("CSV Parse Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleImportConfirm = async () => {
    const validRows = validationResults?.filter(
      (row) => row._rowErrors.length === 0
    );
    onImport(validRows);
  };

  useEffect(() => {
    if (!isOpen) {
      setFileName();
      setValidationResults([]);
      setListType("Uploaded");
    }
  }, [isOpen]);

  const generateSampleCSV = () => {
    if (!columnDefinitions || columnDefinitions.length === 0) return "";

    // Custom data for different types

    if (type === "location") {
      return ["Location Name,Latitude,Longitude"].join("\n");
    }

    // Fallback: dynamic sample based on column definitions
    const headers = columnDefinitions.map((col) => col.label).join(",");
    const exampleRow = columnDefinitions
      .map((col) => `"Sample ${col.label}"`)
      .join(",");

    return `${headers}\n${exampleRow}`;
  };

  const handleDownloadCSV = () => {
    const csvContent = generateSampleCSV();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${type + "_sample_upload_file"}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      isOpen={isOpen}
      onClose={() => {
        closeModal();
      }}
    >
      <div className="relative w-full  p-4 overflow-y-auto  no-scrollbar rounded-3xl  lg:p-11">
        {listType === "Uploaded" && (
          <div className="flex flex-wrap gap-4 lg:ml-auto justify-end">
            <button
              className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-1 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mb-2 lg:mb-0"
              size="sm"
              variant="outline"
              onClick={() => closeModal()}
            >
              Close
            </button>
          </div>
        )}
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {header}
          </h4>
          {listType === "Uploaded" && (
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              {subHeder}
            </p>
          )}
        </div>
        <button
          className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-1 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mb-5 capitalize flex flex-end"
          size="sm"
          variant="outline"
          onClick={handleDownloadCSV}
        >
          {type} Sample CSV
        </button>

        <form className="flex flex-col">
          <div className="px-2 overflow-y-auto custom-scrollbar max-h-[55vh]">
            {listType === "Uploaded" && (
              <CSVImportDropzone
                onFileAccepted={handleFileAccepted}
                fileName={fileName}
              />
            )}

            <Handler
              listType={listType}
              setListType={setListType}
              closeModal={closeModal}
              handleImportConfirm={handleImportConfirm}
              validationResults={validationResults}
              isPending={isPending}
            />

            {isLoading && (
              <div className="flex justify-center items-center my-4">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            )}
            {listType === "Uploaded" &&
              !isLoading &&
              validationResults.length > 0 && (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-sm border">
                    <thead className="bg-gray-100">
                      <tr>
                        {columnDefinitions.map((col, i) => (
                          <th key={i} className="p-2 text-left border">
                            {col.label}
                          </th>
                        ))}
                        <th className="p-2 text-left border">Validation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {validationResults.map((row, index) => (
                        <tr key={index} className="border-t">
                          {columnDefinitions.map((col, i) => (
                            <td key={i} className="p-2 border">
                              {row[col.key]}
                            </td>
                          ))}
                          <td className="p-2 text-red-500 border">
                            {row._rowErrors.length > 0
                              ? row._rowErrors.join(", ")
                              : "✅"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            {listType !== "Uploaded" && (
              <RequestList
                listType={listType}
                customColumns={customColumns}
                type={type}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImportCSVModal;

const Handler = ({
  listType,
  setListType,
  closeModal,
  handleImportConfirm,
  validationResults,
  isPending,
}) => {
  return (
    <>
      <div className="flex flex-col lg:flex-row lg:gap-4 lg:justify-between mt-4">
        {/* Left side buttons */}
        <div className="flex flex-wrap gap-4 lg:flex-grow">
          <button
            type="button"
            onClick={() => setListType("Uploaded")}
            className={`px-6 py-3 rounded-md font-semibold transition
      ${
        listType === "Uploaded"
          ? "bg-white text-black border border-black"
          : "bg-gray-200 text-gray-600 border border-gray-300 hover:bg-gray-300"
      }`}
          >
            Uploaded
          </button>

          {/* Request List button */}
          <button
            type="button"
            onClick={() => setListType("RequestList")}
            className={`px-6 py-3 rounded-md font-semibold transition
      ${
        listType === "RequestList"
          ? "bg-white text-black border border-black"
          : "bg-gray-200 text-gray-600 border border-gray-300 hover:bg-gray-300"
      }`}
          >
            Request List
          </button>
        </div>

        {/* Right side buttons */}
        <div className="flex flex-wrap gap-4 lg:ml-auto">
          {listType != "Uploaded" && (
            <button
              className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-1 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mb-2 lg:mb-0"
              size="sm"
              variant="outline"
              onClick={() => closeModal()}
            >
              Close
            </button>
          )}
          {/* Import button */}
          {listType === "Uploaded" && (
            <button
              className="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-1 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 mb-2 lg:mb-0"
              size="sm"
              type="button"
              onClick={handleImportConfirm}
              disabled={
                validationResults.length === 0 ||
                validationResults.some((r) => r._rowErrors.length > 0) ||
                isPending
              }
            >
              {isPending ? "Importing..." : "Import"}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

const RequestList = ({ listType, customColumns, type }) => {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [getlocationFetchResponse, setGetLocationFetchResponse] = useState({
    data: { records: [], totalCount: 0 },
    fetching: false,
    error: false,
  });

  const changePageRowHandle = async (page, pageSizes) => {
    setPageNo(page);
    setPageSize(pageSizes);
  };

  const getLocationFetchHandler = useCallback(async () => {
    setGetLocationFetchResponse((prev) => ({
      ...prev,
      fetching: true,
      error: false,
    }));

    try {
      const response = await apiRequest(`/bulkupload/${type}/upload`, "POST", {
        page_size: pageSize,
        page_no: pageNo,
      });

      setGetLocationFetchResponse({
        data: response?.data ?? { records: [], totalCount: 0 },
        fetching: false,
        error: false,
      });
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch data.");
      setGetLocationFetchResponse((prev) => ({
        ...prev,
        fetching: false,
        error: true,
      }));
    }
  }, [type, pageNo, pageSize]);

  useEffect(() => {
    if (listType === "RequestList") {
      getLocationFetchHandler();
    }
  }, [listType, getLocationFetchHandler]);

  return (
    <>
      <div className="mt-2">
        <DataTable
          dataRows={getlocationFetchResponse?.data?.records ?? []}
          isLoading={getlocationFetchResponse?.fetching}
          isError={getlocationFetchResponse?.error}
          listComponent={customColumns}
          changeRowPage={changePageRowHandle}
          totalRows={Number(getlocationFetchResponse?.data?.totalCount)}
          currentPage={pageNo}
          currentRows={pageSize}
        />
      </div>
    </>
  );
};
