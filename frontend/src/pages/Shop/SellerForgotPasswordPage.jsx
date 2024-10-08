import React, { useState } from "react";
import SellerOTPInput from "../../components/Shop/SellerOTPInput";
import SellerPasswordReset from "../../components/Shop/SellerPasswordReset";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server.js";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import styles from "../../styles/styles";

const SellerForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  const sendOtp = async () => {
    try {
      const response = await axios.post(
        `${server}/shop/seller-forgot-password`,
        {
          email,
        }
      );
      if (response.data.success) {
        setShowOtpInput(true);
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
    <>
      <Header />
      <div className="m-20 flex flex-col justify-center items-center sm:px-6 lg:px-8 min-h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {!showOtpInput && !showPasswordReset && (
            <>
              <h1 className={`${styles.formHeading}`}>Forgot Your Password?</h1>
              <p className="mt-2 text-center text-sm text-gray-600">
                Enter your email to receive an OTP for password reset.
              </p>
            </>
          )}
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {!showOtpInput && !showPasswordReset && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className={`${styles.formLabel}`}>
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
            )}
            {showOtpInput && !showPasswordReset && (
              <SellerOTPInput
                email={email}
                onSuccess={() => setShowPasswordReset(true)}
              />
            )}
            {showPasswordReset && <SellerPasswordReset email={email} />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SellerForgotPasswordPage;
