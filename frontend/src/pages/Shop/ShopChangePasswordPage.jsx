import React from "react";
import SellerChangePassword from "../../components/Shop/SellerChangePassword";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import Footer from "../../components/Layout/Footer";

const ShopChangePasswordPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full min-h-screen">
        <SellerChangePassword />
      </div>
      <Footer />
    </div>
  );
};

export default ShopChangePasswordPage;
