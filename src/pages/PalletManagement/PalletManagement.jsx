import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Edit3,
  FileText,
  MapPin,
  PackagePlus,
  Trash2,
  Download,
  Upload,
} from "lucide-react";
import { toast } from "react-hot-toast";
import DataTable from "../../components/DataTable";
import AssignPalletModal from "../../components/PalletManagement/AssignPalletModal";
import PickupPalletModal from "../../components/PalletManagement/PickupPalletModal";
import { useApi } from "../../hooks/useApi";

const PalletManagement = () => {
  const dispatch = useDispatch();
  const { apiRequest } = useApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);

  const [barcodesAndPallets, setBarcodesAndPallets] = useState([]);
  const [selectedBarcode, setSelectedBarcode] = useState(null);
  const [selectedPallet, setSelectedPallet] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [sortConfig, setSortConfig] = useState({
    key: "barcode_key",
    direction: "asc",
  });
  const [filters, setFilters] = useState({});
  const [currentWarehouse, setCurrentWarehouse] = useState(() => {
    const warehouseId = localStorage.getItem("selectedPlantId");
    const warehouseName = localStorage.getItem("selectedPlantName");
    return warehouseId ? { _id: warehouseId, name: warehouseName } : null;
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      const warehouseId = localStorage.getItem("selectedPlantId");
      const response = await apiRequest(
        `location/web?warehouse=${warehouseId}`,
        "GET"
      );
      if (response && response.data) {
        setLocations(response.data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Failed to fetch locations");
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  const fetchBarcodesAndPallets = useCallback(async () => {
    try {
      setLoading(true);
      const { page, limit } = pagination;
      const { key, direction } = sortConfig;
      const warehouseId = localStorage.getItem("selectedPlantId");

      if (!warehouseId) {
        setBarcodesAndPallets([]);
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

      const response = await apiRequest(`pallet/web/all?${params}`, "GET");

      if (response && response.data) {
        // Transform data to match DataTable expected format
        const transformedData = response.data.map((item) => {
          const pallet = item.pallet || {};
          return {
            ...item,
            id: item._id,
            // Map pallet fields
            pallet_id: pallet?._id,
            sequenceNumber: pallet?.sequenceNumber,
            sequence: pallet?.sequence,
            size: pallet?.size,
            last_moved_date: pallet?.last_moved_date,
            quantity: pallet?.quantity,
            // Map location name from nested object
            location_name: pallet?.location?.location_name ?? "",
            location: pallet?.location?._id ?? null,
            // Keep barcode and status at root level
            barcode_key: item.barcode_key,
            status: item.status ?? "",
          };
        });

        setBarcodesAndPallets(transformedData);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination?.total || response.data.length,
          totalPages: response.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error("Error fetching Barcodes And Pallets:", error);
      toast.error("Failed to fetch Barcodes And Pallets");
    } finally {
      setLoading(false);
    }
  }, [
    apiRequest,
    pagination.page,
    pagination.limit,
    sortConfig,
    filters,
    currentWarehouse,
  ]);

  // Fetch both locations and barcodes on mount and when warehouse changes
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchLocations(), fetchBarcodesAndPallets()]);
    };

    if (currentWarehouse?._id) {
      fetchData();
    }
  }, [currentWarehouse, fetchLocations, fetchBarcodesAndPallets]);

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

  const handleGenerateBarcode = async () => {
    if (!currentWarehouse?._id) {
      toast.error("Please select a warehouse first");
      return;
    }

    try {
      setIsGenerating(true);
      const response = await apiRequest(
        `pallet-barcode/web/generate?count=1`, // Generate one barcode at a time
        "POST",
        { warehouseId: currentWarehouse._id }, // Include warehouse ID in the request body
        true // authRequired
      );

      if (response && response.message) {
        toast.success(response.message);
        // Refresh the barcodesAndPallets list to show the new barcode
        fetchBarcodesAndPallets();
        fetchLocations();
      } else {
        throw new Error(response?.message || "Failed to generate barcode");
      }
    } catch (error) {
      console.error("Error generating barcode:", error);
      toast.error(
        error.response?.data?.message || "Failed to generate barcode"
      );
    } finally {
      setIsGenerating(false);
    }
  };
  const handleDownloadPdf = async (locationId) => {
    if (!locationId) {
      console.error("No pallet ID provided for PDF download");
      return;
    }
    try {
      // Create a direct fetch request to handle the blob response
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_API_URL
        }barcode-print/web/pallets?id=${locationId}`,
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
      link.setAttribute("download", `pallet_barcode_${locationId}.pdf`);
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

  const handleDownloadBarcodes = async () => {
    if (selectedRows.length < 2) {
      toast.error("Please select at least 2 barcodes to download");
      return;
    }

    try {
      // Create a direct fetch request to handle the blob response
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_API_URL
        }barcode-print/web/pallets/multiple`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/pdf",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            barcodeIds: selectedRows,
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
      link.setAttribute("download", `pallet_barcodes.pdf`);
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

  const OpenPickupPalletsModal = async () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one Pallet barcode");
      return;
    }

    // Check if all selected rows have a valid quantity
    const hasInvalidQuantity = selectedRows.some(
      (row) => !row.quantity || row.quantity <= 0
    );

    if (hasInvalidQuantity) {
      toast.error("Cannot pick up pallets with missing or invalid quantity");
      return;
    }

    setIsPickupModalOpen(true);
  };

  const handlePickupPallets = async (rows) => {
    try {
      await apiRequest(`pallet/web/pickup`, 'POST', {
        pallets: rows,
      });
      toast.success("Pallets Picked Up successfully");
      fetchBarcodesAndPallets();
    } catch (error) {
      console.error("Error Picking Pallets:", error);
      toast.error(error.message || "Failed to Pickup Pallets");
    }
  };

  const handleAssign = (barcode) => {
    setSelectedBarcode(barcode);
    setSelectedPallet(null);
    setIsAssignModalOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedBarcode(row);
    setSelectedPallet({
      pallet_id: row.pallet_id,
      _id: row._id,
      location: row.location?._id || row.location,
      size: row.size,
      quantity: row.quantity,
    });
    setIsAssignModalOpen(true);
  };

  const closeAssignModal = () => {
    setIsAssignModalOpen(false);
    // Small delay to allow modal to close before resetting state
    setTimeout(() => {
      setSelectedPallet(null);
      setSelectedBarcode(null);
    }, 300);
  };

  const closePickupModal = () => {
    setIsPickupModalOpen(false);
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

  const handlePalletAssigned = async (data) => {
    try {
      let response;

      if (selectedPallet?._id) {
        // Update existing pallet
        response = await apiRequest(
          `pallet/web/${selectedPallet.pallet_id}`,
          "PUT",
          {
            ...data,
            _id: selectedPallet.pallet_id, // Ensure ID is included in the update
          }
        );
        toast.success("Pallet updated successfully");
      } else if (selectedBarcode) {
        // Assign new pallet
        response = await apiRequest("pallet/web/assign", "POST", {
          ...data,
          barcode_key: selectedBarcode.barcode_key,
          barcodeId: selectedBarcode._id,
        });
        toast.success("Pallet assigned successfully");
      } else {
        throw new Error("No pallet or barcode selected");
      }

      if (response) {
        fetchBarcodesAndPallets();
        return true;
      }
    } catch (error) {
      console.error("Error processing pallet:", error);
      toast.error(error.response?.data?.message || "Error processing pallet");
      throw error;
    }
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
      key: "barcode_key",
      title: "Barcode",
      sortable: true,
      filterable: true,
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      filterable: true,
      render: (status) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            status === "assigned"
              ? "bg-green-100 text-green-800"
              : status === "new"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {status ? status.toUpperCase() : ""}
        </span>
      ),
    },
    {
      key: "sequenceNumber",
      title: "Sequence Number",
      sortable: true,
      filterable: true,
    },
    {
      key: "sequence",
      title: "Sequence",
      sortable: true,
      filterable: true,
    },
    {
      key: "size",
      title: "Size",
      sortable: true,
      filterable: false,
    },
    {
      key: "last_moved_date",
      title: "Last Moved",
      sortable: true,
      filterable: false,
      render: (date) => (date ? new Date(date).toLocaleDateString() : ""),
    },
    {
      key: "quantity",
      title: "Quantity",
      sortable: true,
      filterable: true,
      render: (qty) => qty?.toLocaleString() || "0",
    },
    {
      key: "location_name",
      title: "Location",
      sortable: true,
      filterable: false,
    },
    {
      key: "actions",
      title: "Actions",
      sortable: false,
      render: (_, row) => (
        <div className="flex space-x-2">
          {!row.pallet ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAssign(row);
              }}
              className="text-green-600 hover:text-green-900"
              title="Assign pallet"
            >
              <PackagePlus className="h-4 w-4" />
            </button>
          ) : (
            row.status !== "used" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(row);
                }}
                className="text-blue-600 hover:text-blue-900"
                title="Edit pallet"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            )
          )}
          {row.status !== "used" && (
            <>
              {" "}
              {/* <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(row._id || row.id);
                }}
                className="text-red-600 hover:text-red-900"
                title="Delete pallet"
              >
                <Trash2 className="h-4 w-4" />
              </button> */}
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
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-7 text-gray-900 sm:truncate">
              Pallet Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {currentWarehouse
                ? `Managing pallets for ${currentWarehouse.name}`
                : "Select a warehouse to manage barcodesAndPallets"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={OpenPickupPalletsModal}
            className={`inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 shadow-sm text-xs sm:text-sm font-medium rounded-md 
              text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            <Upload className="-ml-1 mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Pickup Pallets</span>
            <span className="sm:hidden">Pickup</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadBarcodes}
            className={`inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 shadow-sm text-xs sm:text-sm font-medium rounded-md 
              text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            <Download className="-ml-1 mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Download Barcodes</span>
            <span className="sm:hidden">Download</span>
          </button>
          <button
            type="button"
            onClick={handleGenerateBarcode}
            disabled={isGenerating}
            className={`inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white ${
              isGenerating
                ? "bg-primary-400"
                : "bg-primary-600 hover:bg-primary-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-1 sm:mr-2 h-4 w-4 text-white"
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
                Generating...
              </>
            ) : (
              <>Generate Barcode</>
            )}
          </button>
        </div>
      </div>

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
                Please select a warehouse to view its palletss.
              </p>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={barcodesAndPallets}
            loading={loading}
            selectable={true}
            rowSelect={(row) => row.status !== "used"}
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
              <div className="text-center">
                <>
                  <MapPin className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No pallets found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new pallet.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Plus className="-ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                      New Pallet
                    </button>
                  </div>
                </>
              </div>
            }
          />
        )}
      </div>

      {/* Pallet Modal */}
      <AssignPalletModal
        key={selectedPallet?._id || "new"}
        isOpen={isAssignModalOpen}
        onClose={closeAssignModal}
        barcode={selectedBarcode}
        pallet={selectedPallet}
        onAssign={handlePalletAssigned}
        locations={locations}
      />

      {/* Pallet Modal */}
      <PickupPalletModal
        isOpen={isPickupModalOpen}
        onClose={closePickupModal}
        selectedPallets={selectedRows}
        onSubmit={handlePickupPallets}
      />
    </div>
  );
};

export default PalletManagement;
