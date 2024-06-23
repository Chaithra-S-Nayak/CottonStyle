import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AllWithdraw from "../components/Admin/AllWithdraw";
import styles from "../styles/styles";
const AdminDashboardWithdraw = () => {
  return (
    <div>
      <AdminHeader />
      <div className={`${styles.section}`}>
        <div className="w-full flex">
          <div className="flex items-start justify-between w-full">
            <AllWithdraw />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardWithdraw;
