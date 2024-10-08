import React from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";

const CashOnDelivery = ({ orderData, onSuccess, setLoading }) => {
  const { user } = useSelector((state) => state.user);

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    const order = {
      cart: orderData?.cart,
      shippingAddress: orderData?.shippingAddress,
      user: user,
      totalPrice: orderData?.totalPrice,
      gstPercentage: orderData?.gstPercentage,
      paymentInfo: {
        status: "Not Paid",
        type: "Cash On Delivery",
      },
      coupon: orderData?.coupon,
      sellerDeliveryFees: orderData?.sellerDeliveryFees,
    };
    try {
      await axios.post(`${server}/order/create-order`, order, config);
      setLoading(false);
      onSuccess();
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Order creation failed");
    }
  };

  return (
    <div className="w-full flex">
      <button
        className={`${styles.simpleButton} ml-7`}
        onClick={cashOnDeliveryHandler}
      >
        Confirm
      </button>
    </div>
  );
};

export default CashOnDelivery;
