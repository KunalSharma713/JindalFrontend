import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { useApi } from "../../hooks/useApi";

const schema = yup.object({
  warehouse_name: yup.string().required("Plant name is required"),
  lat: yup.number().typeError("Latitude must be a number").nullable(),
  long: yup.number().typeError("Longitude must be a number").nullable(),
  code: yup.string().required("Code is required"),
});

const PlantModal = ({ isOpen, onClose, warehouse }) => {
  const { apiRequest, loading } = useApi();
  const isEditing = !!warehouse?._id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      warehouse_name: "",
      lat: null,
      long: null,
      code: "",
    },
  });

  useEffect(() => {
    if (warehouse && Object.keys(warehouse).length > 0) {
      console.log('Initializing form with warehouse data:', warehouse);
      reset({
        warehouse_name: warehouse.warehouse_name || "",
        code: warehouse.code || "",
        lat: warehouse.lat !== undefined ? warehouse.lat : "",
        long: warehouse.long !== undefined ? warehouse.long : "",
      });
    } else {
      console.log('Initializing empty form');
      reset({
        warehouse_name: "",
        code: "",
        lat: "",
        long: "",
      });
    }
  }, [warehouse, reset]);

  const onSubmit = async (formData) => {
    try {
      if (isEditing) {
        // For update, include the _id in the URL and send all fields
        const response = await apiRequest(
          `warehouse/web/${warehouse._id}`, 
          "PUT", 
          {
            warehouse_name: formData.warehouse_name,
            code: formData.code,
            lat: formData.lat || null,
            long: formData.long || null
          },
          true
        );
        toast.success("Plant updated successfully!");
      } else {
        // For create
        const response = await apiRequest(
          "warehouse/web", 
          "POST", 
          {
            warehouse_name: formData.warehouse_name,
            code: formData.code,
            lat: formData.lat || null,
            long: formData.long || null
          },
          true
        );
        toast.success("Plant created successfully!");
      }
      onClose(true); // Pass true to indicate successful operation
    } catch (error) {
      console.error("Error saving plant:", error);
      toast.error(error.response?.data?.message || "Failed to save plant");
    }
  };

  const handleClose = () => {
    reset();
    onClose(false); // Pass false to indicate no refresh needed (cancel action)
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
                {isEditing ? "Update Plant" : "Add New Plant"}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plant Name
                </label>
                <input
                  type="text"
                  {...register("warehouse_name")}
                  className={`w-full px-3 py-2 border ${
                    errors.warehouse_name ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="Enter plant name"
                />
                {errors.warehouse_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.warehouse_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code
                </label>
                <input
                  type="text"
                  {...register("code")}
                  className={`w-full px-3 py-2 border ${
                    errors.code ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="Enter code"
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.code.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    {...register("lat")}
                    className={`w-full px-3 py-2 border ${
                      errors.lat ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    placeholder="Enter latitude (optional)"
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
                    step="0.000001"
                    {...register("long")}
                    className={`w-full px-3 py-2 border ${
                      errors.long ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    placeholder="Enter longitude (optional)"
                  />
                  {errors.long && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.long.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : isEditing
                    ? "Update Plant"
                    : "Add Plant"}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantModal;
