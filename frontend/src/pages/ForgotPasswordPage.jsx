// ForgotPasswordPage.jsx
import React, { useState } from 'react';
import OTPInput from '../components/Login/OTPInput.jsx';
import PasswordReset from '../components/Login/PasswordReset.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { server } from "../server";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  const sendOtp = async () => {
    try {
      const response = await axios.post(`${server}/user/forgot-password`, { email });
      if (response.data.success) {
        setShowOtpInput(true);
        toast.success('OTP has been sent to your email.');
      } else {
        // Handle the case where the backend indicates the OTP was not sent
        toast.error('Failed to send OTP. Please try again later.');
      }
    } catch (error) {
      console.error('Failed to send OTP:', error);
      toast.error(error.response.data.message || 'An error occurred while sending OTP.');
    }
  };

  return (
    <div>
      {!showOtpInput && (
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <button onClick={sendOtp}>Send OTP</button>
        </div>
      )}
      {showOtpInput && !showPasswordReset && (
        <OTPInput email={email} onSuccess={() => setShowPasswordReset(true)} />
      )}
      {showPasswordReset && (
        <PasswordReset email={email} />
      )}
    </div>
  );
};

export default ForgotPasswordPage;
