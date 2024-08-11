import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/styles";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const NotFound = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <>
      <Header />
      <section
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "#f4f4f4" }}
      >
        <div className="mx-auto max-w-screen-xl px-4 py-7 lg:px-6 lg:py-14">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-[#243450] text-9xl font-extrabold">404</h1>
            <p className="mb-4 text-gray-700 text-3xl font-bold tracking-tight">
              Oops! Page not found.
            </p>
            <p className="mb-8 text-lg font-light text-gray-700">
              Sorry, the page you’re looking for doesn’t exist. But don’t worry,
              you can explore our t-shirts on the homepage.
            </p>
            <button
              onClick={handleBackToHome}
              className={`${styles.simpleButton}`}
            >
              Back to Homepage
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default NotFound;
