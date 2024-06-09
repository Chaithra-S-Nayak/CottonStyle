import React from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";

const RazorpayPayment = ({ orderData, onSuccess }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(`${server}/payment/create/orderId`, {
        amount: Math.round(orderData?.totalPrice * 100),
      });

      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "CottonStyle",
        description: "Payment for your order",
        order_id: data.orderId,
        handler: async (response) => {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;
          const paymentInfo = {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          };
          await razorpayPaymentHandler(paymentInfo);
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: "9999999999",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#243450",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      toast.error("Error occurred during payment process");
    }
  };

  const razorpayPaymentHandler = async (paymentInfo) => {
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
        id: paymentInfo.razorpay_payment_id,
        status: "succeeded",
        type: "Razorpay",
      },
      coupon: orderData?.coupon,
      sellerDeliveryFees: orderData?.sellerDeliveryFees,
    };

    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
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
        <button
          className={`${styles.button} !bg-[#243450] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] ml-7 font-[600]`}
          onClick={handlePayment}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default RazorpayPayment;
