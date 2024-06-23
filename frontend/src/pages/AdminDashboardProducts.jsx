import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
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
    </div>
  );
};

export default AdminDashboardProducts;
