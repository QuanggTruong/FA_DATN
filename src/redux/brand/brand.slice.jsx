import { createSlice } from "@reduxjs/toolkit";
import {
  getAllBrand,
  getBrandByCreatePro,
  getBrandList,
  getProductByBrand,
} from "./brand.thunk";

const initialState = {
  brands: [],
  isLoading: false,
  error: {},
  products: [],
  pagination: {
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPage: 0,
  },
  filters: {
    priceRanges: [],
    categories: [],
    tags: [],
  },
  brand: "",
};

export const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setBrands(state, action) {
      state.brands = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //Get brand add product
      .addCase(getBrandByCreatePro.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getBrandByCreatePro.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.brands = action.payload.data;
        }
      })
      .addCase(getBrandByCreatePro.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Get brand admin
      .addCase(getBrandList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getBrandList.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.brands = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getBrandList.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Get brand by user
      .addCase(getAllBrand.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllBrand.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.brands = action.payload.data;
        }
      })
      .addCase(getAllBrand.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Get Product By Category
      .addCase(getProductByBrand.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProductByBrand.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.products = action.payload.data;
          state.pagination = action.payload.pagination;
          state.filters = action.payload.filters;
          state.brand = action.payload.brand;
        }
      })
      .addCase(getProductByBrand.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const { setBrands } = brandSlice.actions;
export default brandSlice.reducer;
