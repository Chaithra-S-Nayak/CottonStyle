import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";

const AdminOTPInput = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState("");

  const verifyOtp = async () => {
    try {
      const response = await axios.post(`${server}/admin/admin-verify-otp`, {
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
      toast.error(
        error.response?.data?.message ||
          "An error occurred while verifying OTP."
      );
    }
  };

  return (
    <>
      <p className="mt-6 text-center text-2xl font-weight:300 text-gray-700">
        Verify OTP
      </p>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            verifyOtp();
          }}
        >
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
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
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white  bg-[#243450] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Verify OTP
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminOTPInput;
