import { createSlice } from "@reduxjs/toolkit";
import LocalStorageHelper from "../../services/LocalStorageHelper";

const initialState = {
  IsLoggedIn: false,
  Email: null,
  password: null,
  registeredPlants: [],
  currentPlant: null
};
// Login Slice
const LoginSlice = createSlice({
  name: "LoginSlice",
  initialState,
  reducers: {
    LoginAction: (state, action) => {

      const { accessToken, refreshToken, user } = action.payload;
      state.userDetails = user
      state.IsLoggedIn = true;
      LocalStorageHelper.setItem("user", user);
      LocalStorageHelper.setItem("accessToken", accessToken);
      LocalStorageHelper.setItem("refreshToken", refreshToken);

    },
    RefreshLoginAction: (state, action) => {
      const { accessToken } = action.payload;
      state.IsLoggedIn = true;
      LocalStorageHelper.setItem("accessToken", accessToken);
    },
    LogOutAction: (state) => {
      state.IsLoggedIn = false;
      state.userDetails = {}
      LocalStorageHelper.setItem("user");
      LocalStorageHelper.setItem("accessToken");
      LocalStorageHelper.setItem("refreshToken");
    },
    PlantSelectionAction: (state, action) => {
      const SelectedPlant = action.payload;
      state.currentPlant = SelectedPlant;
      LocalStorageHelper.setItem("selectedPlant", SelectedPlant);

    },
    SetPlantsAction: (state, action) => {
      const AllPlants = action.payload;
      state.registeredPlants = AllPlants;
      LocalStorageHelper.setItem("allPlants", AllPlants);

    }
  },
});

export const {
  LoginAction,
  LogOutAction,
  RefreshLoginAction, PlantSelectionAction, SetPlantsAction
} = LoginSlice.actions;

export default LoginSlice.reducer;
