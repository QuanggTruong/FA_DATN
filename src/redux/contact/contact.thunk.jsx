import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import axios from "../../axios/axios";

export const getContactList = createAsyncThunk(
  "contact/getContactList",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `/admin/contacts?page=${payload.page}&pageSize=${
          payload.pageSize
        }&name=${payload.name || ""}&email=${payload.email || ""}`
      );
      return res;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createContact = createAsyncThunk(
  "contact/createContact",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.post("/contacts", payload);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const replyContact = createAsyncThunk(
  "contact/replyContact",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.put(
        `/admin/contacts/reply/${payload.id}`,
        payload.data
      );
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteContact = createAsyncThunk(
  "contact/deleteContact",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.delete(`/admin/contacts/${payload}`);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);
