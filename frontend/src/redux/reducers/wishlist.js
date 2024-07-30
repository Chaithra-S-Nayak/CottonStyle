import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  wishlist: [],
  loading: false,
  error: null,
  success: false,
};

export const wishlistReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("CreateWishlistRequest", (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase("CreateWishlistSuccess", (state, action) => {
      state.loading = false;
      state.success = true;
      state.wishlist = action.payload;
    })
    .addCase("CreateWishlistFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase("DeleteWishlistItemRequest", (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase("DeleteWishlistItemSuccess", (state, action) => {
      state.loading = false;
      state.success = true;
      state.wishlist = action.payload;
    })
    .addCase("DeleteWishlistItemFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase("GetWishlistRequest", (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase("GetWishlistSuccess", (state, action) => {
      state.loading = false;
      state.wishlist = action.payload;
    })
    .addCase("GetWishlistFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
});
