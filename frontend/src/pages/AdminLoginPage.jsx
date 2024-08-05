import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminLogin from "../components/Admin/AdminLogin";
import OtpVerification from "../components/Admin/OtpVerification";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useSelector((state) => state.admin);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isAdmin === true) {
      navigate("/admin/dashboard");
    }
  }, [isAdmin, navigate]);

  return (
    <>
      <Header />
      {!otpSent ? (
        <AdminLogin setOtpSent={setOtpSent} setEmail={setEmail} />
      ) : (
        <OtpVerification email={email} type="login" />
      )}
      <Footer />
    </>
  );
};

export default AdminLoginPage;
