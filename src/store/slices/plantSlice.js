import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedPlant: null,
};

const plantSlice = createSlice({
  name: 'plant',
  initialState,
  reducers: {
    setSelectedPlant: (state, action) => {
      state.selectedPlant = action.payload;
    },
    clearSelectedPlant: (state) => {
      state.selectedPlant = null;
      localStorage.removeItem('selectedPlant');
      localStorage.removeItem('selectedPlantId');
    },
  },
});

export const { setSelectedPlant, clearSelectedPlant } = plantSlice.actions;
export default plantSlice.reducer;
