import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import styles from "../../styles/styles";

const OTPInput = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState("");

  const verifyOtp = async () => {
    try {
      const response = await axios.post(`${server}/user/user-verify-otp`, {
        email,
        otp,
      });
      if (response.data.success) {
        onSuccess(); // Call the onSuccess function passed as a prop
        toast.success("OTP Verified!");
      } else {
        toast.error("Invalid OTP, please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error.response || error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while verifying OTP."
      );
    }
  };

  return (
    <>
      <h1 className={`${styles.formHeading}`}>Verify OTP</h1>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            verifyOtp();
          }}
        >
          <div>
            <label htmlFor="otp" className={`${styles.formLabel}`}>
              OTP
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="otp"
                autoComplete="one-time-code"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={`${styles.formInput}`}
              />
            </div>
          </div>
          <div>
            <button type="submit" className={`${styles.wideButton}`}>
              Verify OTP
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default OTPInput;
