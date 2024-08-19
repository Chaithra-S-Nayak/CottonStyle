import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import Footer from "../../components/Layout/Footer";
import AllRefundOrders from "../../components/Shop/AllRefundOrders";
import styles from "../../styles/styles";
const ShopAllRefunds = () => {
  return (
    <>
      <DashboardHeader />
      <div className={`${styles.section} min-h-screen`}>
        <div className="flex justify-between w-full">
          <div className="w-full justify-center flex">
            <AllRefundOrders />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShopAllRefunds;
