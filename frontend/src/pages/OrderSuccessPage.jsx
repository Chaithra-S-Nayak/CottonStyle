import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Lottie from "lottie-react";
import animationData from "../Assets/animations/success.json";
import styles from "../styles/styles";

const OrderSuccessPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center py-8">
        <Success />
      </main>
      <Footer />
    </div>
  );
};

const Success = () => {
  return (
    <div className="w-full max-w-lg mx-auto text-center p-4">
      <div className="flex justify-center">
        <Lottie
          animationData={animationData}
          loop={false}
          autoplay={true}
          style={{ width: 300, height: 300 }}
        />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
        Thank you! Your order has been placed successfully.
      </h2>
      <p className="text-gray-600 mb-6">
        We appreciate your purchase and are working to get your items to you as
        soon as possible.
      </p>
      <Link to="/">
        <button className={`${styles.simpleButton}`}>Continue Shopping</button>
      </Link>
    </div>
  );
};

export default OrderSuccessPage;
