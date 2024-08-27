import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import Footer from "../components/Layout/Footer";
import OrderDetails from "../components/Admin/OrderDetails";

const AdminOrderDetails = () => {
  return (
    <div>
      <AdminHeader />
      <OrderDetails />
      <Footer />
    </div>
  );
};

export default AdminOrderDetails;
