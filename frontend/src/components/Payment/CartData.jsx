import React from "react";

const CartData = ({ orderData }) => {
  const shipping = parseFloat(orderData?.totalDeliveryFee).toFixed(2);
  const subTotalPrice = parseFloat(orderData?.totalProductPrice).toFixed(2);
  const overallProductDiscount = parseFloat(
    orderData?.OverallProductDiscount
  ).toFixed(2);
  const gstAmount = parseFloat(orderData?.gstAmount).toFixed(2);
  const OverallProductPrice = parseFloat(
    orderData?.OverallProductPrice
  ).toFixed(2);
  const couponDiscount = parseFloat(orderData?.couponDiscount).toFixed(2);
  const totalPrice = parseFloat(orderData?.totalPrice).toFixed(2);
  const cartLength = orderData?.cart?.length || 0;

  return (
    <div className="w-full bg-white rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h5 className="text-[18px] font-[500]">
          Price Details ({cartLength} Items)
        </h5>
      </div>
      <br />
      <div>
        <div className="flex justify-between mb-2">
          <p>Total Product Price</p>
          <p>₹{subTotalPrice}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p>Overall Product Discount</p>
          <p>-₹{overallProductDiscount}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p>Total Delivery Fee</p>
          <p>₹{shipping}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p>GST</p>
          <p>₹{gstAmount}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p>Overall Product Price</p>
          <p>₹{OverallProductPrice}</p>
        </div>
        <div className="flex justify-between mb-2 border-t pt-4 mt-4">
          <p>Coupon-Induced Discount</p>
          <p>-₹{couponDiscount}</p>
        </div>

        <div className="flex justify-between font-bold border-t pt-4 mt-4">
          <p>Order Total</p>
          <p>₹{totalPrice}</p>
        </div>
      </div>
    </div>
  );
};

export default CartData;
