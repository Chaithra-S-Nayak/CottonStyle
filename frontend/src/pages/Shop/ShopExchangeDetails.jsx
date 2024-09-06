import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import Footer from "../../components/Layout/Footer";
import { toast } from "react-toastify";
import styles from "../../styles/styles";

const ShopExchangeDetails = () => {
  const { id } = useParams();
  const [returnRequest, setReturnRequest] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchReturnRequestDetails = async () => {
      try {
        const response = await axios.get(
          `${server}/returnRequest/get-return-request/${id}`,
          { withCredentials: true }
        );
        setReturnRequest(response.data.returnRequest);
        setOrderStatus(response.data.orderStatus);
        setStatus(response.data.returnRequest.status);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch details");
      }
    };

    fetchReturnRequestDetails();
  }, [id]);

  const handleStatusChange = async (e) => {
    try {
      await axios.put(
        `${server}/order/update-exchange-status`,
        {
          status,
          orderId: returnRequest?.orderId,
        },
        { withCredentials: true }
      );
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update the status"
      );
    }
  };

  return (
    <>
      <DashboardHeader />
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-semibold mb-4">Return Request Details</h1>

        {/* Return Request Summary */}
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h2 className="text-xl mb-2">Return Request Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <h5>
                Request ID: <span>{returnRequest?._id}</span>
              </h5>
              <h5>
                Requested on:
                <span>{returnRequest?.createdAt?.slice(0, 10)}</span>
              </h5>
            </div>
            <div>
              <h5>
                <Link to={`/admin/order/${returnRequest?.orderId}`}>
                  Order ID: {returnRequest?.orderId}
                </Link>
              </h5>
              <h5>
                <Link to={`/shop/preview/${returnRequest?.shopId}`}>
                  Shop ID: {returnRequest?.shopId}
                </Link>
              </h5>
            </div>
            <div>
              <h5>
                {returnRequest?.product[0].coupon ? (
                  <>
                    Coupon: <span>{returnRequest?.product[0].coupon.name}</span>
                    <br />
                    Coupon Discount Percentage:
                    <span>
                      {
                        returnRequest?.product[0].coupon
                          .couponDiscountPercentage
                      }
                      %
                    </span>
                    <br />
                  </>
                ) : (
                  "Did not apply coupon code"
                )}
              </h5>
            </div>
          </div>
        </div>

        {/* Return Items */}
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h2 className="text-xl mb-2">Return Items</h2>
          {returnRequest?.product.map((item) => (
            <div
              key={item.productId}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start mb-4"
            >
              {/* Customer Images Column */}
              <div className="flex flex-col">
                {item.images?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.images.map((image, index) => (
                      <a
                        key={index}
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={image.url}
                          alt=""
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details Column */}
              <div>
                <Link to={`/product/${item.productId}`}>
                  <h5>Product ID: {item.productId}</h5>
                </Link>
                <h5>Quantity: {item.quantity}</h5>
                <h5>Paid Amount: ₹{item.paidAmount}</h5>
                <h5>Reason: {item.reason}</h5>
                <h5>Request Type: {item.requestType}</h5>
                {item.selectedSize && (
                  <h5>Selected Size: {item.selectedSize}</h5>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Status Update Dropdown */}
        {orderStatus === "Approved Exchange" && (
          <div className="bg-white shadow rounded-lg p-4 mb-4">
            <h2 className="text-xl mb-2">Exchange Status</h2>
            <div className="flex flex-col sm:flex-row items-start">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className=" border border-gray-300 rounded-md p-2 w-full sm:w-auto"
              >
                {[
                  "Processing Exchange",
                  "Exchange Transferred to delivery partner",
                  "Exchange Shipping",
                  "Exchange Received",
                  "Exchange On the way",
                  "Exchange Delivered",
                ].map((option, index) => (
                  <option value={option} key={index}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                onClick={handleStatusChange}
                className={`${styles.simpleButton} mt-4 sm:mt-0 sm:ml-4`}
              >
                Update Status
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ShopExchangeDetails;
