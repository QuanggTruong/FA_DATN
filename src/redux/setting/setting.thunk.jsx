import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import axios from "../../axios/axios";

export const getSetting = createAsyncThunk(
  "setting/getSetting",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/admin/settings");
      return res;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateSetting = createAsyncThunk(
  "setting/updateSetting",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `/admin/settings?id=${payload.id || ""}`,
        payload.data
      );
      return res;
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);
