import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import Footer from "../components/Layout/Footer";
import AllWithdraw from "../components/Admin/AllWithdraw";
import styles from "../styles/styles";
const AdminDashboardWithdraw = () => {
  return (
    <div>
      <AdminHeader />
      <div className={`${styles.section}`}>
        <div className="w-full flex min-h-screen">
          <div className="flex items-start justify-between w-full">
            <AllWithdraw />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboardWithdraw;
