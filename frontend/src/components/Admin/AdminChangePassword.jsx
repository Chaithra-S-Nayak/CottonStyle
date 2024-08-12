import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import styles from "../../styles/styles";

const AdminChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChangeHandler = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    try {
      await axios.put(
        `${server}/admin/change-admin-password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      toast.success("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className=" p-6 rounded-md border">
      <h1 className={`${styles.formHeading}`}>Change Password</h1>
      <form onSubmit={passwordChangeHandler} className="space-y-4">
        <div>
          <label className={`${styles.formLabel}`}>
            Enter your old password
          </label>
          <input
            type="password"
            className={`${styles.formInput}`}
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div>
          <label className={`${styles.formLabel}`}>
            Enter your new password
          </label>
          <input
            type="password"
            className={`${styles.formInput}`}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label className={`${styles.formLabel}`}>
            Confirm your new password
          </label>
          <input
            type="password"
            className={`${styles.formInput}`}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className={`${styles.wideButton}`}>
          Update Password
        </button>
      </form>
    </div>
  );
};

export default AdminChangePassword;
