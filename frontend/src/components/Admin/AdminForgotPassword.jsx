// components/Admin/AdminForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server.js";
import styles from "../../styles/styles";

const AdminForgotPassword = ({ setOtpSent, setEmail }) => {
  const [emailInput, setEmailInput] = useState("");

  const sendOtp = async () => {
    try {
      const response = await axios.post(
        `${server}/admin/admin-forgot-password`,
        { email: emailInput }
      );
      if (response.data.success) {
        setOtpSent(true);
        setEmail(emailInput);
        toast.success("OTP has been sent to your email.");
      } else {
        toast.error("Failed to send OTP. Please try again later.");
      }
    } catch (error) {
      console.error("Failed to send OTP:", error);
      toast.error(
        error.response.data.message || "An error occurred while sending OTP."
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="email" className={`${styles.formLabel}`}>
          Email address
        </label>
        <div className="mt-1">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter your email"
            required
            className={`${styles.formInput}`}
          />
        </div>
      </div>
      <div>
        <button onClick={sendOtp} className={`${styles.wideButton}`}>
          Send OTP
        </button>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
