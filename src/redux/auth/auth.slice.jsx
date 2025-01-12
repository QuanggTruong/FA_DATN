import { createSlice } from "@reduxjs/toolkit";
import {
  getAccountAdmin,
  getAccountCustomer,
  loginAdmin,
  loginCustomer,
  registerCustomer,
  resetPassword,
  sendOtp,
  updateAccount,
  verifyAccount,
} from "./auth.thunk";
import { remove } from "../../storage/storage";

const initialState = {
  userInfo: {},
  adminInfo: {},
  isLoading: false,
  error: {},
  isAuthenticated: false,
  isAuthenticatedAdmin: false,
  emailVerify: "",
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setEmailVerify(state, action) {
      state.emailVerify = action.payload;
    },
    logoutCustomer(state, action) {
      remove("ACCESS_TOKEN");
      state.isAuthenticated = false;
      state.userInfo = {};
    },
    logoutAdmin(state, action) {
      remove("ACCESS_TOKEN_ADMIN");
      state.isAuthenticatedAdmin = false;
      state.adminInfo = {};
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //Login Customer
      .addCase(loginCustomer.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(loginCustomer.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.userInfo = action.payload.user;
          state.isAuthenticated = true;
          state.error = {};
        }
      })
      .addCase(loginCustomer.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Register Customer
      .addCase(registerCustomer.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(registerCustomer.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.error = {};
        }
      })
      .addCase(registerCustomer.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Get Account Customer
      .addCase(getAccountCustomer.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAccountCustomer.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.userInfo = action.payload.data;
          state.isAuthenticated = true;
          state.error = {};
        }
      })
      .addCase(getAccountCustomer.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Register Customer
      .addCase(sendOtp.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.error = {};
        }
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Verify Otp
      .addCase(verifyAccount.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(verifyAccount.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.error = {};
        }
      })
      .addCase(verifyAccount.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Reset Password
      .addCase(resetPassword.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.error = {};
        }
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Update Account
      .addCase(updateAccount.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
        }
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Login Customer
      .addCase(loginAdmin.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.adminInfo = action.payload.data;
          state.isAuthenticatedAdmin = true;
          state.error = {};
        }
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Get account admin
      .addCase(getAccountAdmin.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAccountAdmin.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.adminInfo = action.payload.data;
          state.isAuthenticatedAdmin = true;
          state.error = {};
        }
      })
      .addCase(getAccountAdmin.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});
export const { setEmailVerify, logoutCustomer, logoutAdmin, setUserInfo } =
  authSlice.actions;
export default authSlice.reducer;
