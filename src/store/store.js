import { configureStore } from "@reduxjs/toolkit";
import LoginSlice from "./slices/LoginSlice";
import SideBarSlice from "./slices/SideBarSlice";

const store = configureStore({
  reducer: {
    SideBarReducer: SideBarSlice,
    LoginReducer: LoginSlice
  },
});
export default store;
