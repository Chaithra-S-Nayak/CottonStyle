import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AllUsers from "../components/Admin/AllUsers";
import styles from "../styles/styles";
const AdminDashboardUsers = () => {
  return (
    <div>
      <AdminHeader />
      <div className={`${styles.section}`}>
        <div className="w-full flex">
          <div className="flex items-start justify-between w-full">
            <AllUsers />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardUsers;
