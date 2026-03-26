import React from 'react';
import { useDropzone } from 'react-dropzone';

const CSVImportDropzone = ({ onFileAccepted, fileName }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.length) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed p-4 sm:p-6 rounded-md cursor-pointer text-center transition-all ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-xs sm:text-sm text-gray-500">
        Drag and drop your CSV file here or click to select.
      </p>
      {fileName && <p className="mt-2 font-medium text-xs sm:text-sm truncate">{fileName}</p>}
    </div>
  );
};

export default CSVImportDropzone;
