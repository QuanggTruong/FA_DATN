import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios/axios";
import { message } from "antd";

export const loginCustomer = createAsyncThunk(
  "auth/loginCustomer",
  async (data, { rejectWithValue }) => {
    try {
      return await axios.post("/login", data);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const registerCustomer = createAsyncThunk(
  "auth/registerCustomer",
  async (data, { rejectWithValue }) => {
    try {
      return await axios.post("/register", data);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAccountCustomer = createAsyncThunk(
  "auth/getAccountCustomer",
  async (_, { rejectWithValue }) => {
    try {
      return await axios.get("/account");
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.post("/send-otp", payload);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyAccount = createAsyncThunk(
  "auth/verifyAccount",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.post("/verify-otp", payload);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.post("/reset-password", payload);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateAccount = createAsyncThunk(
  "auth/updateAccount",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.put("/account", payload);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (data, { rejectWithValue }) => {
    try {
      return await axios.post("/admin/login", data);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAccountAdmin = createAsyncThunk(
  "auth/getAccountAdmin",
  async (_, { rejectWithValue }) => {
    try {
      return await axios.get("/admin/account");
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
