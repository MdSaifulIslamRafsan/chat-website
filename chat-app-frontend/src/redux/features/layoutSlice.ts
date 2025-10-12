// src/redux/features/layoutSlice.js
import { createSlice } from "@reduxjs/toolkit";
import type { TLayoutTypes } from "../../Types/layoutTypes";

const initialState: TLayoutTypes = {
  showSidebar: true,
};
const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.showSidebar = !state.showSidebar;
    },
    showOnlyChat: (state) => {
      state.showSidebar = false;
    },
    showOnlySidebar: (state) => {
      state.showSidebar = true;
    },
  },
});

export const { toggleSidebar, showOnlyChat, showOnlySidebar } =
  layoutSlice.actions;

export default layoutSlice.reducer;
