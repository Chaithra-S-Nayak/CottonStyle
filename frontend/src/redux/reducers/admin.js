import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  isLoading: true,
  isAdmin: false,
  success: false,
  error: null,
  message: null,
};

export const adminReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("LOAD_ADMIN_REQUEST", (state) => {
      state.isLoading = true;
    })
    .addCase("LOAD_ADMIN_SUCCESS", (state, action) => {
      state.isAdmin = true;
      state.isLoading = false;
      state.admin = action.payload;
    })
    .addCase("LOAD_ADMIN_FAIL", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAdmin = false;
    })
    .addCase("ADMIN_LOGIN_REQUEST", (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase("ADMIN_LOGIN_SUCCESS", (state, action) => {
      state.isLoading = false;
      state.isAdmin = true;
      state.admin = action.payload.admin;
      state.success = true;
      state.message = action.payload.message;
    })
    .addCase("ADMIN_LOGIN_FAIL", (state, action) => {
      state.isLoading = false;
      state.isAdmin = false;
      state.error = action.payload;
    })
    .addCase("ADMIN_VERIFY_OTP_REQUEST", (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase("ADMIN_VERIFY_OTP_SUCCESS", (state, action) => {
      state.isLoading = false;
      state.isAdmin = true;
      state.admin = action.payload.admin;
      state.success = true;
      state.message = action.payload.message;
    })
    .addCase("ADMIN_VERIFY_OTP_FAIL", (state, action) => {
      state.isLoading = false;
      state.isAdmin = false;
      state.error = action.payload;
    })
    .addCase("ADMIN_LOGOUT_SUCCESS", (state) => {
      state.admin = null;
      state.isAdmin = false;
      state.success = false;
    })
    .addCase("ADMIN_UPDATE_PROFILE_REQUEST", (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase("ADMIN_UPDATE_PROFILE_SUCCESS", (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.admin = action.payload;
    })
    .addCase("ADMIN_UPDATE_PROFILE_FAIL", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
});
