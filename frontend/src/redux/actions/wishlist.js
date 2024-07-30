import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";

// Create or update wishlist
export const createWishlist = (wishlistData) => async (dispatch) => {
  try {
    dispatch({ type: "CreateWishlistRequest" });
    const { data } = await axios.post(
      `${server}/wishlist/create-wishlist`,
      wishlistData,
      { withCredentials: true }
    );
    dispatch({ type: "CreateWishlistSuccess", payload: data.wishlist });
    toast.success("Wishlist updated successfully!");
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred. Please try again.";
    dispatch({
      type: "CreateWishlistFail",
      payload: errorMessage,
    });
    toast.error(`Error: ${errorMessage}`);
  }
};

// Remove item from wishlist
export const deleteWishlistItem = (productId) => async (dispatch) => {
  try {
    dispatch({ type: "DeleteWishlistItemRequest" });
    await axios.put(
      `${server}/wishlist/delete-wishlist`,
      { productId },
      { withCredentials: true }
    );
    dispatch({ type: "DeleteWishlistItemSuccess", payload: productId });
    toast.success("Item removed from wishlist!");
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred. Please try again.";
    dispatch({ type: "DeleteWishlistItemFail", payload: errorMessage });
    toast.error(`Error: ${errorMessage}`);
  }
};

// Get wishlist
export const getWishlist = () => async (dispatch) => {
  try {
    dispatch({ type: "GetWishlistRequest" });
    const { data } = await axios.get(`${server}/wishlist/get-wishlist`, {
      withCredentials: true,
    });
    dispatch({ type: "GetWishlistSuccess", payload: data.wishlist });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred. Please try again.";
    dispatch({ type: "GetWishlistFail", payload: errorMessage });
    toast.error(`Error: ${errorMessage}`);
  }
};
