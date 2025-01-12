import { createSlice } from "@reduxjs/toolkit";
import {
  getAllCategory,
  getCategoryAdmin,
  getCategoryList,
} from "./category.thunk";

const initialState = {
  categories: [],
  isLoading: false,
  error: {},
  pagination: {
    page: 1,
    pageSize: 10,
    totalPage: 0,
    totalItems: 0,
  },
  categoriesAll: [],
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get all by customer
      .addCase(getAllCategory.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.categories = action.payload.data;
        }
      })
      .addCase(getAllCategory.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Get all by admin create product
      .addCase(getCategoryAdmin.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getCategoryAdmin.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.categoriesAll = action.payload.data;
        }
      })
      .addCase(getCategoryAdmin.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Get all by admin list
      .addCase(getCategoryList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getCategoryList.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.categories = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getCategoryList.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export default categorySlice.reducer;
