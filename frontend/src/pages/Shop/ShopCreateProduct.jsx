import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import Footer from "../../components/Layout/Footer";
import CreateProduct from "../../components/Shop/CreateProduct";

const ShopCreateProduct = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-center justify-between w-full">
        <div className="w-full justify-center flex">
          <CreateProduct />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopCreateProduct;
