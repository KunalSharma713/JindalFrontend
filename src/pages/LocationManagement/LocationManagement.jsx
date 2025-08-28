import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Edit3,
  Trash2,
  MapPin,
  Upload,
  FileText,
  Download,
} from "lucide-react";
import { toast } from "react-hot-toast";
import DataTable from "../../components/DataTable";
import LocationModal from "../../components/LocationManagement/LocationModal";
import ImportCSVModal from "../../components/import-export/ImportCSVModal";
import { useApi } from "../../hooks/useApi";

const LocationManagement = () => {
  const dispatch = useDispatch();
  const { apiRequest } = useApi();
  const [customColumns, setCustomColumns] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [sortConfig, setSortConfig] = useState({
    key: "location_name",
    direction: "asc",
  });
  const [filters, setFilters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [currentWarehouse, setCurrentWarehouse] = useState(() => {
    const warehouseId = localStorage.getItem("selectedPlantId");
    return warehouseId ? { _id: warehouseId } : null;
  });
  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      const { page, limit } = pagination;
      const { key, direction } = sortConfig;
      const warehouseId = localStorage.getItem("selectedPlantId");

      if (!warehouseId) {
        setLocations([]);
        return;
      }

      // Build query params
      const params = new URLSearchParams({
        page,
        limit,
        ...(key && { sortBy: key, sortOrder: direction }),
        ...filters,
        warehouse: warehouseId,
      });

      const response = await apiRequest(`location/web/?${params}`, "GET");

      if (response && response.data) {
        // Transform data to match DataTable expected format
        const transformedData = response.data.map((location) => ({
          ...location,
          id: location._id,
          warehouseName: location.warehouse?.name || "N/A",
          coordinates:
            location.lat && location.long
              ? `${location.lat.toFixed(4)}, ${location.long.toFixed(4)}`
              : "Not set",
        }));

        setLocations(transformedData);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination?.total || response.data.length,
          totalPages: response.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Failed to fetch locations");
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    sortConfig,
    filters,
    currentWarehouse,
  ]);

  // Update currentWarehouse when selectedPlantId changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const warehouseId = localStorage.getItem("selectedPlantId");
      const warehouseName = localStorage.getItem("selectedPlantName");

      setCurrentWarehouse(
        warehouseId ? { _id: warehouseId, name: warehouseName } : null
      );
    };

    // Listen for storage events (changes from other tabs/windows)
    window.addEventListener("storage", handleStorageChange);

    // Initial check
    handleStorageChange();

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (currentWarehouse?._id) {
      fetchLocations();
    }
  }, [
    pagination.page,
    pagination.limit,
    sortConfig,
    filters,
    fetchLocations,
    currentWarehouse,
  ]);

  const handleAddLocation = () => {
    setSelectedLocation(null);
    setIsModalOpen(true);
  };

  const handleImportSuccess = () => {
    fetchLocations();
    setIsImportModalOpen(false);
    toast.success("Locations imported successfully");
  };

  const handleEdit = (location) => {
    if (!location) return;
    setSelectedLocation({
      ...location,
      // Ensure all required fields have proper defaults if they're null/undefined
      location_name: location.location_name || "",
      barcode_key: location.barcode_key || "",
      lat: location.lat || null,
      long: location.long || null,
      warehouse: location.warehouse?._id || warehouseId || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (locationId) => {
    if (!locationId) {
      console.error("No location ID provided for deletion");
      return;
    }
    if (window.confirm("Are you sure you want to delete this location?")) {
      try {
        await apiRequest(`location/web/${locationId}`, "DELETE");
        toast.success("Location deleted successfully");
        fetchLocations();
      } catch (error) {
        console.error("Error deleting location:", error);
        toast.error(
          error.response?.data?.message || "Failed to delete location"
        );
      }
    }
  };

  const handleDownloadPdf = async (locationId) => {
    if (!locationId) {
      console.error("No location ID provided for PDF download");
      return;
    }
    try {
      // Create a direct fetch request to handle the blob response
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_API_URL
        }barcode-print/web/locations?id=${locationId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/pdf",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to download PDF");
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `location_barcode_${locationId}.pdf`);
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(error.message || "Failed to download PDF");
    }
  };

  const handleLocationCreated = () => {
    fetchLocations();
  };

  const handlePageChange = (newPage, newLimit) => {
    if (newLimit && newLimit !== pagination.limit) {
      // Handle limit change
      setPagination((prev) => ({
        ...prev,
        page: 1, // Reset to first page when changing limit
        limit: newLimit,
      }));
    } else if (newPage !== pagination.page) {
      // Handle page change
      setPagination((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when filtering
  };

  const handleSort = ({ key, direction }) => {
    setSortConfig({ key, direction });
  };

  const columns = [
    {
      key: "location_name",
      title: "Location Name",
      sortable: true,
      filterable: true,
    },
    {
      key: "barcode_key",
      title: "Barcode",
      sortable: true,
      filterable: true,
    },
    {
      key: "lat",
      title: "Latitude",
      sortable: true,
      filterable: false,
    },
    {
      key: "long",
      title: "Longitude",
      sortable: true,
      filterable: false,
    },
    {
      key: "actions",
      title: "Actions",
      sortable: false,
      render: (_, row) => {
        if (!row) return null;

        return (
          <div className="flex space-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row);
              }}
              className="text-blue-600 hover:text-blue-900"
              title="Edit location"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row._id || row.id);
              }}
              className="text-red-600 hover:text-red-900"
              title="Delete location"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadPdf(row._id || row.id);
              }}
              className="text-green-600 hover:text-green-900"
              title="Download Barcode PDF"
            >
              <FileText className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];
  const [importIsOpen, setImportIsOpen] = useState(false);
  const [importData, setImportData] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  // Handle download barcodes for selected rows
  const handleDownloadBarcodes = async () => {
    if (selectedRows.length < 2) {
      toast.error("Please select at least 2 locations to download barcodes");
      return;
    }

    try {
      // Create a direct fetch request to handle the blob response
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_API_URL
        }barcode-print/web/locations/multiple`,
        {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/pdf',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            locationIds: selectedRows,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to download PDF");
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `location_barcodes.pdf`);
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(error.message || "Failed to download PDF");
    }

    // try {
    //   // Call your API to generate and download the PDF
    //   const response = await apiRequest(
    //     "POST",
    //     "/api/locations/download-barcodes",
    //     {
    //       locationIds: selectedRows,
    //     },
    //     {
    //       responseType: "blob", // Important for file download
    //     }
    //   );

    //   // Create a blob from the response
    //   const url = window.URL.createObjectURL(new Blob([response.data]));
    //   const link = document.createElement("a");
    //   link.href = url;
    //   link.setAttribute(
    //     "download",
    //     `location-barcodes-${new Date().toISOString().split("T")[0]}.pdf`
    //   );
    //   document.body.appendChild(link);
    //   link.click();
    //   link.remove();
    // } catch (error) {
    //   console.error("Error downloading barcodes:", error);
    //   toast.error("Failed to download barcodes");
    // }
  };

  const handleFileUpload = async (file) => {
    try {
      setIsImporting(true);
      const formData = new FormData();
      formData.append("file", file);

      // Get the warehouse ID from the current warehouse context
      const warehouseId = currentWarehouse?._id;
      if (!warehouseId) {
        toast.error("Please select a warehouse first");
        return;
      }

      // Add warehouse ID to the form data
      formData.append("warehouse", warehouseId);

      // Make the API request with proper headers
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/location/import`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to import locations");
      }

      toast.success(data.message || "Locations imported successfully");
      fetchLocations();
      setImportIsOpen(false);
    } catch (error) {
      console.error("Import error:", error);
      toast.error(
        error.message ||
          "Failed to import locations. Please check the file format and try again."
      );
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = ["Location Name", "Latitude", "Longitude"];
    const csvContent = [
      headers.join(","),
      "Location One,28.6139,77.2090",
      "Location Two,19.0760,72.8777",
      "Location Three,12.9716,77.5946",
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

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Location Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {currentWarehouse
                ? `Managing locations for ${currentWarehouse.name}`
                : "Select a warehouse to manage locations"}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={handleDownloadBarcodes}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md 
              text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            <Download className="-ml-1 mr-2 h-5 w-5" />
            Download Barcodes
          </button>
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md
             text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Upload className="-ml-1 mr-2 h-5 w-5" />
            Import
          </button>
          <button
            type="button"
            onClick={handleAddLocation}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium
             text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Location
          </button>
        </div>

        {/* Import Modal */}
        {importIsOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setImportIsOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Import Locations
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Upload a CSV file containing location data. <br />
                        <button
                          type="button"
                          onClick={handleDownloadTemplate}
                          className="text-blue-600 hover:text-blue-500 font-medium"
                        >
                          Download template CSV
                        </button>
                      </p>
                    </div>
                    <div className="mt-6">
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className={`relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 ${
                                isImporting
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {isImporting ? (
                                <span className="flex items-center">
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
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
                                </span>
                              ) : (
                                <span>Upload a file</span>
                              )}
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                accept=".csv"
                                disabled={isImporting}
                                onChange={(e) => {
                                  if (
                                    e.target.files &&
                                    e.target.files.length > 0
                                  ) {
                                    handleFileUpload(e.target.files[0]);
                                    // Reset the input value to allow selecting the same file again
                                    e.target.value = "";
                                  }
                                }}
                              />
                            </label>
                            <p
                              className={`pl-1 ${
                                isImporting ? "opacity-50" : ""
                              }`}
                            >
                              or drag and drop
                            </p>
                          </div>
                          <p
                            className={`text-xs ${
                              isImporting ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {isImporting ? "Processing..." : "CSV up to 10MB"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    onClick={() => setImportIsOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Import CSV Modal */}
      <ImportCSVModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
        warehouseId={currentWarehouse?._id}
      />

      {/* DataTable */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {!currentWarehouse ? (
          <div className="mt-8 text-center">
            <div className="text-gray-500">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No warehouse selected
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Please select a warehouse to view its locations.
              </p>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={locations}
            loading={loading}
            selectable={true}
            onRowSelect={setSelectedRows}
            currentPage={pagination.page}
            itemsPerPage={pagination.limit}
            totalItems={pagination.total}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            onSort={handleSort}
            sortConfig={sortConfig}
            onFilter={handleFilter}
            emptyState={
              <div className="text-center py-12">
                <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No locations found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new location.
                </p>
                <div className="mt-6">
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsImportModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Upload className="-ml-1 mr-2 h-5 w-5" />
                      Import
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="-ml-1 mr-2 h-5 w-5" />
                      Add Location
                    </button>
                  </div>
                </div>
              </div>
            }
          />
        )}
      </div>

      {/* Location Modal */}
      <LocationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLocation(null);
        }}
        onSuccess={handleLocationCreated}
        location={selectedLocation}
        warehouseId={currentWarehouse?._id}
      />
    </div>
  );
};

export default LocationManagement;
