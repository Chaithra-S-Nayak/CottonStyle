import React, { useEffect, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { server } from "../server";
import styles from "../styles/styles";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRefundModal, setShowRefundModal] = useState(false);

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const data = orders && orders.find((item) => item._id === id);

  const reviewHandler = async () => {
    if (rating === 0) {
      toast.error("Please rate the product to submit a review.");
      return;
    }
    try {
      const response = await axios.put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      dispatch(getAllOrdersOfUser(user._id));
      setComment("");
      setRating(0);
      setOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const refundHandler = async () => {
    await axios
      .put(`${server}/order/order-refund/${id}`, {
        status: "Processing refund",
      })
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "An error occurred");
      });
  };

  const handleRefundConfirmation = () => {
    setShowRefundModal(true);
  };

  const confirmRefund = () => {
    refundHandler();
    setShowRefundModal(false);
  };

  const totalPrice =
    data?.totalPrice +
    ((data?.gstPercentage || 0) / 100) * (data?.totalPrice || 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Order Details</h1>

      {/* Order Summary */}
      <div className="shadow rounded-lg p-4 mb-4">
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
              Total Price:<span> ₹{totalPrice}</span>
            </h5>
            <h5>
              {data?.coupon ? (
                <>
                  Coupon: <span>{data?.coupon.name}</span>
                  <br />
                  Coupon Discount Percentage:
                  <span> {data?.coupon.couponDiscountPercentage}%</span>
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
                  <> ₹{data.sellerDeliveryFees}</>
                ) : (
                  "Free"
                )}
              </span>
            </h5>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="shadow rounded-lg p-4 mb-4">
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
                  <Link
                    to={`/product/${item._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {item.name}
                  </Link>
                </h5>
                <h5>
                  ₹{item.discountPrice} x {item.qty}
                </h5>
              </div>
              {!item.isReviewed && data?.status === "Delivered" && (
                <div
                  className={`${styles.simpleButton} text-white ml-auto`}
                  onClick={() => setOpen(true) || setSelectedItem(item)}
                >
                  Write a review
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Review Popup */}
      {open && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-end">
              <RxCross1
                size={30}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Give a Review</h2>
            <div className="flex items-center mb-4">
              <img
                src={`${selectedItem?.images[0]?.url}`}
                alt=""
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div>
                <h5>{selectedItem?.name}</h5>
                <h5>
                  ₹{selectedItem?.discountPrice} x {selectedItem?.qty}
                </h5>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <h5 className="mr-2">Give a Rating </h5>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) =>
                  rating >= i ? (
                    <AiFillStar
                      key={i}
                      className="mr-1 cursor-pointer text-yellow-400"
                      size={25}
                      onClick={() => setRating(i)}
                    />
                  ) : (
                    <AiOutlineStar
                      key={i}
                      className="mr-1 cursor-pointer text-yellow-400"
                      size={25}
                      onClick={() => setRating(i)}
                    />
                  )
                )}
              </div>
            </div>
            <div>
              <label className="block mb-1">
                Write a comment
                <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your product? Write your expression about it!"
              ></textarea>
            </div>
            <button
              className={`${styles.simpleButton} text-white py-2 px-4 rounded-md shadow focus:outline-none`}
              onClick={reviewHandler}
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-end">
              <RxCross1
                size={30}
                onClick={() => setShowRefundModal(false)}
                className="cursor-pointer"
              />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Initiate Refund</h2>
            <br />
            <p className="mb-4">
              Are you sure you want to initiate a refund for this order?
            </p>
            {/* Confirm button */}
            <div className="flex justify-end">
              <button
                onClick={confirmRefund}
                className={`${styles.simpleButton}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Details and Payment Information */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Shipping Details */}
        <div className="shadow rounded-lg p-4">
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
        <div className="shadow rounded-lg p-4">
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
      <div className="shadow rounded-lg p-4 mb-4">
        <h2 className="text-xl mb-2">Order Status</h2>
        <h5>Current Status: {data?.status}</h5>
      </div>

      {/* Actions */}
      <div className={`${styles.noramlFlex}`}>
        {data?.status === "Delivered" && (
          <div
            className={`${styles.simpleButton} text-white py-2 px-4 rounded-md shadow focus:outline-none mr-4`}
            onClick={handleRefundConfirmation}
          >
            Initiate Refund
          </div>
        )}
        <Link to={`/user/order/invoice/${id}`}>
          <div
            className={`${styles.simpleButton} text-white py-2 px-4 rounded-md shadow focus:outline-none`}
          >
            View Invoice
          </div>
        </Link>
      </div>
    </div>
  );
};

export default UserOrderDetails;
