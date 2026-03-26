import React, { useState, useCallback, useEffect } from "react";
import { X, Upload, List, FileText, CheckCircle } from "lucide-react";
import UploadedTab from "./UploadedTab";
import RequestListTab from "./RequestListTab";
import { toast } from "react-hot-toast";
import bulkUploadService from "../../services/bulkUploadService";
import { useApi } from "../../hooks/useApi";

const ImportCSVModal = ({
  type = "location",
  isOpen,
  onClose,
  onImportSuccess,
  warehouseId,
}) => {
  const [activeTab, setActiveTab] = useState("upload");
  const [isImporting, setIsImporting] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedBulkId, setSelectedBulkId] = useState(null);
  const { apiRequest } = useApi();

  // Initialize the service when the component mounts
  useEffect(() => {
    bulkUploadService.init(apiRequest);
  }, [apiRequest]);

  // Reset modal state when closing
  const handleClose = useCallback(() => {
    setActiveTab("upload");
    setFile(null);
    setFileName("");
    setFileData([]);
    setHeaders([]);
    setIsValid(false);
    setValidationErrors([]);
    setSelectedBulkId(null);
    onClose();
  }, [onClose]);

  const validateFile = (file) => {
    if (file) {
      setIsValid(true);
      setValidationErrors([]);
    } else {
      setIsValid(false);
      setValidationErrors(["Please upload a valid CSV file"]);
    }
  };

  const parseCSV = (text) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    if (lines.length === 0) return { headers: [], data: [] };

    const headers = lines[0].split(",").map((h) => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const row = {};
      let isValid = true;

      headers.forEach((header, index) => {
        row[header] = values[index] || "";
        // Basic validation - check required fields
        if (
          (header === "Location Name" ||
            header === "Latitude" ||
            header === "Longitude") &&
          !values[index]
        ) {
          isValid = false;
        }
      });

      row.isValid = isValid;
      data.push(row);
    }

    return { headers, data };
  };

  const handleFileUpload = useCallback((file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const { headers, data } = parseCSV(e.target.result);
      const allValid = data.every((row) => row.isValid);

      setFile(file);
      setFileName(file.name);
      setHeaders(headers);
      setFileData(data);
      setIsValid(allValid);
      setActiveTab("uploaded");
    };
    reader.readAsText(file);
  }, []);

  const handleFileRemove = () => {
    setFile(null);
    setFileName("");
    setFileData([]);
    setHeaders([]);
    setActiveTab("upload");
  };

  const handleImport = async () => {
    if (!file || !warehouseId) {
      toast.error("Please select a file and make sure a warehouse is selected");
      return;
    }

    if (!isValid) {
      toast.error("Please fix validation errors before importing");
      return;
    }

    setIsImporting(true);

    try {
      // Prepare the records in the format expected by the API
      const records = fileData.map(row => ({
        location_name: row['Location Name'],
        lat: parseFloat(row['Latitude']),
        long: parseFloat(row['Longitude']),
        barcode_key: row['Barcode Key'] || '' // Optional field
      }));

      const response = await bulkUploadService.uploadLocations({
        records,
        warehouse: warehouseId
      });
      
      setFile(null);
      setFileName("");
      setFileData([]);
      setHeaders([]);
      
      toast.success(`Successfully imported ${response.success} locations`);
      onImportSuccess?.();
      setActiveTab("requests");
    } catch (error) {
      console.error("Import error:", error);
      toast.error(error.response?.data?.message || "Failed to import locations");
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = ["Location Name", "Latitude", "Longitude", "Barcode Key"];
    const csvContent = [
      headers.join(","),
      "Location 1,28.6139,77.2090,BC001",
      "Location 2,28.6139,77.2090,BC002",
      "Location 3,28.6139,77.2090,BC003",
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "location_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "upload":
      case "uploaded":
        return (
          <UploadedTab
            fileName={fileName}
            onFileRemove={handleFileRemove}
            onFileUpload={handleFileUpload}
            isImporting={isImporting}
            onDownloadTemplate={handleDownloadTemplate}
            onImport={handleImport}
            isValid={isValid}
            validationErrors={validationErrors}
          />
        );
      case "requests":
        return (
          <RequestListTab 
            warehouseId={warehouseId} 
            selectedBulkId={selectedBulkId}
            onViewBulkRecords={(bulkId) => {
              setSelectedBulkId(bulkId);
            }}
          />
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:h-screen sm:align-middle">
          &#8203;
        </span>

        <div className="inline-block w-full max-w-2xl sm:max-w-4xl transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle mx-2 sm:mx-0">
          <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                Import {type === "location" ? "Locations" : "Items"} from CSV
              </h3>
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none p-1"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {activeTab === "uploaded" && fileData.length > 0 ? (
              <div className="mt-4 sm:mt-6 overflow-x-auto">
                <div className="align-middle inline-block min-w-full border-b border-gray-200">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {headers.map((header, index) => (
                          <th
                            key={index}
                            className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {fileData.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className={
                            !row.isValid ? "bg-red-50" : "hover:bg-gray-50"
                          }
                        >
                          {headers.map((header, colIndex) => (
                            <td
                              key={`${rowIndex}-${colIndex}`}
                              className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500"
                            >
                              {row[header]}
                            </td>
                          ))}
                          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                            {row.isValid ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Valid
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Invalid
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900">
                  Requirements:
                </h4>
                <ul className="mt-2 space-y-2 text-xs sm:text-sm text-gray-500">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>File must be in CSV format</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>
                      Required fields: Location Name, Latitude, Longitude
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Maximum file size: 10MB</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200 mt-4">
              <nav className="-mb-px flex space-x-4 sm:space-x-8">
                <button
                  onClick={() => setActiveTab("upload")}
                  className={`${
                    activeTab === "upload"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm`}
                >
                  <div className="flex items-center">
                    <Upload className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Upload File</span>
                    <span className="sm:hidden">Upload</span>
                  </div>
                </button>

                {file && (
                  <button
                    onClick={() => setActiveTab("uploaded")}
                    className={`${
                      activeTab === "uploaded"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm`}
                  >
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">File Details</span>
                      <span className="sm:hidden">Details</span>
                    </div>
                  </button>
                )}

                <button
                  onClick={() => setActiveTab("requests")}
                  className={`${
                    activeTab === "requests"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm`}
                >
                  <div className="flex items-center">
                    <List className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Import History</span>
                    <span className="sm:hidden">History</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          <div className="px-4 sm:px-6 pb-4 sm:pb-6">{renderTabContent()}</div>

          {/* Footer with Import Button */}
          {activeTab === "uploaded" && fileData.length > 0 && (
            <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleImport}
                disabled={!isValid || isImporting}
                className={`inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white ${
                  isValid && !isImporting
                    ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                    : "bg-blue-400 cursor-not-allowed"
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                {isImporting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Importing...
                  </>
                ) : (
                  "Import File"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportCSVModal;
