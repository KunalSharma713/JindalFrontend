import { createSlice } from "@reduxjs/toolkit";
// import LocalStorageHelper from "../../services/LocalStorageHelper";
const initialState = {
  MainPanelWidth: "calc(100% - 255px)",
  SideBarWidth: "260px",
  MiniSideBarToogle: false,
  MobileSideBarToggle: false,
  IsMobileView: false,
  DefaultMini: false,
  IsRTL: false,
};
// SideBar Slice
const SideBarSlice = createSlice({
  name: "SideBarSlice",
  initialState,
  reducers: {
    MiniSideBarAction: (state) => {
      if (state.MiniSideBarToogle) {
        state.MainPanelWidth = "calc(100% - 255px)";
        state.SideBarWidth = "260px";
      } else {
        state.MainPanelWidth = "calc(100% - 40px)";
        state.SideBarWidth = "80px";
      }
      state.MiniSideBarToogle = !state.MiniSideBarToogle;
      state.DefaultMini = !state.DefaultMini;
    },
    RTLToggleAction: (state, action) => {
      const { IsRTL } = action.payload;
      state.IsRTL = IsRTL ? true : false;
    },
    MobileSideBarToggleAction: (state) => {
      state.MobileSideBarToggle = !state.MobileSideBarToggle;
    },
    ChangeScreenViewAction: (state, action) => {
      const { IsMobile } = action.payload;
      state.IsMobileView = IsMobile;
      if (IsMobile) {
        state.MiniSideBarToogle = false;
        state.MainPanelWidth = "calc(100%)";
        state.SideBarWidth = "260px";
      } else {
        state.MiniSideBarToogle = state.DefaultMini;
        if (!state.DefaultMini) {
          state.MainPanelWidth = "calc(100% - 255px)";
          state.SideBarWidth = "260px";
        } else {
          state.MainPanelWidth = "calc(100% - 40px)";
          state.SideBarWidth = "80px";
        }
      }
    },
  },
});

export const {
  MiniSideBarAction,
  ChangeScreenViewAction,
  RTLToggleAction,
  MobileSideBarToggleAction,
} = SideBarSlice.actions;
export default SideBarSlice.reducer;
