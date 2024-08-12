import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import Footer from "../../components/Layout/Footer";
import WithdrawMoney from "../../components/Shop/WithdrawMoney";

const ShopWithDrawMoneyPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <WithdrawMoney />
      </div>
      <Footer />
    </div>
  );
};

export default ShopWithDrawMoneyPage;
