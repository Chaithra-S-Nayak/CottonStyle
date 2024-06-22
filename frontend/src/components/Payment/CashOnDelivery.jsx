import React from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CashOnDelivery = ({ orderData }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const order = {
      cart: orderData?.cart,
      shippingAddress: orderData?.shippingAddress,
      user: user && user,
      totalPrice: orderData?.totalPrice,
      gstPercentage: orderData?.gstPercentage,
      paymentInfo: {
        status: "Not Paid",
        type: "Cash On Delivery",
      },
      coupon: orderData?.coupon,
      sellerDeliveryFees: orderData?.sellerDeliveryFees,
    };

    await axios.post(`${server}/order/create-order`, order, config).then(() => {
      navigate("/order/success");
      toast.success("Order successful!");
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      window.location.reload();
    });
  };

  return (
    <div>
      <div className="w-full flex">
        <form className="w-full" onSubmit={cashOnDeliveryHandler}>
          <input
            type="submit"
            value="Confirm"
            className="bg-[#243450] text-white py-2 px-4 ml-7 rounded"
          />
        </form>
      </div>
    </div>
  );
};

export default CashOnDelivery;
