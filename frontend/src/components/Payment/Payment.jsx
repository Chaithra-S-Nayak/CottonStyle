import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RazorpayPayment from "./RazorpayPayment";
import CashOnDelivery from "./CashOnDelivery";
import CartData from "./CartData";

const Payment = () => {
  const orderData = JSON.parse(localStorage.getItem("latestOrder"));
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);
  const navigate = useNavigate();

  const onSuccess = () => {
    navigate("/order/success");
    toast.success("Order successful!");
    localStorage.setItem("cartItems", JSON.stringify([]));
    localStorage.setItem("latestOrder", JSON.stringify([]));
    window.location.reload();
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-10 pb-8 ">
            <div>
              <div className="flex w-full pb-5  mb-2">
                <div
                  className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
                  onClick={() => setSelectedPaymentMethod(1)}
                >
                  {selectedPaymentMethod === 1 ? (
                    <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
                  ) : null}
                </div>
                <h4 className="text-[18px] pl-2 font-[500] text-[#000000b1]">
                  Pay with Razorpay
                </h4>
              </div>
              {selectedPaymentMethod === 1 && (
                <RazorpayPayment orderData={orderData} onSuccess={onSuccess} />
              )}
            </div>

            <br />
            <div>
              <div className="flex w-full pb-5  mb-2">
                <div
                  className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
                  onClick={() => setSelectedPaymentMethod(2)}
                >
                  {selectedPaymentMethod === 2 ? (
                    <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
                  ) : null}
                </div>
                <h4 className="text-[18px] pl-2 font-[500] text-[#000000b1]">
                  Cash on Delivery
                </h4>
              </div>
              {selectedPaymentMethod === 2 && (
                <CashOnDelivery orderData={orderData} onSuccess={onSuccess} />
              )}
            </div>
          </div>
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

export default Payment;
