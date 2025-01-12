import { createSlice } from "@reduxjs/toolkit";
import { getUserList, updateUserAdmin } from "./user.thunk";

const initialState = {
  users: [],
  isLoading: false,
  error: {},
  pagination: {
    page: 1,
    pageSize: 10,
    totalPage: 0,
    totalItems: 0,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get user admin
      .addCase(getUserList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.users = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      //Get update user
      .addCase(updateUserAdmin.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateUserAdmin.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.data = action.payload;
        }
      })
      .addCase(updateUserAdmin.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const {} = userSlice.actions;
export default userSlice.reducer;
