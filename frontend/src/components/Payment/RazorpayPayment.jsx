import React from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import logo from "../../Assets/TshirtGalaxy.png";
import styles from "../../styles/styles";

const RazorpayPayment = ({ orderData, onSuccess, setLoading }) => {
  const { user } = useSelector((state) => state.user);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${server}/payment/create/orderId`, {
        amount: Math.round(orderData?.totalPrice * 100),
      });

      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Tshirt Galaxy",
        description: "Payment for your order",
        image: logo,
        order_id: data.orderId,
        handler: async (response) => {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;
          const paymentInfo = {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          };
          // Call backend to verify payment
          const verificationResponse = await axios.post(
            `${server}/payment/verify`,
            paymentInfo
          );
          if (verificationResponse.data.signatureIsValid === "true") {
            await razorpayPaymentHandler(paymentInfo);
          } else {
            toast.error("Payment verification failed. Please try again.");
            setLoading(false);
          }
        },
        prefill: {
          name: orderData.user.name,
          email: orderData.user.email,
          contact: orderData.user.phoneNumber,
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
      setLoading(false);
    }
  };

  const razorpayPaymentHandler = async (paymentInfo) => {
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
        id: paymentInfo.razorpay_payment_id,
        status: "succeeded",
        type: "Razorpay",
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
      <button className={`${styles.simpleButton} ml-7`} onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
};

export default RazorpayPayment;
