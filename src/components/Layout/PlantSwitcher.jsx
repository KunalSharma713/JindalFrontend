import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, Check, Factory } from "lucide-react";
import { setSelectedPlant } from "../../store/slices/plantSlice";
import { toast } from "react-hot-toast";
import { useApi } from "../../hooks/useApi";

const PlantSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const selectedPlant = useSelector((state) => state.plant.selectedPlant);
  const dispatch = useDispatch();
  const { apiRequest } = useApi();
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await apiRequest("warehouse", "GET");
        const warehouses = Array.isArray(response?.data) ? response.data : [];
        setPlants(warehouses);

        // Safely get and parse the selected plant from localStorage
        let savedPlant = null;
        try {
          const savedPlantStr = localStorage.getItem("selectedPlant");
          if (savedPlantStr) {
            savedPlant = JSON.parse(savedPlantStr);
            // Validate the parsed plant object
            if (
              !savedPlant ||
              typeof savedPlant !== "object" ||
              !savedPlant._id
            ) {
              throw new Error("Invalid plant data in localStorage");
            }
            // Verify the plant exists in the fetched list
            if (!warehouses.some((p) => p._id === savedPlant._id)) {
              console.log(
                "Saved plant not found in warehouse list, clearing selection"
              );
              savedPlant = null;
              // Clean up invalid data
              localStorage.removeItem("selectedPlant");
              localStorage.removeItem("selectedPlantId");
              localStorage.removeItem("selectedPlantName");
            }
          }
        } catch (e) {
          console.error("Error processing saved plant:", e);
          // Clean up any corrupted data
          localStorage.removeItem("selectedPlant");
          localStorage.removeItem("selectedPlantId");
          localStorage.removeItem("selectedPlantName");
          savedPlant = null;
        }

        // If no valid saved plant, select the first one if available
        if (!savedPlant && warehouses.length > 0) {
          console.log("No valid saved plant, selecting first available");
          handleSelectPlant(warehouses[0], false);
        } else if (savedPlant) {
          console.log("Using saved plant from localStorage");
          dispatch(setSelectedPlant(savedPlant));
        }
      } catch (err) {
        console.error("Error fetching warehouses:", err);
        toast.error("Failed to load plants");
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  const handleSelectPlant = async (plant, shouldReload = true) => {
    if (!plant || !plant._id) {
      console.error("Invalid plant data provided");
      toast.error("Invalid plant data");
      return;
    }

    try {
      // Prepare plant data
      const plantData = {
        _id: plant._id,
        name: plant.name || "",
        warehouse_name: plant.warehouse_name || "",
        code: plant.code || "",
      };

      // Create a plain action object
      const action = {
        type: "plant/setSelectedPlant",
        payload: plantData,
      };

      // Dispatch the plain action object
      dispatch(action);

      // Save to localStorage
      localStorage.setItem("selectedPlant", JSON.stringify(plantData));
      localStorage.setItem("selectedPlantId", plantData._id);
      localStorage.setItem(
        "selectedPlantName",
        plantData.warehouse_name || plantData.name || ""
      );

      // Dispatch storage event to notify other components
      window.dispatchEvent(new Event("storage"));

      // Close the dropdown
      setIsOpen(false);

      if (shouldReload) {
        const toastId = toast.loading("Switching plant...");
        // Small delay to ensure state is updated before reload
        setTimeout(() => {
          toast.dismiss(toastId);
          // Force a full page reload to ensure all components pick up the new plant
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      console.error("Error selecting plant:", error);
      toast.error("Failed to switch plant");

      // Clean up potentially corrupted data
      try {
        localStorage.removeItem("selectedPlant");
        localStorage.removeItem("selectedPlantId");
        localStorage.removeItem("selectedPlantName");
      } catch (cleanupError) {
        console.error("Error cleaning up localStorage:", cleanupError);
      }
    }
  };

  if (loading)
    return (
      <div className="px-3 py-2 text-sm text-gray-500 flex items-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
        Loading plants...
      </div>
    );

  if (error)
    return (
      <div className="px-3 py-2 text-sm text-red-500">Error loading plants</div>
    );

  if (!plants || plants.length === 0)
    return (
      <div className="px-3 py-2 text-sm text-gray-500">No plants available</div>
    );

  const currentPlant = selectedPlant || (plants.length > 0 ? plants[0] : null);
  console.log("currentPlant", currentPlant);
  if (!currentPlant) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
            <Factory className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">
              {currentPlant.warehouse_name ||
                currentPlant.name ||
                "Select Plant"}
            </p>
            <p className="text-xs text-gray-500">
              {currentPlant.code || ""}
            </p>
          </div>
        </div>
        <ChevronDown className="ml-2 -mr-1 h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-2">
            <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
              Select Plant
            </div>
            <div className="max-h-96 overflow-y-auto">
              {plants.map((plant) => (
                <button
                  key={plant._id}
                  onClick={() => handleSelectPlant(plant)}
                  className={`w-full px-4 py-3 text-sm flex items-center hover:bg-gray-50 ${
                    currentPlant?._id === plant._id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Factory className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {plant.warehouse_name || plant.name}
                    </p>
                    <div className="flex items-center mt-0.5">
                      <span className="text-xs text-gray-500">
                        {plant.code || "No code"}
                      </span>
                      {currentPlant?._id === plant._id && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-5 flex items-center justify-center">
                    {currentPlant?._id === plant._id && (
                      <Check className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantSwitcher;
