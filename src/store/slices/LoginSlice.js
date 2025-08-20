import { createSlice } from "@reduxjs/toolkit";
import LocalStorageHelper from "../../services/LocalStorageHelper";

const initialState = {
  isLoggedIn: false,
  userDetails: {},
  email: null,
  assignedPlants: [],
  selectedPlant: null,
  accessToken: null,
  refreshToken: null,
};
// Login Slice
const LoginSlice = createSlice({
  name: "LoginSlice",
  initialState,
  reducers: {
    LoginAction: (state, action) => {
      const { accessToken, refreshToken, user, assignedPlants, selectedPlant } =
        action.payload;

      state.userDetails = user;
      state.isLoggedIn = true;
      state.email = user?.email;
      state.refreshToken = refreshToken;
      state.accessToken = accessToken;
      state.assignedPlants = assignedPlants;
      state.selectedPlant = selectedPlant;
      LocalStorageHelper.setItem("user", user);
      LocalStorageHelper.setItem("accessToken", accessToken);
      LocalStorageHelper.setItem("refreshToken", refreshToken);
      LocalStorageHelper.setItem("selectedPlant", selectedPlant);
      LocalStorageHelper.setItem("assignedPlants", assignedPlants);
    },
    RefreshLoginAction: (state, action) => {
      const { accessToken, user, assignedPlants, selectedPlant } =
        action.payload;
      state.userDetails = user;
      state.isLoggedIn = true;
      state.email = user?.email;
      state.refreshToken = LocalStorageHelper.getItem("refreshToken");
      state.accessToken = accessToken;
      state.assignedPlants = assignedPlants;
      state.selectedPlant = selectedPlant;
      LocalStorageHelper.setItem("accessToken", accessToken);
      LocalStorageHelper.setItem("selectedPlant", selectedPlant);
      LocalStorageHelper.setItem("assignedPlants", assignedPlants);
    },
    LogOutAction: (state) => {
      state.userDetails = {};
      state.isLoggedIn = false;
      state.email = null;
      state.refreshToken = null;
      state.accessToken = null;
      state.assignedPlants = [];
      state.selectedPlant = null;
      LocalStorageHelper.setItem("user");
      LocalStorageHelper.setItem("accessToken");
      LocalStorageHelper.setItem("refreshToken");
      LocalStorageHelper.removeItem("selectedPlant");
      LocalStorageHelper.removeItem("assignedPlants");
    },
    PlantSelectionAction: (state, action) => {
      const { selectedPlant, allPlants } = action.payload;
      state.selectedPlant = selectedPlant;
      state.assignedPlants = allPlants;
      LocalStorageHelper.setItem("selectedPlant", selectedPlant);
      LocalStorageHelper.setItem("assignedPlants", allPlants);
    },
  },
});

export const {
  LoginAction,
  LogOutAction,
  RefreshLoginAction,
  PlantSelectionAction,
} = LoginSlice.actions;

export default LoginSlice.reducer;
