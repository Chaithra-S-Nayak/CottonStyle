import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShopLogin from "../components/Shop/ShopLogin";

const ShopLoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.shop);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/shop/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <ShopLogin />
    </div>
  );
};

export default ShopLoginPage;
