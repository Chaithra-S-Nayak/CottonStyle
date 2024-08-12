import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import Footer from "../../components/Layout/Footer";
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
      <Footer />
    </div>
  );
};

export default ShopAllCoupons;
