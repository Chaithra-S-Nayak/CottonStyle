import React from "react";
import ShopSettings from "../../components/Shop/ShopSettings";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import Footer from "../../components/Layout/Footer";

const ShopSettingsPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <ShopSettings />
      </div>
      <Footer />
    </div>
  );
};

export default ShopSettingsPage;
