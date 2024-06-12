import React from "react";
import AdminSettings from "../components/Admin/AdminSettings";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import ChangeAdminPassword from "../components/Admin/ChangeAdminPassword"; // Import the new component

const AdminSettingsPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={8} />
          </div>
          <div className="flex-grow">
            <AdminSettings />
            <ChangeAdminPassword /> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
