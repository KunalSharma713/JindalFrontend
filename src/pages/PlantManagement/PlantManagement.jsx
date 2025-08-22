import React, { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import PlantTable from "../../components/PlantManagement/PlantTable";
import PlantModal from "../../components/PlantManagement/PlantModal";
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

      // Build query params
      const params = new URLSearchParams({
        page,
        limit,
        ...(key && { sortBy: key, sortOrder: direction }),
        ...(filters.warehouse_name && { name: filters.warehouse_name }),
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
    setSelectedWarehouse(warehouse);
    setIsModalOpen(true);
  };

  const handleDeleteWarehouse = async (warehouseId) => {
    if (window.confirm("Are you sure you want to delete this plant?")) {
      try {
        await apiRequest(`warehouse/${warehouseId}`, "DELETE");
        toast.success("Plant deleted successfully");
        fetchWarehouses(); // Refresh the list
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
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when filtering
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
        <PlantTable
          warehouses={warehouses}
          loading={loading}
          onEditWarehouse={handleEditWarehouse}
          onDeleteWarehouse={handleDeleteWarehouse}
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      </div>

      {/* Plant Modal */}
      <PlantModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedWarehouse(null);
          fetchWarehouses(); // Refresh data after modal closes
        }}
        warehouse={selectedWarehouse}
      />
    </div>
  );
};

export default PlantManagement;
