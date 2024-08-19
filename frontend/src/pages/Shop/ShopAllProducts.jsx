import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import Footer from "../../components/Layout/Footer";
import AllProducts from "../../components/Shop/AllProducts";
import styles from "../../styles/styles";

const ShopAllProducts = () => {
  return (
    <div>
      <DashboardHeader />
      <div className={`${styles.section} min-h-screen`}>
        <div className="flex justify-between w-full">
          <div className="w-full justify-center flex">
            <AllProducts />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopAllProducts;
