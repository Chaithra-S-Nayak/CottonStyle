import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const data = orders && orders.find((item) => item._id === id);

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center py-10 px-4 bg-gray-100">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Order Status</h1>
        {data ? (
          <>
            <div className="mb-6">
              <p className="text-gray-700">
                <strong>Order ID:</strong> {data._id}
              </p>
              <p className="text-gray-700">
                <strong>Placed On:</strong>
                {new Date(data.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                <strong>Total Amount:</strong> ₹{data.totalPrice}
              </p>
            </div>
            <div className="py-4 px-6 bg-blue-100 rounded-md border border-blue-200">
              {data.status === "Processing" && (
                <p className="text-lg text-blue-800">
                  Your order is currently being processed.
                </p>
              )}
              {data.status === "Transferred to delivery partner" && (
                <p className="text-lg text-blue-800">
                  Your order has been transferred to our delivery partner.
                </p>
              )}
              {data.status === "Shipping" && (
                <p className="text-lg text-blue-800">
                  Your order is on its way to you.
                </p>
              )}
              {data.status === "Received" && (
                <p className="text-lg text-blue-800">
                  Your order has arrived in your city and will be delivered
                  soon.
                </p>
              )}
              {data.status === "On the way" && (
                <p className="text-lg text-blue-800">
                  Our delivery person is on their way to deliver your order.
                </p>
              )}
              {data.status === "Delivered" && (
                <p className="text-lg text-blue-800">
                  Your order has been successfully delivered!
                </p>
              )}
              {data.status === "Processing refund" && (
                <p className="text-lg text-blue-800">
                  Your refund request is being processed.
                </p>
              )}
              {data.status === "Refund Success" && (
                <p className="text-lg text-blue-800">
                  Your refund has been successfully processed.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">
            <p>No order found with the provided ID.</p>
          </div>
        )}
      </div>
      <div className="mt-10 w-full max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          How to Track Your Order
        </h2>
        <p className="text-gray-600 mb-4">
          After placing your order, you can track its status here. We’ll keep
          you updated as your order moves through the various stages of
          processing, shipping, and delivery.
        </p>
        <p className="text-gray-600">
          If you have any questions or concerns about your order, please don't
          hesitate to reach out to our customer support team. We're here to help
          you with anything you need.
        </p>
      </div>
    </div>
  );
};

export default TrackOrder;
