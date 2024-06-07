import React from "react";
import styles from "../../styles/styles";

const CheckoutSteps = ({ active }) => {
  console.log(active);
  return (
    <div className="w-full flex justify-center">
      <div className="w-[90%] 800px:w-[50%] flex items-center flex-wrap">
        <div className={`${styles.noramlFlex}`}>
          <div className={`${styles.cart_button}`}>
            <span className={`${styles.cart_button_text}`}>1. Cart</span>
          </div>
          <div
            className={`${
              active > 1
                ? "w-[30px] 800px:w-[70px] h-[4px] !bg-[#243450]"
                : "w-[30px] 800px:w-[70px] h-[4px] !bg-[#24345023]"
            }`}
          />
        </div>

        <div className={`${styles.noramlFlex}`}>
          <div
            className={`${
              active > 1
                ? `${styles.cart_button}`
                : `${styles.cart_button} !bg-[#24345023]`
            }`}
          >
            <span
              className={`${
                active > 1
                  ? `${styles.cart_button_text}`
                  : `${styles.cart_button_text} !text-[#243450]`
              }`}
            >
              2. Address
            </span>
          </div>
          <div
            className={`${
              active > 2
                ? "w-[30px] 800px:w-[70px] h-[4px] !bg-[#243450]"
                : "w-[30px] 800px:w-[70px] h-[4px] !bg-[#24345023]"
            }`}
          />
        </div>

        <div className={`${styles.noramlFlex}`}>
          <div
            className={`${
              active > 2
                ? `${styles.cart_button}`
                : `${styles.cart_button} !bg-[#24345023]`
            }`}
          >
            <span
              className={`${
                active > 2
                  ? `${styles.cart_button_text}`
                  : `${styles.cart_button_text} !text-[#243450]`
              }`}
            >
              3. Payment
            </span>
          </div>
          <div
            className={`${
              active > 3
                ? "w-[30px] 800px:w-[70px] h-[4px] !bg-[#243450]"
                : "w-[30px] 800px:w-[70px] h-[4px] !bg-[#24345023]"
            }`}
          />
        </div>

        <div className={`${styles.noramlFlex}`}>
          <div
            className={`${
              active > 3
                ? `${styles.cart_button}`
                : `${styles.cart_button} !bg-[#24345023]`
            }`}
          >
            <span
              className={`${
                active > 3
                  ? `${styles.cart_button_text}`
                  : `${styles.cart_button_text} !text-[#243450]`
              }`}
            >
              4. Success
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;
