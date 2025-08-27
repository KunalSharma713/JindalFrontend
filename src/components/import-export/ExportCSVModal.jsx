import React, { useEffect, useState } from "react";
// Export Modal
const ExportCSVModal = ({
  isOpen,
  closeModal,
  fetchExportData,
  masterName = "default",
  header = "Export Records",
}) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [statusText, setStatusText] = useState(
    "Generating CSV file from records..."
  );

  useEffect(() => {
    if (isOpen) {
      exportData();
    }
  }, [isOpen]);

  const getTimestampFileName = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");

    const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
      now.getDate()
    )}`;
    const timePart = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(
      now.getSeconds()
    )}`;

    return `${masterName}-${datePart}-${timePart}.csv`;
  };

  const exportData = async () => {
    setIsGenerating(true);
    try {
      const fileBlob = await fetchExportData(); // Only blob returned now
      const fileName = getTimestampFileName();

      setStatusText("Preparing your file for download...");
      console.log(fileBlob);
      const url = window.URL.createObjectURL(fileBlob?.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (err) {
      console.error("Export failed:", err);
      setStatusText("Failed to export. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md">
      <div className="relative w-full p-4 overflow-y-auto  no-scrollbar rounded-3xl  lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {header}
          </h4>
        </div>
        <form className="flex flex-col">
          <div className="px-2 overflow-y-auto custom-scrollbar max-h-[55vh]">
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              {statusText}
            </p>
          </div>
          {isGenerating && (
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          )}
        </form>
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <button
            size="sm"
            variant="outline"
            onClick={() => {
              // resetModal();
              closeModal();
            }}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportCSVModal;
