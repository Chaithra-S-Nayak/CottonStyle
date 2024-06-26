import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import AllRefundOrders from "../../components/Shop/AllRefundOrders";
import styles from "../../styles/styles";
const ShopAllRefunds = () => {
  return (
    <>
      <DashboardHeader />
      <div className={`${styles.section}`}>
        <div className="flex justify-between w-full">
          <div className="w-full justify-center flex">
            <AllRefundOrders />
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopAllRefunds;
