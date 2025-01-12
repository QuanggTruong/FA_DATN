import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios/axios";

export const getUserList = createAsyncThunk(
  "user/getUserList",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `/admin/users?page=${payload.page}&pageSize=${payload.pageSize}&search=${payload.search}&status=${payload.status}`
      );
      return res;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUserAdmin = createAsyncThunk(
  "user/updateUserAdmin",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/admin/users/${id}`, payload);
      return res;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
