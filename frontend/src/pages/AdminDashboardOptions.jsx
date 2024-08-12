import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import Footer from "../components/Layout/Footer";
import AdminOptions from "../components/Admin/AdminOptions";

const AdminDashboardOptions = () => {
  return (
    <div>
      <AdminHeader />
      <div className="flex items-center justify-between w-full">
        <div className="w-full justify-center flex">
          <AdminOptions />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboardOptions;
