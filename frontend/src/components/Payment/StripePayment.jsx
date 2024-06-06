import React, { useState } from "react";
import { useStripe, useElements, CardNumberElement, CardCvcElement, CardExpiryElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import styles from "../../styles/styles";
import { useSelector } from "react-redux";

const StripePayment = ({ orderData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);

  const paymentData = {
    amount: Math.round(orderData?.totalPrice * 100),
    user: user,
    shippingAddress: orderData?.shippingAddress,
  };

  const paymentHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${server}/payment/process`,
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          const order = {
            cart: orderData?.cart,
            shippingAddress: orderData?.shippingAddress,
            user: user,
            totalPrice: orderData?.totalPrice,
            paymentInfo: {
              id: result.paymentIntent.id,
              status: result.paymentIntent.status,
              type: "Credit Card",
            },
          };

          await axios
            .post(`${server}/order/create-order`, order, config)
            .then((res) => {
              setOpen(false);
              navigate("/order/success");
              toast.success("Order successful!");
              localStorage.setItem("cartItems", JSON.stringify([]));
              localStorage.setItem("latestOrder", JSON.stringify([]));
              window.location.reload();
            });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
      <form className="w-full" onSubmit={paymentHandler}>
        <div className="w-full flex pb-3 ">
          <div className="w-[50%]">
            <label className="block pb-2">Name On Card</label>
            <input
              required
              placeholder={user && user.name}
              className={`${styles.input} !w-[95%] text-[#444]`}
              value={user && user.name}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Exp Date</label>
            <CardExpiryElement
              className={`${styles.input}`}
              options={{
                style: {
                  base: {
                    fontSize: "19px",
                    lineHeight: 1.5,
                    color: "#444",
                  },
                  empty: {
                    color: "#3a120a",
                    backgroundColor: "transparent",
                    "::placeholder": {
                      color: "#444",
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Card Number</label>
            <CardNumberElement
              className={`${styles.input} !h-[35px] !w-[95%]`}
              options={{
                style: {
                  base: {
                    fontSize: "19px",
                    lineHeight: 1.5,
                    color: "#444",
                  },
                  empty: {
                    color: "#3a120a",
                    backgroundColor: "transparent",
                    "::placeholder": {
                      color: "#444",
                    },
                  },
                },
              }}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">CVV</label>
            <CardCvcElement
              className={`${styles.input} !h-[35px]`}
              options={{
                style: {
                  base: {
                    fontSize: "19px",
                    lineHeight: 1.5,
                    color: "#444",
                  },
                  empty: {
                    color: "#3a120a",
                    backgroundColor: "transparent",
                    "::placeholder": {
                      color: "#444",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
        <input
          type="submit"
          value="Pay Now"
          className={`${styles.button} !bg-[#60f63b] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
        />
      </form>
    </div>
  );
};

export default StripePayment;
