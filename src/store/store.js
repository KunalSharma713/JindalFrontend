import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import usersSlice from './slices/usersSlice'
import projectsSlice from './slices/projectsSlice'
import analyticsSlice from './slices/analyticsSlice'
import permissionsSlice from './slices/permissionsSlice'
import plantReducer from './slices/plantSlice'

// Load initial state from localStorage
const loadInitialState = () => {
  try {
    const plantId = localStorage.getItem('selectedPlantId');
    const plantName = localStorage.getItem('selectedPlantName');
    
    if (plantId && plantName) {
      return {
        plant: {
          selectedPlant: {
            _id: plantId,
            warehouse_name: plantName,
            name: plantName,
            code: ''
          }
        }
      };
    }
  } catch (e) {
    console.error('Failed to load initial state from localStorage', e);
  }
  
  return {};
};

const store = configureStore({
  reducer: {
    auth: authSlice,
    users: usersSlice,
    projects: projectsSlice,
    analytics: analyticsSlice,
    permissions: permissionsSlice,
    plant: plantReducer,
  },
  preloadedState: loadInitialState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
      thunk: {
        extraArgument: { api: {} },
      },
    }).concat(/* your other middleware */),
});

// Subscribe to store changes to persist the selected plant
store.subscribe(() => {
  const { selectedPlant } = store.getState().plant;
  
  try {
    if (selectedPlant) {
      localStorage.setItem('selectedPlant', JSON.stringify(selectedPlant));
      localStorage.setItem('selectedPlantId', selectedPlant._id);
      localStorage.setItem('selectedPlantName', selectedPlant.warehouse_name || selectedPlant.name || '');
    } else {
      localStorage.removeItem('selectedPlant');
      localStorage.removeItem('selectedPlantId');
      localStorage.removeItem('selectedPlantName');
    }
  } catch (e) {
    console.error('Error persisting selected plant to localStorage', e);
  }
});

export { store };
