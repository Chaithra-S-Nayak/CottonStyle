import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import Footer from "../components/Layout/Footer";
import AllSellers from "../components/Admin/AllSellers";
import styles from "../styles/styles";

const AdminDashboardSellers = () => {
  return (
    <div>
      <AdminHeader />
      <div className={`${styles.section}`}>
        <div className="w-full flex min-h-screen">
          <div className="flex items-start justify-between w-full">
            <AllSellers />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboardSellers;
