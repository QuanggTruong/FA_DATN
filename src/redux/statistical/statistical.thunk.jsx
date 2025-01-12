import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios/axios";

export const getStatisticalAdmin = createAsyncThunk(
  "statistical/getStatisticAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/admin/statistical`);
      return res;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
