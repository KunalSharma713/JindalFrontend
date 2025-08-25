import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { setSelectedUser } from "../../store/slices/usersSlice";
import DataTable from "../../components/DataTable";
import UserModal from "../../components/UserManagement/UserModal";
import { useApi } from "../../hooks/useApi";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { apiRequest } = useApi();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filters, setFilters] = useState({});

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { page, limit } = pagination;
      const { key, direction } = sortConfig;

      // Get the selected plant ID from localStorage
      const selectedPlantId = localStorage.getItem('selectedPlantId');
      if (!selectedPlantId) {
        throw new Error('No plant selected');
      }

      // Build query params
      const params = new URLSearchParams({
        page,
        limit,
        ...(key && { sortBy: key, sortOrder: direction }),
        ...filters,
        warehouse: selectedPlantId, 
      });

      const response = await apiRequest(`user/?${params}`, "GET");

      if (response && response.data) {
        // Transform data to match DataTable expected format
        const transformedUsers = response.data.map((user) => ({
          ...user,
          name: `${user.first_name} ${user.last_name}`,
          role: user.roleid?.name || "N/A",
        }));

        setUsers(transformedUsers);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, sortConfig, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = () => {
    dispatch(setSelectedUser(null));
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    dispatch(setSelectedUser(user));
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await apiRequest(`user/${userId}`, "DELETE");
        toast.success("User deleted successfully");
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user");
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

  const columns = [
    {
      key: "name",
      title: "Name",
      sortable: true,
      filterable: true,
    },
    {
      key: "email",
      title: "Email",
      sortable: true,
      filterable: true,
    },
    {
      key: "mobile_no",
      title: "Phone",
      sortable: true,
      filterable: true,
    },
    {
      key: "role",
      title: "Role",
      sortable: true,
      filterable: true,
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditUser(row)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Edit"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            User Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage users, roles, and permissions across your platform.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={handleAddUser}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add User
          </button>
        </div>
      </div>

      {/* DataTable */}
      <div className="bg-white rounded-lg shadow">
        <DataTable
          data={users}
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
          emptyMessage="No users found"
        />
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          dispatch(setSelectedUser(null));
          fetchUsers(); // Refresh data after modal closes
        }}
      />
    </div>
  );
};

export default UserManagement;
