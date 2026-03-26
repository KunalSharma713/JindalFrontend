import React, { useCallback, useState } from 'react';
import { Upload as UploadIcon, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export default function UploadedTab({ 
  fileName, 
  onFileRemove, 
  onFileUpload, 
  isImporting,
  onDownloadTemplate
}) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

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
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h3 className="text-base sm:text-lg font-medium text-gray-900">Upload File</h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
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
        <div className="rounded-md bg-red-50 p-3 sm:p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-xs sm:text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 sm:mt-6">
        {fileName ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-3 sm:px-4 py-4 sm:py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">File Details</h3>
              <p className="mt-1 max-w-2xl text-xs sm:text-sm text-gray-500">Details about the uploaded file</p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-3 sm:px-4 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">File name</dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2" />
                    {fileName}
                  </dd>
                </div>
                <div className="bg-white px-3 sm:px-4 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">File type</dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">CSV</dd>
                </div>
                <div className="bg-gray-50 px-3 sm:px-4 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-xs sm:text-sm text-green-600 sm:mt-0 sm:col-span-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Ready to import
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="bg-gray-50 px-3 sm:px-4 py-3 sm:py-3 sm:px-6 flex justify-end space-x-2 sm:space-x-3">
              <button
                type="button"
                onClick={onFileRemove}
                className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 shadow-sm text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isImporting}
              >
                <X className="-ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                Remove File
              </button>
            </div>
          </div>
        ) : (
          <div 
            {...getRootProps()}
            className={`mt-1 flex justify-center px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 border-2 border-dashed rounded-md ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            } transition-colors duration-200`}
          >
            <div className="space-y-1 text-center">
              <UploadIcon className={`mx-auto h-10 w-10 sm:h-12 sm:w-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
              <div className="flex text-xs sm:text-sm text-gray-600">
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
    </div>
  );
}
