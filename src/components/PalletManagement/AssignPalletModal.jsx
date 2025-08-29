import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";

export default function AssignPalletModal({
  isOpen,
  onClose,
  barcode,
  onAssign,
  locations,
  pallet,
}) {
  const [formData, setFormData] = useState({
    location: pallet?.location || "",
    size: pallet?.size || "",
    quantity: pallet?.quantity || 1,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when pallet changes or modal opens/closes
  useEffect(() => {
    const initialData = {
      location: isOpen ? pallet?.location || "" : "",
      size: isOpen ? pallet?.size || "" : "",
      quantity: isOpen ? pallet?.quantity || 1 : 1,
    };

    console.log("Setting form data:", initialData);
    setFormData(initialData);
    setErrors({});
  }, [isOpen, pallet]); // Reset when either isOpen or pallet changes

  const Reset = () => {
    setFormData({
      location: "",
      size: "",
      quantity: 1,
    });
    setErrors({});
  };
  const validate = () => {
    const newErrors = {};
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.size) newErrors.size = "Size is required";
    if (!formData.quantity || formData.quantity < 1)
      newErrors.quantity = "Quantity must be at least 1";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = { ...formData };

      // Only include barcode info if we're in assign mode (not edit mode)
      if (barcode && !pallet) {
        data.barcodeId = barcode._id;
        data.barcode_key = barcode.barcode_key;
      }

      await onAssign(data);
      onClose();
      Reset();
    } catch (error) {
      console.error("Error processing pallet:", error);
      toast.error(error.response?.data?.message || "Failed to process pallet");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">
            {" "}
            {pallet ? "Update" : "Assign"} Pallet
          </h3>
          <button
            onClick={() => {
              onClose();
              Reset();
            }}
            className="text-gray-400 hover:text-gray-500"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {barcode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Barcode
              </label>
              <input
                type="text"
                value={barcode.barcode_key}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-gray-100"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location <span className="text-red-500">*</span>
            </label>
            <select
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className={`w-full px-3 py-2 border ${
                errors.location ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
              disabled={loading}
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.location_name} ({loc.barcode_key})
                </option>
              ))}
            </select>
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="size"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Size <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="size"
              value={formData.size}
              onChange={(e) =>
                setFormData({ ...formData, size: e.target.value })
              }
              className={`w-full px-3 py-2 border ${
                errors.size ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
              disabled={loading}
              placeholder="e.g., 48x36"
            />
            {errors.size && (
              <p className="mt-1 text-sm text-red-600">{errors.size}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: parseInt(e.target.value) || 1,
                })
              }
              className={`w-full px-3 py-2 border ${
                errors.quantity ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
              disabled={loading}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                Reset();
              }}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Saving..."
                : pallet
                ? "Update Pallet"
                : "Assign Pallet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
