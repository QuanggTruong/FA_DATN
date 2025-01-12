import { createSlice } from "@reduxjs/toolkit";
import { getStatisticalAdmin } from "./statistical.thunk";
const initialState = {
  isLoading: false,
  error: {},
  totalOrders: 0,
  totalProducts: 0,
  totalCustomers: 0,
  totalOrderAmount: 0,
  monthlyRevenue: {},
  topSellingProducts: [],
};

export const statisticalSlice = createSlice({
  name: "statistical",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get statistical by admin
      .addCase(getStatisticalAdmin.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getStatisticalAdmin.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.totalOrders = action.payload.data.totalOrders;
          state.totalProducts = action.payload.data.totalProducts;
          state.totalCustomers = action.payload.data.totalCustomers;
          state.totalOrderAmount = action.payload.data.totalOrderAmount;
          state.monthlyRevenue = action.payload.data.monthlyRevenue;
          state.topSellingProducts = action.payload.data.topSellingProducts;
        }
      })
      .addCase(getStatisticalAdmin.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const {} = statisticalSlice.actions;
export default statisticalSlice.reducer;
