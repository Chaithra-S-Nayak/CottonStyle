import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AllEvents from "../components/Admin/AllEvents";

const AdminDashboardEvents = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <AllEvents />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardEvents;
