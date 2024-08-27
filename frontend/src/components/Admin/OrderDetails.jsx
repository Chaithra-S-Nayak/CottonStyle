import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllOrdersForAdmin } from "../../redux/actions/order";

const OrderDetails = () => {
  const { adminOrders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  const data = adminOrders && adminOrders.find((item) => item._id === id);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Order Details</h1>

      {/* Order Summary */}
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <h2 className="text-xl mb-2">Order Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h5>
              Order ID: <span>{data?._id}</span>
            </h5>
            <h5>
              Placed on: <span>{data?.createdAt?.slice(0, 10)}</span>
            </h5>
          </div>
          <div>
            <h5>
              Total Price: <span>₹{data?.totalPrice}</span>
            </h5>
            <h5>
              {data?.coupon ? (
                <>
                  Coupon: <span>{data?.coupon.name}</span>
                  <br />
                  Coupon Discount Percentage:
                  <span>{data?.coupon.couponDiscountPercentage}%</span>
                  <br />
                  Coupon Discount: <span>₹{data?.coupon.couponDiscount}</span>
                </>
              ) : (
                "Did not apply coupon code"
              )}
            </h5>
          </div>
          <div>
            <h5>
              <Link to={`/shop/preview/${data?.shopId}`}>
                Shop ID: {data?.shopId}
              </Link>
            </h5>
            <h5>
              Seller Delivery Fees:
              <span>
                {data?.sellerDeliveryFees ? (
                  <>₹{data.sellerDeliveryFees}</>
                ) : (
                  " Free"
                )}
              </span>
            </h5>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <h2 className="text-xl mb-2">Order Items</h2>
        {data &&
          data?.cart.map((item) => (
            <div key={item._id} className="flex items-center mb-4">
              <img
                src={`${item.images[0]?.url}`}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div>
                <h5>
                  <Link to={`/product/${item._id}`}>{item?.name}</Link>
                </h5>
                <h5>
                  ₹{item.discountPrice} x {item.qty}
                </h5>
              </div>
            </div>
          ))}
      </div>

      {/* Shipping Details and Payment Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Shipping Details */}
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h2 className="text-xl mb-2">Shipping Details</h2>
          <h5>
            Shipping Address:
            <span>
              {data?.shippingAddress.address1} {data?.shippingAddress.address2},
              {data?.shippingAddress.city}, {data?.shippingAddress.country}
            </span>
          </h5>
          <h5>Phone Number: {data?.user?.phoneNumber}</h5>
        </div>

        {/* Payment Information */}
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h2 className="text-xl mb-2">Payment Information</h2>
          <h5>
            Status:
            {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Not Paid"}
          </h5>
          <h5>Paid At: {data?.paidAt?.slice(0, 10)}</h5>
          <h5>Type: {data?.paymentInfo?.type}</h5>
          <h5>GST Percentage: {data?.gstPercentage}%</h5>
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <h2 className="text-xl mb-2">Order Status</h2>
        <h5>Current Status: {data?.status}</h5>
      </div>
    </div>
  );
};

export default OrderDetails;
