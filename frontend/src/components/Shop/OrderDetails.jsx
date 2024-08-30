import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getProductDetails } from "../../redux/actions/product";
import { server } from "../../server";
import styles from "../../styles/styles";

const OrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
    dispatch(getProductDetails(id));
  }, [dispatch, seller._id, id]);

  const data = orders && orders.find((item) => item._id === id);

  useEffect(() => {
    if (data) {
      setStatus(data.status);
    }
  }, [data]);

  const orderUpdateHandler = async () => {
    if (status === data.status) {
      toast.info("The status is already set to this value.");
      return;
    }
    try {
      await axios.put(
        `${server}/order/update-order-status/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success("Order updated!");
      navigate("/dashboard-orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const exchangeUpdateHandler = async () => {
    if (status === data.status) {
      toast.info("The status is already set to this value.");
      return;
    }

    const productsForExchange = data.cart
      .filter((item) => item.requestStatus === "Approved Exchange")
      .map((item) => ({
        productId: item._id,
        requestStatus: status,
      }));

    if (productsForExchange.length === 0) {
      toast.info("No products need updating for exchange.");
      return;
    }

    try {
      await axios.put(
        `${server}/order/update-exchange-request-status/`,
        {
          orderId: id,
          products: productsForExchange,
        },
        { withCredentials: true }
      );
      toast.success("Exchange status updated!");
      dispatch(getAllOrdersOfShop(seller._id));
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleStatusChange = () => {
    if (data?.status === "Approved Exchange") {
      exchangeUpdateHandler();
    } else {
      orderUpdateHandler();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Order Details</h1>

      {/* Order Summary */}
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <h2 className="text-xl mb-2">Order Summary</h2>
        <div className="grid grid-cols-3 gap-4">
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
              Seller Delivery Fees:
              <span>
                {data?.sellerDeliveryFees ? (
                  <>₹{data.sellerDeliveryFees}</>
                ) : (
                  "Free"
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
                <h5>{item.name}</h5>
                <h5>
                  ₹{item.discountPrice} x {item.qty}
                </h5>
              </div>
            </div>
          ))}
      </div>

      {/* Shipping Details and Payment Information */}
      <div className="grid grid-cols-2 gap-4">
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
        {data?.status === "Delivered" && (
          <h5>
            Delivered At: <span>{data?.deliveredAt?.slice(0, 10)}</span>
          </h5>
        )}
        {data?.status !== "Approved Exchange" && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 border border-gray-300 rounded-md p-2"
          >
            {[
              "Processing",
              "Transferred to delivery partner",
              "Shipping",
              "Received",
              "On the way",
              "Delivered",
            ]
              .slice(
                [
                  "Processing",
                  "Transferred to delivery partner",
                  "Shipping",
                  "Received",
                  "On the way",
                  "Delivered",
                ].indexOf(data?.status)
              )
              .map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
          </select>
        )}
        {data?.status === "Approved Exchange" ? (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 border border-gray-300 rounded-md p-2"
          >
            {["Processing Exchange", "Exchange Success"].map(
              (option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              )
            )}
          </select>
        ) : null}
        <button
          onClick={handleStatusChange}
          className={`${styles.simpleButton} m-4`}
        >
          Update Status
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
