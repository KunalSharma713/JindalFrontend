import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { toast } from 'react-hot-toast';
import { Warehouse, CheckCircle } from 'lucide-react';

const PlantSelection = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const location = useLocation();
  const { apiRequest } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        const response = await apiRequest('warehouse', 'GET');
        if (response && response.data) {
          setPlants(response.data);
          // Check if user has a default plant in local storage
          const defaultPlantId = localStorage.getItem('selectedPlantId');
          if (defaultPlantId) {
            const defaultPlant = response.data.find(p => p._id === defaultPlantId);
            if (defaultPlant) {
              handlePlantSelect(defaultPlant);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching plants:', error);
        toast.error('Failed to load plants');
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [apiRequest]);

  const handlePlantSelect = (plant) => {
    setSelectedPlant(plant._id);
    localStorage.setItem('selectedPlantId', plant._id);
    localStorage.setItem('selectedPlantName', plant.warehouse_name);
    
    // Get the original destination from the location state or default to dashboard
    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Select Your Plant</h2>
          <p className="mt-2 text-lg text-gray-600">
            Choose a plant to continue to your dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plants.map((plant) => (
            <div
              key={plant._id}
              onClick={() => handlePlantSelect(plant)}
              className={`relative bg-white rounded-lg shadow-sm border-2 ${
                selectedPlant === plant._id
                  ? 'border-primary-500 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-primary-300 cursor-pointer'
              } transition-all duration-200 overflow-hidden`}
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-100 p-3 rounded-full">
                    <Warehouse className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{plant.warehouse_name}</h3>
                    <p className="text-sm text-gray-500">{plant.code}</p>
                  </div>
                </div>
                {selectedPlant === plant._id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlantSelection;
