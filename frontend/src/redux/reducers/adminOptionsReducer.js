import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  adminOptions: {},
  loading: false,
  fetchSuccess: false,
  updateSuccess: false,
  error: null,
};

export const adminOptionsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("FETCH_ADMIN_OPTIONS_SUCCESS", (state, action) => {
      state.adminOptions = action.payload;
      state.loading = false;
      state.fetchSuccess = true;
      state.error = null;
    })
    .addCase("FETCH_ADMIN_OPTIONS_FAIL", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.fetchSuccess = false;
    })
    .addCase("UPDATE_ADMIN_OPTIONS_SUCCESS", (state, action) => {
      state.adminOptions = action.payload;
      state.loading = false;
      state.updateSuccess = true;
      state.error = null;
    })
    .addCase("UPDATE_ADMIN_OPTIONS_FAIL", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.updateSuccess = false;
    })
    .addCase("RESET_ADMIN_OPTIONS_STATE", (state) => {
      state.updateSuccess = false;
      state.error = null;
    });
});
