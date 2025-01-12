import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios/axios";
import { message } from "antd";

export const createReview = createAsyncThunk(
  "review/createReview",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post("/reviews", payload);
      return res;
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const getReviewProduct = createAsyncThunk(
  "review/getReviewProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `/reviews/${payload.productId}?page=${payload.page}&pageSize=${payload.pageSize}&rate=${payload.rate}&hasComment=${payload.hasComment}&hasImage=${payload.hasImage}`
      );
      return res;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getReviewlist = createAsyncThunk(
  "review/getReviewlist",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `/admin/reviews?page=${payload.page}&pageSize=${
          payload.pageSize
        }&rate=${payload.rate || ""}&customerName=${
          payload.customerName || ""
        }&productName=${payload.productName || ""}&fromDate=${
          payload.fromDate || ""
        }&toDate=${payload.toDate || ""}`
      );
      return res;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`/admin/reviews/${id}`);
      return res;
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateReview = createAsyncThunk(
  "review/updateReview",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/admin/reviews/${id}`, data);
      return res;
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);
