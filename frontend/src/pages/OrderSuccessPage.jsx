import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Lottie from "react-lottie";
import animationData from "../Assets/animations/success.json";
import styles from "../styles/styles";

const OrderSuccessPage = () => {
  return (
    <div>
      <Header />
      <Success />
      <Footer />
    </div>
  );
};

const Success = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-100 to-blue-100">
      <Lottie options={defaultOptions} width={300} height={300} />
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Thank you! Your order has been placed successfully.
        </h2>
        <p className="text-gray-600 mb-6">
          We appreciate your purchase and are working to get your items to you
          as soon as possible.
        </p>
        <Link to="/">
          <button className={`${styles.simpleButton}`}>
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
