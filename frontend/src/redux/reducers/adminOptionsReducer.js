import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  adminOptions: {},
  loading: false,
  success: false,
  error: null,
};

export const adminOptionsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase('FETCH_ADMIN_OPTIONS_SUCCESS', (state, action) => {
      state.adminOptions = action.payload;
      state.loading = false;
      state.success = true;
      state.error = null;
    })
    .addCase('FETCH_ADMIN_OPTIONS_FAIL', (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    })
    .addCase('UPDATE_ADMIN_OPTIONS_SUCCESS', (state, action) => {
      state.adminOptions = action.payload;
      state.loading = false;
      state.success = true;
      state.error = null;
    })
    .addCase('UPDATE_ADMIN_OPTIONS_FAIL', (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    })
    .addCase('RESET_ADMIN_OPTIONS_STATE', (state) => {
      state.success = false;
      state.error = null;
    })
    .addCase('GET_ADMIN_OPTIONS', (state, action) => {
      state.adminOptions = action.payload;
    });
});
