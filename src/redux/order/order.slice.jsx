import { createSlice } from "@reduxjs/toolkit";
import {
  orderVnpay,
  orderVnpayReturn,
  getOrderHistory,
  orderCod,
  orderStripe,
  orderStripeReturn,
  updateStatuByCustomer,
  getOrderList,
  updateOrderByAdmin,
  deleteOrder,
  getOrderDetailByAdmin,
} from "./order.thunk";

const initialState = {
  isLoading: false,
  error: {},
  orders: [],
  orderReturn: {},
  orderHistories: [],
  pagination: {
    page: 1,
    pageSize: 10,
    totalPage: 0,
    totalItems: 0,
  },
  orderDetail: {},
  statusCounts: {
    pending: 0,
    processing: 0,
    shipping: 0,
    delivered: 0,
    cancelled: 0,
  },
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderReturn(state, action) {
      state.orderReturn = action.payload;
    },
    setOrderHistories(state, action) {
      state.orderHistories = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //Order Vnpay
      .addCase(orderVnpay.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(orderVnpay.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(orderVnpay.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Order Cod
      .addCase(orderCod.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(orderCod.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(orderCod.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Order Stripe
      .addCase(orderStripe.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(orderStripe.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(orderStripe.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Order vnpay return
      .addCase(orderVnpayReturn.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(orderVnpayReturn.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.orderReturn = action.payload.data;
          state.isLoading = false;
        }
      })
      .addCase(orderVnpayReturn.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Order stripe return
      .addCase(orderStripeReturn.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(orderStripeReturn.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.orderReturn = action.payload.data;
          state.isLoading = false;
        }
      })
      .addCase(orderStripeReturn.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Order History
      .addCase(getOrderHistory.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getOrderHistory.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.orderHistories = action.payload.data;
          state.pagination = action.payload.pagination;
          state.isLoading = false;
          state.statusCounts = action.payload.statusCounts;
        }
      })
      .addCase(getOrderHistory.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Update status order by customer
      .addCase(updateStatuByCustomer.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateStatuByCustomer.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
        }
      })
      .addCase(updateStatuByCustomer.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Get order list by Admin
      .addCase(getOrderList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getOrderList.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.orders = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getOrderList.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Update order by admin
      .addCase(updateOrderByAdmin.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateOrderByAdmin.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
        }
      })
      .addCase(updateOrderByAdmin.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Delete order by admin
      .addCase(deleteOrder.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Get order detail by admin
      .addCase(getOrderDetailByAdmin.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailByAdmin.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.orderDetail = action.payload.data;
          state.isLoading = false;
        }
      })
      .addCase(getOrderDetailByAdmin.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const { setOrderReturn, setOrderHistories } = orderSlice.actions;
export default orderSlice.reducer;
