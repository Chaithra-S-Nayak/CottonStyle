import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import AdminHeader from "../components/Layout/AdminHeader";
import Footer from "../components/Layout/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../server";
import styles from "../styles/styles";

const AdminReturnRequestDetails = () => {
  const [returnRequest, setReturnRequest] = useState(null);
  const [status, setStatus] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReturnRequestDetails = async () => {
      try {
        const { data } = await axios.get(
          `${server}/returnRequest/get-return-request/${id}`,
          {
            withCredentials: true,
          }
        );
        setReturnRequest(data.returnRequest);
        setStatus(data.returnRequest.status);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    };

    fetchReturnRequestDetails();
  }, [id]);

  const returnRequestUpdateHandler = async () => {
    if (status === returnRequest?.status) {
      toast.info("The status is already set to this value.");
      return;
    }
    try {
      await axios.put(
        `${server}/return-request/update-return-request-status/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success("Return Request status updated!");
      navigate("/dashboard-return-requests");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-semibold mb-4">Return Request Details</h1>
        {/* Return Request Summary */}
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h2 className="text-xl mb-2">Return Request Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h5>
                Request ID: <span>{returnRequest._id}</span>
              </h5>
              <h5>
                Requested on:{" "}
                <span>{returnRequest.createdAt?.slice(0, 10)}</span>
              </h5>
            </div>
            <div>
              <h5>
                <Link to={`/admin/order/${returnRequest.orderId}`}>
                  Order ID: {returnRequest.orderId}
                </Link>
              </h5>
              <h5>
                <Link to={`/shop/preview/${returnRequest.shopId}`}>
                  Shop ID: {returnRequest.shopId}
                </Link>
              </h5>
            </div>
          </div>
        </div>

        {/* Return Items */}
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h2 className="text-xl mb-2">Return Items</h2>
          {returnRequest.product.map((item) => (
            <div
              key={item.productId}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start mb-4"
            >
              {/* Customer Images Column */}
              <div className="flex flex-col">
                {item.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt=""
                    className="w-16 h-16 object-cover rounded-lg mb-2"
                  />
                ))}
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

        {/* Return Request Status */}
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h2 className="text-xl mb-2">Return Request Status</h2>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 border border-gray-300 rounded-md p-2"
          >
            {["Pending", "Processing", "Completed"].map((option, index) => (
              <option value={option} key={index}>
                {option}
              </option>
            ))}
          </select>
          <button
            onClick={returnRequestUpdateHandler}
            className={`${styles.simpleButton} m-4`}
          >
            Update Status
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminReturnRequestDetails;
