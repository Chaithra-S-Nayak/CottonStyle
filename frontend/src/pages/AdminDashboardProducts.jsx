import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import Footer from "../components/Layout/Footer";
import AllProducts from "../components/Admin/AllProducts";
import styles from "../styles/styles";

const AdminDashboardProducts = () => {
  return (
    <div>
      <AdminHeader />
      <div className={`${styles.section}`}>
        <div className="w-full flex">
          <div className="flex items-start justify-between w-full">
            <AllProducts />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboardProducts;
