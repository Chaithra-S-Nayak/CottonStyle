import axios from "axios";
import { server } from "../../server";

// Fetch Admin Options
export const fetchAdminOptions = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${server}/adminOptions/admin-options`, {
      withCredentials: true,
    });
    dispatch({
      type: "FETCH_ADMIN_OPTIONS_SUCCESS",
      payload: data.options,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Unknown error occurred";
    dispatch({
      type: "FETCH_ADMIN_OPTIONS_FAIL",
      payload: errorMessage,
    });
  }
};

// Update Admin Options
export const updateAdminOptions = (options) => async (dispatch) => {
  try {
    const { data } = await axios.put(
      `${server}/adminOptions/admin-options`,
      options,
      { withCredentials: true }
    );
    dispatch({
      type: "UPDATE_ADMIN_OPTIONS_SUCCESS",
      payload: data.options,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Unknown error occurred";
    dispatch({
      type: "UPDATE_ADMIN_OPTIONS_FAIL",
      payload: errorMessage,
    });
  }
};

// Reset Admin Options State
export const resetAdminOptionsState = () => (dispatch) => {
  dispatch({ type: "RESET_ADMIN_OPTIONS_STATE" });
};
