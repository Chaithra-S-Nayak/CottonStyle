import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { server } from "../../server";

const PasswordReset = ({ email }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetPassword = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    try {
      const response = await axios.post(`${server}/user/reset-password`, { email, newPassword: password });
      if (response.data.success) {
        toast.success('Password has been reset successfully.');
      } else {
        toast.error('Failed to reset password.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred while resetting password.');
    }
  };

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New Password"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm New Password"
      />
      <button onClick={resetPassword}>Reset Password</button>
    </div>
  );
};

export default PasswordReset;
