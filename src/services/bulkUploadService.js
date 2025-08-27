// Bulk upload service factory function that accepts apiRequest
const createBulkUploadService = (apiRequest) => ({
  // Upload location data
  uploadLocations: async (data) => {
    return await apiRequest("bulkupload/location", "POST", data, true);
  },

  // Get all location bulk uploads
  getLocationBulkUploads: async (page = 1, limit = 10, search = "") => {
    return await apiRequest(
      "bulkupload/location/upload",
      "POST",
      { page, limit, search },
      true
    );
  },

  // Get successful records for a bulk upload
  getSuccessRecords: async (bulkId, page = 1, limit = 10) => {
    return await apiRequest(
      "bulkupload/location/success",
      "POST",
      { bulkuploadid: bulkId, page, limit },
      true
    );
  },

  // Get error records for a bulk upload
  getErrorRecords: async (bulkId, page = 1, limit = 10) => {
    return await apiRequest(
      "bulkupload/location/error",
      "POST",
      { bulkuploadid: bulkId, page, limit },
      true
    );
  },

  // Format a date string to readable format
  formatDate: (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  },

  // Get status label and color
  getStatusDisplay: (status) => {
    const statusMap = {
      completed: { text: "Success", color: "green" },
      failed: { text: "Failed", color: "red" },
      processing: { text: "Processing", color: "yellow" },
      pending: { text: "Pending", color: "blue" },
    };
    return (
      statusMap[status?.toLowerCase()] || {
        text: status || "Unknown",
        color: "gray",
      }
    );
  },
});

// Create a default instance that will be initialized later
let defaultInstance = null;

// Create the service instance with methods that will throw if not initialized
const service = {
  uploadLocations: (...args) => {
    if (!defaultInstance)
      throw new Error(
        "bulkUploadService must be initialized with init() first"
      );
    return defaultInstance.uploadLocations(...args);
  },
  getLocationBulkUploads: (...args) => {
    if (!defaultInstance)
      throw new Error(
        "bulkUploadService must be initialized with init() first"
      );
    return defaultInstance.getLocationBulkUploads(...args);
  },
  getSuccessRecords: (...args) => {
    if (!defaultInstance)
      throw new Error(
        "bulkUploadService must be initialized with init() first"
      );
    return defaultInstance.getSuccessRecords(...args);
  },
  getErrorRecords: (...args) => {
    if (!defaultInstance)
      throw new Error(
        "bulkUploadService must be initialized with init() first"
      );
    return defaultInstance.getErrorRecords(...args);
  },
  formatDate: (...args) => {
    if (!defaultInstance)
      throw new Error(
        "bulkUploadService must be initialized with init() first"
      );
    return defaultInstance.formatDate(...args);
  },
  getStatusDisplay: (...args) => {
    if (!defaultInstance)
      throw new Error(
        "bulkUploadService must be initialized with init() first"
      );
    return defaultInstance.getStatusDisplay(...args);
  },
  // Initialize the service with an apiRequest function
  init: (apiRequest) => {
    if (!defaultInstance) {
      defaultInstance = createBulkUploadService(apiRequest);
    }
    return defaultInstance;
  },
};

export default service;
export { createBulkUploadService as bulkUploadService };
