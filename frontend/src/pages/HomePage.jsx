import React from "react";
import Header from "../components/Layout/Header";
import Hero from "../components/Route/Hero/Hero";
import BestSelling from "../components/Route/BestSelling/BestSelling";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
import Footer from "../components/Layout/Footer";

const HomePage = () => {
  return (
    <div>
      <Header activeHeading={1} />
      <Hero />
      <BestSelling />
      <FeaturedProduct />
      <Footer />
    </div>
  );
};

export default HomePage;
