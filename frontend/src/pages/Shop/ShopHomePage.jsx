import React from "react";
import styles from "../../styles/styles";
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";

const ShopHomePage = () => {
  return (
    <>
      <Header />
      <div className={`${styles.section} bg-[#f5f5f5] min-h-screen`}>
        <div className="w-full flex flex-col lg:flex-row py-10 justify-between space-y-6 lg:space-y-0 lg:space-x-6">
          <div className="w-full lg:w-[25%] bg-white rounded-lg shadow-lg p-6 lg:sticky top-[calc(4rem+16px)] self-start h-auto lg:h-[calc(100vh-80px)] overflow-y-auto">
            <ShopInfo isOwner={true} />
          </div>
          <div className="w-full lg:w-[72%] bg-white rounded-lg shadow-lg p-6">
            <ShopProfileData />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShopHomePage;