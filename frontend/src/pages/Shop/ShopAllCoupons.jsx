import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import AllCoupons from "../../components/Shop/AllCoupons";
import styles from "../../styles/styles";

const ShopAllCoupons = () => {
  return (
    <div>
      <DashboardHeader />
      <div className={`${styles.section}`}>
        <div className="flex justify-between w-full">
          <div className="w-full justify-center flex">
            <AllCoupons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopAllCoupons;
