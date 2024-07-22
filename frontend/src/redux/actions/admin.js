import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";

export const loadAdmin = () => async (dispatch) => {
  dispatch({ type: "LOAD_ADMIN_REQUEST" });
  try {
    const { data } = await axios.get(`${server}/admin/load`, {
      withCredentials: true,
    });
    dispatch({
      type: "LOAD_ADMIN_SUCCESS",
      payload: data.admin,
    });
  } catch (error) {
    dispatch({
      type: "LOAD_ADMIN_FAIL",
      payload: error.response.data.message,
    });
  }
};

export const updateAdminProfile =
  (email, name, phoneNumber, password) => async (dispatch) => {
    dispatch({ type: "ADMIN_UPDATE_PROFILE_REQUEST" });
    try {
      const { data } = await axios.put(
        `${server}/admin/update-admin-info`,
        { email, name, phoneNumber, password },
        { withCredentials: true }
      );
      dispatch({ type: "ADMIN_UPDATE_PROFILE_SUCCESS", payload: data.admin });
      toast.success("Profile updated successfully!");
    } catch (error) {
      dispatch({
        type: "ADMIN_UPDATE_PROFILE_FAIL",
        payload: error.response?.data?.message || "Unknown error occurred",
      });
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

export const verifyAdminOtp = (email, otp) => async (dispatch) => {
  dispatch({ type: "ADMIN_VERIFY_OTP_REQUEST" });
  try {
    const { data } = await axios.post(
      `${server}/admin/verify-admin-otp`,
      { email, otp },
      { withCredentials: true }
    );
    if (data.success) {
      dispatch({
        type: "ADMIN_VERIFY_OTP_SUCCESS",
        payload: { admin: data.admin, message: data.message },
      });
      return Promise.resolve();
    } else {
      throw new Error(data.message || "OTP verification failed");
    }
  } catch (error) {
    dispatch({
      type: "ADMIN_VERIFY_OTP_FAIL",
      payload: error.response?.data?.message || "OTP verification failed",
    });
    return Promise.reject(error);
  }
};

// Admin logout
export const logoutAdmin = () => async (dispatch) => {
  await axios.get(`${server}/admin/logout`, { withCredentials: true });
  dispatch({ type: "ADMIN_LOGOUT_SUCCESS" });
};

export const clearErrors = () => ({ type: "CLEAR_ERRORS" });
export const clearMessages = () => ({ type: "CLEAR_MESSAGES" });
