import React from "react";
import SellerChangePassword from "../../components/Shop/SellerChangePassword";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";

const ShopChangePasswordPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={11} />
        </div>
        <SellerChangePassword />
      </div>
    </div>
  );
};

export default ShopChangePasswordPage;
