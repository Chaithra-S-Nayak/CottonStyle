import axios from "axios";
import { toast } from "react-toastify";
import { server } from '../../server';

export const loginAdmin = (email, password) => async (dispatch) => {
  try {
    const response = await axios.post(`${server}/admin/login-admin`, { email, password });
    if (response.data.success) {
      // No need to dispatch a success action since OTP is sent and verified separately
      return Promise.resolve();
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
    return Promise.reject(error);
  }
};

export const verifyAdminOtp = ( email, otp) => async (dispatch) => {
  dispatch({ type: "ADMIN_VERIFY_OTP_REQUEST" });
  
  try {
    const response = await axios.post(`${server}/admin/verify-admin-otp`, { email, otp },{ withCredentials: true });
    if (response.data.success) {
      dispatch({ type: "ADMIN_VERIFY_OTP_SUCCESS", payload: response.data });
      return Promise.resolve();
    } else {
      throw new Error(response.data.message || "OTP verification failed");
    }
  } catch (error) {
    dispatch({ type: "ADMIN_VERIFY_OTP_FAIL", payload: error.response?.data?.message || "OTP verification failed" });
    return Promise.reject(error);
  }
};



// Admin logout
export const logoutAdmin = () => async (dispatch) => {
  await axios.get(`${server}/logout`, { withCredentials: true });

  dispatch({ type: 'ADMIN_LOGOUT_SUCCESS' });
};

// Forgot password
export const forgotAdminPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: 'ADMIN_FORGOT_PASSWORD_REQUEST' });

    const { data } = await axios.post(`${server}/admin/forgot-password`, { email }, { withCredentials: true });

    dispatch({ type: 'ADMIN_FORGOT_PASSWORD_SUCCESS', payload: data.message });
  } catch (error) {
    dispatch({
      type: 'ADMIN_FORGOT_PASSWORD_FAIL',
      payload: error.response?.data?.message || 'Unknown error occurred',
    });
  }
};

// Reset password
export const resetAdminPassword = (email, newPassword) => async (dispatch) => {
  try {
    dispatch({ type: 'ADMIN_RESET_PASSWORD_REQUEST' });

    const { data } = await axios.post(`${server}/admin/reset-password`, { email, newPassword }, { withCredentials: true });

    dispatch({ type: 'ADMIN_RESET_PASSWORD_SUCCESS', payload: data.message });
  } catch (error) {
    dispatch({
      type: 'ADMIN_RESET_PASSWORD_FAIL',
      payload: error.response?.data?.message || 'Unknown error occurred',
    });
  }
};

// Update profile
export const updateAdminProfile = (email, name) => async (dispatch) => {
  try {
    dispatch({ type: 'ADMIN_UPDATE_PROFILE_REQUEST' });

    const { data } = await axios.put(`${server}/admin/update-admin-info`, { email, name }, { withCredentials: true });

    dispatch({ type: 'ADMIN_UPDATE_PROFILE_SUCCESS', payload: data.admin });
  } catch (error) {
    dispatch({
      type: 'ADMIN_UPDATE_PROFILE_FAIL',
      payload: error.response?.data?.message || 'Unknown error occurred',
    });
  }
};
