import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import {
  addUser,
  updateUser,
  clearSelectedUser,
} from "../../store/slices/usersSlice";
import { useApi } from "../../hooks/useApi";

const schema = yup.object({
  location_name: yup.string().required("Location name is required"),
  barcode_key: yup.string().optional(),
  lat: yup.number().nullable().typeError("Latitude must be a number"),
  long: yup.number().nullable().typeError("Longitude must be a number"),
  warehouse: yup.string().required("Warehouse is required"),
});

const LocationModal = ({
  isOpen,
  onClose,
  onSuccess,
  location: selectedLocation,
  warehouseId,
}) => {
  const { apiRequest, loading } = useApi();
  const isEditing = !!selectedLocation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      location_name: "",
      barcode_key: "",
      lat: null,
      long: null,
      warehouse: warehouseId || "",
    },
  });

  useEffect(() => {
    if (selectedLocation) {
      reset({
        location_name: selectedLocation.location_name || "",
        barcode_key: selectedLocation.barcode_key || "",
        lat: selectedLocation.lat !== undefined ? selectedLocation.lat : "",
        long: selectedLocation.long !== undefined ? selectedLocation.long : "",
        warehouse: selectedLocation.warehouse || warehouseId || "",
      });
    } else {
      reset({
        location_name: "",
        barcode_key: "",
        lat: "",
        long: "",
        warehouse: warehouseId || "",
      });
    }
  }, [selectedLocation, warehouseId, reset]);

  const onSubmit = async (formData) => {
    try {
      const payload = {
        location_name: formData.location_name,
        barcode_key: formData.barcode_key || "",
        lat: formData.lat ? parseFloat(formData.lat) : null,
        long: formData.long ? parseFloat(formData.long) : null,
        warehouse: formData.warehouse || warehouseId,
      };

      if (isEditing) {
        const response = await apiRequest(
          `location/web/${selectedLocation._id}`,
          "PUT",
          payload,
          true
        );
        toast.success("Location updated successfully!");
      } else {
        const response = await apiRequest(
          "location/web/",
          "POST",
          payload,
          true
        );
        toast.success("Location added successfully!");
      }

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error(error.response?.data?.message || "Failed to save location");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? "Edit Location" : "Add New Location"}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Name *
                  </label>
                  <input
                    type="text"
                    {...register("location_name")}
                    className={`input-field w-full ${
                      errors.location_name ? "border-red-300" : ""
                    }`}
                    placeholder="Enter location name"
                  />
                  {errors.location_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.location_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Barcode (Auto-generated)
                  </label>
                  <input
                    type="text"
                    {...register("barcode_key")}
                    className="input-field w-full bg-gray-100 text-gray-700 font-semibold border border-gray-400 cursor-not-allowed"
                    placeholder="Auto-generated"
                    disabled
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      {...register("lat")}
                      className={`input-field w-full ${
                        errors.lat ? "border-red-300" : ""
                      }`}
                      placeholder="e.g. 28.6139"
                    />
                    {errors.lat && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lat.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      {...register("long")}
                      className={`input-field w-full ${
                        errors.long ? "border-red-300" : ""
                      }`}
                      placeholder="e.g. 77.2090"
                    />
                    {errors.long && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.long.message}
                      </p>
                    )}
                  </div>
                </div>

                {!warehouseId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Warehouse *
                    </label>
                    <select
                      {...register("warehouse")}
                      className={`input-field w-full ${
                        errors.warehouse ? "border-red-300" : ""
                      }`}
                      disabled={!!warehouseId}
                    >
                      <option value="">Select Warehouse</option>
                      {/* You can map through warehouses here if needed */}
                    </select>
                    {errors.warehouse && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.warehouse.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading
                    ? "Saving..."
                    : isEditing
                    ? "Update Location"
                    : "Add Location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
