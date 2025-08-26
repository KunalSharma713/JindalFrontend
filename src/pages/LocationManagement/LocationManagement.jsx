import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Edit3, Trash2, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";
import DataTable from "../../components/DataTable";
import LocationModal from "../../components/LocationManagement/LocationModal";
import { useApi } from "../../hooks/useApi";

const LocationManagement = () => {
  const dispatch = useDispatch();
  const { apiRequest } = useApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
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

      const response = await apiRequest(`location/?${params}`, "GET");

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
        await apiRequest(`location/${locationId}`, "DELETE");
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
      render: (_, row) => {
        if (!row) return null;

        return (
          <div className="flex space-x-2">
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
          </div>
        );
      },
    },
  ];

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
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={handleAddLocation}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Location
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
                Please select a warehouse to view its locations.
              </p>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={locations}
            loading={loading}
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
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    New Location
                  </button>
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
