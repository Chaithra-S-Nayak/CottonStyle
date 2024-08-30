import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminHeader from "../components/Layout/AdminHeader";
import Footer from "../components/Layout/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../server";
import styles from "../styles/styles";

const AdminReturnRequestDetails = () => {
  const [returnRequest, setReturnRequest] = useState(null);
  const [statusReturn, setStatusReturn] = useState("");
  const [statusExchange, setStatusExchange] = useState("");
  const { id } = useParams();

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
        setStatusReturn(
          data.returnRequest.product[0]?.requestType === "Return"
            ? data.returnRequest.status
            : ""
        );
        setStatusExchange(
          data.returnRequest.product[0]?.requestType === "Exchange"
            ? data.returnRequest.status
            : ""
        );
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    };

    fetchReturnRequestDetails();
  }, [id]);

  const handleUpdateStatus = async (requestType) => {
    // Filter products by request type
    const products = returnRequest?.product.filter(
      (item) => item.requestType === requestType
    );

    // Calculate the total refund amount (if applicable)
    const totalRefundAmount = products
      .filter((item) => item.requestType === "Return")
      .reduce((acc, item) => acc + item.paidAmount, 0);

    const payload = {
      status: requestType === "Return" ? statusReturn : statusExchange,
      returnRequestId: returnRequest._id,
      orderId: returnRequest?.orderId,
      refundAmount: requestType === "Return" ? totalRefundAmount : 0,
      products: products.map((item) => ({
        qty: item.quantity,
        productId: item.productId,
        ...(requestType === "Exchange" && { newSize: item.selectedSize }),
      })),
    };

    const apiEndpoint =
      requestType === "Return"
        ? `${server}/order/order-refund-success`
        : `${server}/order/order-exchange-success`;

    try {
      await axios.put(apiEndpoint, payload, { withCredentials: true });
      toast.success(`${requestType} status updated!`);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  // Separate products by request type
  const returnProducts = returnRequest?.product.filter(
    (item) => item.requestType === "Return"
  );
  const exchangeProducts = returnRequest?.product.filter(
    (item) => item.requestType === "Exchange"
  );

  return (
    <>
      <AdminHeader />
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
                Requested on:{" "}
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
                      <img
                        key={index}
                        src={image.url}
                        alt={`Image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
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

        {returnProducts?.length > 0 && (
          <button
            onClick={() => handleUpdateStatus("Return")}
            className={`${styles.simpleButton} m-4`}
          >
            Process Return
          </button>
        )}
        {exchangeProducts?.length > 0 && (
          <button
            onClick={() => handleUpdateStatus("Exchange")}
            className={`${styles.simpleButton} m-4`}
          >
            Process Exchange
          </button>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminReturnRequestDetails;
