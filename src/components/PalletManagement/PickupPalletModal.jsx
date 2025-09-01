import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { X, Check } from "lucide-react";

export default function PickupPalletModal({
  isOpen,
  onClose,
  selectedPallets = [],
  onSubmit,
}) {
  const [loading, setLoading] = useState(false);
  const [palletQuantities, setPalletQuantities] = useState({});
  const [errors, setErrors] = useState({});

  // Initialize quantities when modal opens or selectedPallets changes
  useEffect(() => {
    if (isOpen && selectedPallets.length > 0) {
      const initialQuantities = {};
      selectedPallets.forEach((pallet) => {
        initialQuantities[pallet.pallet_id] = pallet.quantity || 1;
      });
      setPalletQuantities(initialQuantities);
      setErrors({});
    }
  }, [isOpen, selectedPallets]);

  const handleQuantityChange = (palletId, value) => {
    const quantity = parseInt(value, 10) || 0;
    setPalletQuantities((prev) => ({
      ...prev,
      [palletId]: quantity > 0 ? quantity : 1,
    }));
  };

  const validateQuantities = () => {
    const newErrors = {};
    let isValid = true;

    selectedPallets.forEach((pallet) => {
      const quantity = palletQuantities[pallet.pallet_id];
      const available = pallet.availableQuantity || pallet.quantity;

      if (!quantity || quantity < 1) {
        newErrors[pallet.pallet_id] = "Quantity must be at least 1";
        isValid = false;
      } else if (quantity > available) {
        newErrors[pallet.pallet_id] = "Cannot exceed available quantity";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateQuantities()) return;

    setLoading(true);
    try {
      const palletUpdates = selectedPallets.map((pallet) => ({
        palletId: pallet.pallet_id,
        barcode: pallet.barcode_key,
        quantity: palletQuantities[pallet.pallet_id], // Pickup quantity
        currentQuantity: pallet.quantity, // Available quantity
        location: pallet.location?._id || pallet.location,
        barcode_id: pallet._id,
      }));

      await onSubmit(palletUpdates);
      onClose();
    } catch (error) {
      console.error("Error updating pallets:", error);
      toast.error(error.response?.data?.message || "Failed to update pallets");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setPalletQuantities({});
    setErrors({});
  };

  if (!isOpen || selectedPallets.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">
            Pickup Pallets ({selectedPallets.length} selected)
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              Update quantities for the selected pallets and confirm pickup.
            </p>

            <div className="overflow-y-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Barcode
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Qty
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pickup Qty
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedPallets.map((pallet) => (
                    <tr key={pallet.pallet_id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {pallet.barcode_key}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {pallet.quantity}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="number"
                          min="1"
                          max={pallet.quantity}
                          value={palletQuantities[pallet.pallet_id] || ""}
                          onChange={(e) =>
                            handleQuantityChange(
                              pallet.pallet_id,
                              e.target.value
                            )
                          }
                          className={`w-24 px-2 py-1 border ${
                            errors[pallet.pallet_id]
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500`}
                          disabled={loading}
                        />
                        {errors[pallet.pallet_id] && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors[pallet.pallet_id]}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {pallet?.location_name || pallet.location || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Check className="-ml-1 mr-2 h-4 w-4" />
                  Confirm Pickup
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
