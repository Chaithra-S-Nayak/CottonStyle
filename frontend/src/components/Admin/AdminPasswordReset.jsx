import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";

const AdminPasswordReset = ({ email }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const resetPassword = async () => {
    if (password !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    try {
      const response = await axios.put(`${server}/admin/admin-reset-password`, {
        email,
        newPassword: password,
      });
      if (response.data.success) {
        toast.success("Password has been reset successfully.");
        navigate("/admin/dashboard");
      } else {
        toast.error("Failed to reset password.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while resetting password."
      );
    }
  };

  return (
    <>
     <h1 className={`${styles.formHeading}`}>
        Reset Password
      </h1>
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          resetPassword();
        }}
      >
        <div>
          <label htmlFor="password" className={`${styles.formLabel}`}>
            New Password
          </label>
          <div className="mt-1">
            <input
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${styles.formInput}`}
            />
          </div>
        </div>
        <div>
          <label htmlFor="confirm-password" className={`${styles.formLabel}`}>
            Confirm New Password
          </label>
          <div className="mt-1">
            <input
              type="password"
              name="confirm-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${styles.formInput}`}
            />
          </div>
        </div>
        <div>
          <button type="submit" className={`${styles.wideButton}`}>
            Reset Password
          </button>
        </div>
      </form>
    </>
  );
};

export default AdminPasswordReset;
