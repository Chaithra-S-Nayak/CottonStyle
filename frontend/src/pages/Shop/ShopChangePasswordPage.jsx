import React from "react";
import SellerChangePassword from "../../components/Shop/SellerChangePassword";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";

const ShopChangePasswordPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <SellerChangePassword />
      </div>
    </div>
  );
};

export default ShopChangePasswordPage;
