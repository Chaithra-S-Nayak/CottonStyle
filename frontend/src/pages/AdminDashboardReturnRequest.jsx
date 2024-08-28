import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import Footer from "../components/Layout/Footer";
import AllReturnRequests from "../components/Admin/AllReturnRequests";
import styles from "../styles/styles";
const AdminDashboardReturnRequest = () => {
  return (
    <div>
      <AdminHeader />
      <div className={`${styles.section}`}>
        <div className="w-full flex">
          <div className="flex items-start justify-between w-full">
            <AllReturnRequests />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboardReturnRequest;
