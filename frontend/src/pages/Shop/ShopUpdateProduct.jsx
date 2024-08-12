import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import Footer from "../../components/Layout/Footer";
import UpdateProduct from "../../components/Shop/UpdateProduct";

const ShopUpdateProduct = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-center justify-between w-full">
        <div className="w-full justify-center flex">
          <UpdateProduct />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopUpdateProduct;
