import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
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
    </div>
  );
};

export default AdminDashboardOptions;
