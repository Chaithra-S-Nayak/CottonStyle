import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import AllOrders from "../../components/Shop/AllOrders";
import styles from "../../styles/styles";

const ShopAllOrders = () => {
  return (
    <div>
      <DashboardHeader />
      <div className={`${styles.section}`}>
        <div className="flex justify-between w-full ">
          <div className="w-full justify-center flex">
            <AllOrders />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopAllOrders;
