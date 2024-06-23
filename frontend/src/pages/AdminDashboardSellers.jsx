import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AllSellers from "../components/Admin/AllSellers";
import styles from "../styles/styles";

const AdminDashboardSellers = () => {
  return (
    <div>
      <AdminHeader />
      <div className={`${styles.section}`}>
        <div className="w-full flex">
          <div className="flex items-start justify-between w-full">
            <AllSellers />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardSellers;
