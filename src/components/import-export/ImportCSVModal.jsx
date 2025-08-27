import React, { useState, useCallback, useEffect } from "react";
import { X, Upload, List, FileText } from "lucide-react";
import UploadedTab from "./UploadedTab";
import RequestListTab from "./RequestListTab";
import { toast } from 'react-hot-toast';
import { bulkUploadService } from '../../services/bulkUploadService';

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

  // Reset validation when file changes
  useEffect(() => {
    if (file) {
      validateFile(file);
    } else {
      setIsValid(false);
      setValidationErrors([]);
    }
  }, [file]);

  const validateFile = (file) => {
    if (file) {
      setIsValid(true);
      setValidationErrors([]);
    } else {
      setIsValid(false);
      setValidationErrors(['Please upload a valid CSV file']);
    }
  };

  const handleFileUpload = useCallback((file) => {
    if (!file) return;
    setFile(file);
    setFileName(file.name);
    setActiveTab("uploaded");
  }, []);

  const handleFileRemove = () => {
    setFile(null);
    setFileName("");
    setActiveTab("upload");
  };

  const handleImport = async () => {
    if (!file || !warehouseId) {
      toast.error('Please select a file and make sure a warehouse is selected');
      return;
    }
    
    if (!isValid) {
      toast.error('Please fix validation errors before importing');
      return;
    }
    
    setIsImporting(true);
    
    try {
      const response = await bulkUploadService.uploadLocations(file, warehouseId);
      setFile(null);
      setFileName("");
      toast.success('Locations imported successfully');
      onImportSuccess?.();
      setActiveTab('requests');
    } catch (error) {
      console.error('Import error:', error);
      toast.error(error.message || 'Failed to import locations');
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = ['Location Name', 'Latitude', 'Longitude', 'Barcode Key'];
    const csvContent = [
      headers.join(','),
      'Location 1,28.6139,77.2090,BC001',
      'Location 2,28.6139,77.2090,BC002',
      'Location 3,28.6139,77.2090,BC003'
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'location_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
      case 'uploaded':
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
      case 'requests':
        return <RequestListTab warehouseId={warehouseId} />;
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

        <div className="inline-block w-full max-w-4xl transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle">
          <div className="px-6 pt-5 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Import {type === "location" ? "Locations" : "Items"} from CSV
              </h3>
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mt-4">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`${
                    activeTab === 'upload'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  <div className="flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </div>
                </button>
                
                {file && (
                  <button
                    onClick={() => setActiveTab('uploaded')}
                    className={`${
                      activeTab === 'uploaded'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      File Details
                    </div>
                  </button>
                )}
                
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`${
                    activeTab === 'requests'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  <div className="flex items-center">
                    <List className="h-4 w-4 mr-2" />
                    Import History
                  </div>
                </button>
              </nav>
            </div>
          </div>

          <div className="px-6 pb-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportCSVModal;
