import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Invoice from "../components/Invoice";

const InvoicePage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen">
        <Invoice />
      </div>
      <Footer />
    </div>
  );
};

export default InvoicePage;
