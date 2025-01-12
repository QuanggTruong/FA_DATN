import { createSlice } from "@reduxjs/toolkit";
import { getSetting } from "./setting.thunk";

const initialState = {
  id: "",
  address: "",
  aboutUs: "",
  isLoading: false,
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setSetting(state, action) {
      state.id = action.payload._id;
      state.address = action.payload.address;
      state.aboutUs = action.payload.aboutUs;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSetting.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getSetting.fulfilled, (state, action) => {
        if (action.payload.success) {
          const resPayload = action.payload.data;
          state.isLoading = false;
          state.id = resPayload.length > 0 ? resPayload[0]._id : "";
          state.address = resPayload.length > 0 ? resPayload[0].address : "";
          state.aboutUs = resPayload.length > 0 ? resPayload[0].aboutUs : "";
        }
      })
      .addCase(getSetting.rejected, (state, action) => {
        state.error = action.payload;
        state.id = "";
        state.address = "";
        state.aboutUs = "";
        state.isLoading = false;
      });
  },
});

export const { setSetting } = settingSlice.actions;
export default settingSlice.reducer;
