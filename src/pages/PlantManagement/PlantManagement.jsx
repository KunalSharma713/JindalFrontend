import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import PlantModal from "../../components/PlantManagement/PlantModal";
import DataTable from "../../components/DataTable";
import { useApi } from "../../hooks/useApi";

const PlantManagement = () => {
  const { apiRequest } = useApi();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [sortConfig, setSortConfig] = useState({
    key: "warehouse_name",
    direction: "asc",
  });
  const [filters, setFilters] = useState({});

  const fetchWarehouses = useCallback(async () => {
    try {
      setLoading(true);
      const { page, limit } = pagination;
      const { key, direction } = sortConfig;

      // Build query params with correct field names
      const params = new URLSearchParams({
        page,
        limit,
        ...(key && { sortBy: key, sortOrder: direction }),
        ...(filters.warehouse_name && {
          warehouse_name: filters.warehouse_name,
        }),
        ...(filters.code && { code: filters.code }),
      });

      const response = await apiRequest(`warehouse?${params}`, "GET");

      if (response && response.data) {
        setWarehouses(response.data);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination?.total || response.data.length,
          totalPages: response.pagination?.totalPages || 1,
        }));
      }
    } catch (error) {
      console.error("Error fetching plants:", error);
      toast.error("Failed to fetch plants");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, sortConfig, filters, apiRequest]);

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  const handleAddWarehouse = () => {
    setSelectedWarehouse(null);
    setIsModalOpen(true);
  };

  const handleEditWarehouse = (warehouse) => {
    console.log("wwwwwwwwww", warehouse);
    // Create a copy of the warehouse object to avoid direct state mutation
    setSelectedWarehouse({
      ...warehouse,
      // Ensure all required fields have proper defaults if they're null/undefined
      warehouse_name: warehouse.warehouse_name || "",
      code: warehouse.code || "",
      lat: warehouse.lat || null,
      long: warehouse.long || null,
    });
    setIsModalOpen(true);
  };

  const handleDeleteWarehouse = async (warehouseId) => {
    if (window.confirm("Are you sure you want to delete this plant?")) {
      try {
        await apiRequest(`warehouse/${warehouseId}`, "DELETE");
        toast.success("Plant deleted successfully");
        // Refresh the list and reset to first page
        setPagination((prev) => ({ ...prev, page: 1 }));
        fetchWarehouses();
      } catch (error) {
        console.error("Error deleting plant:", error);
        toast.error(error.response?.data?.message || "Failed to delete plant");
      }
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleSort = ({ key, direction }) => {
    setSortConfig({ key, direction });
  };

  const handleFilter = (newFilters) => {
    // Map filter names to match the backend field names
    const mappedFilters = {};
    if (newFilters.name) {
      mappedFilters.warehouse_name = newFilters.name;
    }
    if (newFilters.code) {
      mappedFilters.code = newFilters.code;
    }
    setFilters(mappedFilters);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when filtering
  };

  const columns = [
    {
      key: "warehouse_name",
      title: "Plant Name",
      sortable: true,
    },
    {
      key: "code",
      title: "Code",
      sortable: true,
    },
    {
      key: "lat",
      title: "Latitude",
    },
    {
      key: "long",
      title: "Longitude",
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
                handleEditWarehouse(row);
              }}
              className="text-blue-600 hover:text-blue-900"
              title="Edit warehouse"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteWarehouse(row._id);
              }}
              className="text-red-600 hover:text-red-900"
              title="Delete warehouse"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  const handleModalClose = (shouldRefresh = false) => {
    setIsModalOpen(false);
    setSelectedWarehouse(null);
    if (shouldRefresh) {
      fetchWarehouses();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Plant Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage Plants across your platform.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={handleAddWarehouse}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Plant
          </button>
        </div>
      </div>

      {/* Plant Table */}
      <div className="bg-white rounded-lg shadow">
        <DataTable
          data={warehouses}
          columns={columns}
          loading={loading}
          totalItems={pagination.total}
          currentPage={pagination.page}
          itemsPerPage={pagination.limit}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          onSort={handleSort}
          onFilter={handleFilter}
          sortConfig={sortConfig}
          filters={filters}
          emptyMessage="No Plants found"
        />
      </div>

      {/* Plant Modal */}
      <PlantModal
        isOpen={isModalOpen}
        onClose={(shouldRefresh) => {
          setIsModalOpen(false);
          setSelectedWarehouse(null);
          if (shouldRefresh) {
            fetchWarehouses(); // Refresh data after successful operation
          }
        }}
        warehouse={selectedWarehouse}
      />
    </div>
  );
};

export default PlantManagement;
