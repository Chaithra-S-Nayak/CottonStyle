import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { server } from "../../server";

const OTPInput = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState('');

  const verifyOtp = async () => {
    try {
      const response = await axios.post(`${server}/user/verify-otp`, { email, otp });
      console.log('OTP verification response:', response.data); // Log the response
      if (response.data.success) {
        onSuccess(); // Call the onSuccess function passed as a prop
        toast.success('OTP Verified!');
      } else {
        toast.error('Invalid OTP, please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error.response || error); // Log the error
      toast.error(error.response?.data?.message || 'An error occurred while verifying OTP.');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <button onClick={verifyOtp}>Verify OTP</button>
    </div>
  );
};

export default OTPInput;
