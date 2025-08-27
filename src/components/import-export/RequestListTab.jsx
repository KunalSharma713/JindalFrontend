import React, { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle, XCircle, Search, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import bulkUploadService from '../../services/bulkUploadService';
import { useApi } from '../../hooks/useApi';

const RequestListTab = ({ warehouseId }) => {
  const { apiRequest } = useApi();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  
  // Track the current tab (all/success/error)
  const [activeTab, setActiveTab] = useState('all');

  // Initialize the service when the component mounts
  useEffect(() => {
    bulkUploadService.init(apiRequest);
  }, [apiRequest]);

  const fetchRequests = useCallback(async () => {
    if (!warehouseId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      // Fetch data based on active tab
      if (activeTab === 'success') {
        response = await bulkUploadService.getSuccessRecords(
          warehouseId,
          pagination.page,
          pagination.limit
        );
      } else if (activeTab === 'error') {
        response = await bulkUploadService.getErrorRecords(
          warehouseId,
          pagination.page,
          pagination.limit
        );
      } else {
        response = await bulkUploadService.getLocationBulkUploads(
          pagination.page,
          pagination.limit,
          searchTerm
        );
      }
      
      if (response) {
        // Handle both array and object responses
        const data = Array.isArray(response) ? response : (response.data || []);
        setRequests(data);
        
        // Update pagination if available
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.pagination.total || data.length,
            totalPages: response.pagination.totalPages || 
              Math.ceil((response.pagination.total || data.length) / pagination.limit)
          }));
        } else if (Array.isArray(response)) {
          // If response is an array, update pagination based on array length
          setPagination(prev => ({
            ...prev,
            total: response.length,
            totalPages: Math.ceil(response.length / pagination.limit)
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching import requests:', err);
      setError(err.message || 'Failed to load import requests');
      toast.error('Failed to load import requests');
    } finally {
      setLoading(false);
    }
  }, [warehouseId, pagination.page, pagination.limit, searchTerm, activeTab]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);
  
  const handleRefresh = () => {
    fetchRequests();
  };
  
  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const getStatusIcon = (status) => {
    if (!status) return null;
    
    const statusMap = {
      'completed': <CheckCircle className="h-4 w-4 text-green-500" />,
      'failed': <XCircle className="h-4 w-4 text-red-500" />,
      'processing': <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />,
      'pending': <Clock className="h-4 w-4 text-blue-500" />
    };
    return statusMap[status.toLowerCase()] || null;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Import Requests</h3>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {['all', 'success', 'error'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-1.5 rounded-full hover:bg-gray-100"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
      </div>
      
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
              <div className="mt-2 text-sm text-red-700">
                <button
                  type="button"
                  onClick={fetchRequests}
                  className="font-medium text-red-700 hover:text-red-600"
                >
                  Try again<span aria-hidden="true"> &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Records
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && requests.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No import requests found
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {req.fileName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(req.status)}
                        <span className={`ml-2 text-sm capitalize ${
                          req.status === 'completed' ? 'text-green-600' :
                          req.status === 'failed' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {bulkUploadService.getStatusDisplay(req.status).text}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {req.total_records || '0'}
                      {req.total_success !== undefined && (
                        <span className="text-green-600 ml-2">
                          ({req.total_success} success, {req.total_error || 0} errors)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bulkUploadService.formatDate(req.created_at || req.updated_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                disabled={pagination.page === 1 || loading}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                disabled={pagination.page === pagination.totalPages || loading}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.page === 1 || loading}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">First</span>
                    &laquo;
                  </button>
                  <button
                    onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                    disabled={pagination.page === 1 || loading}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    &lsaquo;
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pagination.page === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                    disabled={pagination.page === pagination.totalPages || loading}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    &rsaquo;
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={pagination.page === pagination.totalPages || loading}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Last</span>
                    &raquo;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestListTab;
