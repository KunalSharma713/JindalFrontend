import { configureStore } from "@reduxjs/toolkit";
import LoginSlice from "./slices/LoginSlice";

const store = configureStore({
  reducer: {
    LoginReducer: LoginSlice
  },
});
export default store;
