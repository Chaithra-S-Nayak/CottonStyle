import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { verifyAdminOtp } from "../../redux/actions/admin";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";

const OtpVerification = ({ email }) => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(verifyAdminOtp(email, otp));
      toast.success("OTP Verified! Redirecting to dashboard.");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(
        err.response.data.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className={`${styles.formHeading}`}> Enter OTP</h1>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="otp" className={`${styles.formLabel}`}>
                OTP
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="otp"
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
      </div>
    </div>
  );
};

export default OtpVerification;
