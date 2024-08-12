import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import Footer from "../components/Layout/Footer";
import AllProducts from "../components/Admin/AllProducts";

const AdminDashboardProducts = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <AllProducts />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboardProducts;
