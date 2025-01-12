import { createSlice } from "@reduxjs/toolkit";
import { getContactList } from "./contact.thunk";

const initialState = {
  contacts: [],
  isLoading: false,
  pagination: {
    page: 1,
    pageSize: 10,
    totalPage: 0,
    totalItems: 0,
  },
};

export const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getContactList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getContactList.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.contacts = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getContactList.rejected, (state, action) => {
        state.error = action.payload;
        state.contacts = [];
        state.isLoading = false;
      });
  },
});

export const {} = contactSlice.actions;
export default contactSlice.reducer;
