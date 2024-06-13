import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import backgroundImage from "../../../Assets/c.png";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat bg-cover bg-center ${styles.noramlFlex}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-25"></div>
      <div className={`w-[90%] 800px:w-[60%] absolute top-20 left-10`}>
        <p
          className={`text-[35px] leading-[1.2] 800px:text-[50px] text-white font-[600] capitalize`}
        >
          Best Collection for <br /> Comfortable T-shirts
        </p>
        <p className="pt-5 text-[18px] font-[Poppins] font-[400] text-white">
          Discover our premium, stylish, and comfortable t-shirts. <br />{" "}
          Perfect fit, all-day comfort.
        </p>
        <Link to="/products" className="inline-block">
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#fff] font-[Poppins] text-[18px]">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
