import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import styles from "../../styles/styles";

const SellerChangePassword = () => {
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
      const res = await axios.put(
        `${server}/shop/change-seller-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Password updated successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-10 px-5 py-8 border bg-white rounded-md">
      <h1 className={`${styles.formHeading}`}>Change Password</h1>
      <form
        onSubmit={passwordChangeHandler}
        className="flex flex-col items-center"
      >
        <div className="w-full mb-4">
          <label className={`${styles.formLabel}`}>
            Enter your old password
          </label>
          <input
            type="password"
            className={`${styles.formInput}`}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="w-full mb-4">
          <label className={`${styles.formLabel}`}>
            Enter your new password
          </label>
          <input
            type="password"
            className={`${styles.formInput}`}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="w-full mb-4">
          <label className={`${styles.formLabel}`}>
            Confirm your new password
          </label>
          <input
            type="password"
            className={`${styles.formInput}`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="w-full mb-4">
          <button type="submit" className={`${styles.wideButton}`}>
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerChangePassword;
