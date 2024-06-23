import React from "react";
import AdminSettings from "../components/Admin/AdminSettings";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminChangePassword from "../components/Admin/AdminChangePassword";

const AdminSettingsPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="container mx-auto mt-10 px-4 max-w-xl">
        <div className="space-y-8">
          <AdminSettings />
          <AdminChangePassword />
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
