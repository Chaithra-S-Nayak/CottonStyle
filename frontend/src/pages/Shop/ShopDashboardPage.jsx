import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import Footer from "../../components/Layout/Footer";
import DashboardHero from "../../components/Shop/DashboardHero";

const ShopDashboardPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="flex-1">
          <DashboardHero />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopDashboardPage;
