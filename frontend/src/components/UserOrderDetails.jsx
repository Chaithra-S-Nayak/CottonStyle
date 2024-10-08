import React, { useEffect, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { server } from "../server";
import ReturnRequestModal from "../components/ReturnRequestModal";
import styles from "../styles/styles";
import { differenceInDays } from "date-fns";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();

  const [open, setOpen] = useState(false); // For review modal
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // For return/exchange modal
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (user._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user._id]);

  const data = orders && orders.find((item) => item._id === id);
  const deliveryDate = new Date(data?.deliveredAt);
  const currentDate = new Date();
  console.log(currentDate);
  const daysSinceDelivery = differenceInDays(currentDate, deliveryDate);
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
  const handleOpenReturnRequestModal = () => {
    if (data) {
      const selectedItem = {
        orderId: data._id,
        shopId: data?.cart[0]?.shopId,
        coupon: data?.coupon
          ? {
              name: data.coupon.name,
              couponDiscountPercentage: data.coupon.couponDiscountPercentage,
            }
          : null,
        products: data.cart.map((item) => {
          return {
            productId: item._id,
            name: item.name,
            qty: item.qty,
            discountPrice: item.discountPrice,
            availableSizes: item.availableSizes,
          };
        }),
      };
      setSelectedItem(selectedItem);
      setIsModalOpen(true);
    } else {
      console.error("Order data is null or undefined");
    }
  };

  const totalPrice =
    data?.totalPrice +
    ((data?.gstPercentage || 0) / 100) * (data?.totalPrice || 0);

  return (
    <div className="container mx-auto p-4 min-h-screen">
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
              Total Price: <span>₹{totalPrice}</span>
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
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <h2 className="text-xl mb-2">Order Items</h2>
        {data &&
          data?.cart.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row items-center mb-4"
            >
              <img
                src={`${item.images[0]?.url}`}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg mb-4 md:mb-0 md:mr-4"
              />
              <div className="flex-1">
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

                {/* Display returnRequestType if it exists */}
                {item.returnRequestType && (
                  <p className="text-sm text-gray-600 mt-1">
                    Return Request Type:
                    <span className="font-semibold">
                      {item.returnRequestType}
                    </span>
                  </p>
                )}

                {/* Display returnRequestStatus if it exists */}
                {item.returnRequestStatus && (
                  <p className="text-sm text-gray-600 mt-1">
                    Return Request Status:
                    <span className="font-semibold">
                      {item.returnRequestStatus}
                    </span>
                  </p>
                )}
              </div>
              <div className="mt-4 md:mt-0 md:ml-auto">
                {!item.isReviewed && data?.status === "Delivered" && (
                  <button
                    className={`${styles.simpleButton}`}
                    onClick={() => {
                      setSelectedItem(item);
                      setOpen(true);
                    }}
                  >
                    Write a review
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Return Request Modal */}
      <ReturnRequestModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        selectedItem={selectedItem}
      />

      {/* Review Modal */}
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
                alt={selectedItem?.name}
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
              <h5 className="mr-2">Give a Rating</h5>
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
            <div className="w-full">
              <label className="block mb-1">Write a comment</label>
              <textarea
                className={`${styles.formLabel} w-full`}
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your product? Write your expression about it!"
              ></textarea>
            </div>
            <button
              className={`${styles.simpleButton} mt-4`}
              onClick={reviewHandler}
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* Shipping Details and Payment Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Shipping Details */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl mb-2">Shipping Address</h2>
          <h5>Name: {data?.user?.name}</h5>
          <h5>Email: {data?.user?.email}</h5>
          <h5>Address: {data?.shippingAddress?.address1}</h5>
          <h5>City: {data?.shippingAddress?.city}</h5>
          <h5>Country: {data?.shippingAddress?.country}</h5>
          <h5>Zip Code: {data?.shippingAddress?.zipCode}</h5>
          <h5>Phone Number: {data?.shippingAddress?.phoneNumber}</h5>
        </div>

        {/* Payment Information */}
        <div className="bg-white shadow rounded-lg p-4">
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
        {data?.status === "Delivered" && data?.deliveredAt && (
          <h5>
            Delivered At: {new Date(data.deliveredAt).toLocaleDateString()}
          </h5>
        )}
      </div>

      {/* Actions */}
      <div className={`${styles.normalFlex}`}>
        {data?.status === "Delivered" && daysSinceDelivery <= 7 && (
          <button
            className={`${styles.simpleButton} mr-4`}
            onClick={handleOpenReturnRequestModal}
          >
            Refund/Exchange
          </button>
        )}
        <Link to={`/user/order/invoice/${id}`}>
          <div className={`${styles.simpleButton}`}>View Invoice</div>
        </Link>
      </div>
    </div>
  );
};

export default UserOrderDetails;
