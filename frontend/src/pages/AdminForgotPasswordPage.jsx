import React, { useState } from "react";
import AdminForgotPassword from "../components/Admin/AdminForgotPassword";
import OtpVerification from "../components/Admin/OtpVerification";
import AdminPasswordReset from "../components/Admin/AdminPasswordReset";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";

const AdminForgotPasswordPage = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <>
      <Header />
      <div className="m-20 flex flex-col justify-center items-center sm:px-6 lg:px-8">
        {!otpSent && !showPasswordReset && (
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h1 className={`${styles.formHeading}`}>Forgot Your Password?</h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email to receive an OTP for password reset.
            </p>
          </div>
        )}
        {!otpSent && !showPasswordReset && (
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <AdminForgotPassword
                setOtpSent={setOtpSent}
                setEmail={setEmail}
              />
            </div>
          </div>
        )}
      </div>
      {otpSent && !showPasswordReset && (
        <OtpVerification
          email={email}
          type="forgot-password"
          onSuccess={() => setShowPasswordReset(true)}
        />
      )}
      <div className="m-20 flex flex-col justify-center items-center sm:px-6 lg:px-8">
        {showPasswordReset && (
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <AdminPasswordReset email={email} />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminForgotPasswordPage;
