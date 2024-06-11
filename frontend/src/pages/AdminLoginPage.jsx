import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminLogin from "../components/Admin/AdminLogin";
import OtpVerification from "../components/Admin/OtpVerification"; // Import your OTP component

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useSelector((state) => state.admin);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isAdmin === true) {
      navigate("/admin/dashboard");
    }
  }, [isAdmin, navigate]);

  return (
    <div>
      {!otpSent ? (
        <AdminLogin setOtpSent={setOtpSent} setEmail={setEmail} />
      ) : (
        <OtpVerification email={email} />
      )}
    </div>
  );
}

export default AdminLoginPage;
