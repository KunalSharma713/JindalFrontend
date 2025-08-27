import React, { useCallback, useState } from 'react';
import { Upload as UploadIcon, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useApi } from '../../hooks/useApi';

export default function UploadedTab({ 
  fileName, 
  onFileRemove, 
  onFileUpload, 
  isImporting,
  onDownloadTemplate,
  onImport,
  isValid
}) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const { apiRequest } = useApi();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      const rejectionReasons = rejectedFiles[0].errors.map(err => {
        if (err.code === 'file-too-large') return 'File is too large (max 5MB)';
        if (err.code === 'file-invalid-type') return 'Invalid file type';
        return err.message;
      });
      setError(rejectionReasons[0] || 'Please upload a valid CSV file (max size: 5MB)');
      return;
    }
    
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setError('Please upload a valid CSV file');
        return;
      }
      setError(null);
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    disabled: isImporting
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setError('Please upload a valid CSV file');
        return;
      }
      setError(null);
      onFileUpload(file);
    }
  };
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">Upload File</h3>
        <p className="mt-1 text-sm text-gray-500">
          Upload a CSV file containing location data. 
          <button 
            type="button"
            onClick={onDownloadTemplate}
            className="ml-1 text-blue-600 hover:text-blue-500 font-medium"
          >
            Download template CSV
          </button>
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}
      <div className="mt-6">
        {fileName ? (
          <div className="p-4 border-2 border-dashed border-green-500 rounded-lg bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">{fileName}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onFileRemove}
                  className="text-gray-400 hover:text-gray-500"
                  disabled={isImporting}
                >
                  Remove File
                </button>
                <button
                  type="button"
                  onClick={onImport}
                  disabled={!isValid || isImporting}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    isValid && !isImporting 
                      ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' 
                      : 'bg-blue-400 cursor-not-allowed'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  {isImporting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Importing...
                    </>
                  ) : (
                    'Import File'
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div 
            {...getRootProps()}
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            } transition-colors duration-200`}
          >
            <div className="space-y-1 text-center">
              <UploadIcon className={`mx-auto h-12 w-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className={`relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 ${
                    isImporting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span>Upload a file</span>
                  <input
                    {...getInputProps()}
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".csv,text/csv"
                    disabled={isImporting}
                    onChange={handleFileChange}
                  />
                </label>
                <p className={`pl-1 ${isImporting ? 'opacity-50' : ''}`}>or drag and drop</p>
              </div>
              <p className={`text-xs ${isImporting ? 'text-gray-400' : 'text-gray-500'}`}>
                {isImporting ? 'Processing...' : 'CSV up to 10MB'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-900">Requirements:</h4>
        <ul className="mt-2 space-y-2 text-sm text-gray-500">
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <span>File must be in CSV format</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <span>Required fields: Location Name, Latitude, Longitude</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <span>Maximum file size: 10MB</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
