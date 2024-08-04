import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTocart, removeFromCart } from "../../redux/actions/cart";
import { fetchAdminOptions } from "../../redux/actions/adminOptions";
import { Link, useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import styles from "../../styles/styles";

const Cart = () => {
  const { cart } = useSelector((state) => state.cart);
  const { adminOptions } = useSelector((state) => state.adminOptions);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminOptions());
  }, [dispatch]);

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [availableSizes, setAvailableSizes] = useState([]);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setQuantity(item.qty);
    setSize(item.size || "");
    setAvailableSizes(item.availableSizes || []);
    setIsEditSidebarOpen(true);
  };

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleSizeChange = (event) => {
    setSize(event.target.value);
  };

  const handleUpdateItem = () => {
    dispatch(addTocart({ ...selectedItem, qty: quantity, size }));
    setIsEditSidebarOpen(false);
  };

  const sellerAmounts = cart.reduce((acc, item) => {
    const { shopId, discountPrice, qty } = item;
    const total = discountPrice * qty;
    if (!acc[shopId]) {
      acc[shopId] = { total: 0, items: [] };
    }
    acc[shopId].total += total;
    acc[shopId].items.push(item);
    return acc;
  }, {});

  const deliveryFee = adminOptions.deliveryFee || 0;
  const gstTax = adminOptions.gstTax || 0;
  const threshold = adminOptions.thresholdFee || 0;

  const totalProductPrice = cart
    .reduce((acc, item) => acc + item.originalPrice * item.qty, 0)
    .toFixed(2);

  const OverallProductDiscount = cart
    .reduce(
      (acc, item) =>
        acc +
        (item.originalPrice
          ? (item.originalPrice - item.discountPrice) * item.qty
          : 0),
      0
    )
    .toFixed(2);

  const calculateDeliveryFee = (total) => (total < threshold ? deliveryFee : 0);

  const sellerDeliveryFees = Object.entries(sellerAmounts).reduce(
    (acc, [shopId, { total }]) => {
      acc[shopId] = calculateDeliveryFee(total);
      return acc;
    },
    {}
  );

  const totalDeliveryFee = Object.values(sellerDeliveryFees).reduce(
    (acc, fee) => {
      return (parseFloat(acc) + parseFloat(fee)).toFixed(2);
    },
    0
  );

  const gstAmount = (
    ((parseFloat(totalProductPrice) - parseFloat(OverallProductDiscount)) *
      parseFloat(gstTax)) /
    100
  ).toFixed(2);

  const OverallProductPrice = (
    parseFloat(totalProductPrice) +
    parseFloat(gstAmount) -
    parseFloat(OverallProductDiscount) +
    parseFloat(totalDeliveryFee)
  ).toFixed(2);

  const suggestions = Object.values(sellerAmounts)
    .map(({ total, items }) => {
      const remainingAmount = threshold - total;
      if (remainingAmount > 0) {
        return {
          shopId: items[0].shopId,
          shopName: items[0].shop.name,
          remainingAmount,
        };
      }
      return null;
    })
    .filter((suggestion) => suggestion !== null);

  useEffect(() => {
    const orderData = {
      cart,
      totalProductPrice,
      OverallProductDiscount,
      totalDeliveryFee,
      gstAmount,
      OverallProductPrice,
      gstPercentage: gstTax,
      sellerDeliveryFees,
    };
    localStorage.setItem("latestOrder", JSON.stringify(orderData));
  }, [
    cart,
    totalProductPrice,
    OverallProductDiscount,
    totalDeliveryFee,
    gstAmount,
    OverallProductPrice,
    gstTax,
    sellerDeliveryFees,
  ]);

  const handleContinue = () => {
    try {
      const tshirtWithoutSize = cart.find((item) => !item.size);
      if (tshirtWithoutSize) {
        toast.error(
          `Please select the size of ${tshirtWithoutSize.name} in your cart.`
        );
        return;
      }
      const outOfStockItem = cart.find((item) => item.qty > item.stock);
      if (outOfStockItem) {
        toast.warning(
          `The quantity for ${outOfStockItem.name} exceeds the available stock.`
        );
        return;
      }
      navigate("/checkout");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-8">
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600">
            Add some products to your cart to see them here.
          </p>
          <Link to="/">
            <button className={`${styles.simpleButton} mt-4`}>
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-2/3 bg-white p-5 rounded-lg shadow-md mb-6 lg:mb-0 lg:mr-6">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row justify-between items-center border-b pb-4 mb-4"
              >
                <div className="flex items-center mb-4 md:mb-0">
                  <img
                    src={`${item?.images[0]?.url}`}
                    alt=""
                    className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </h4>
                    <p className="text-gray-600">₹{item.discountPrice}</p>
                    <p className="text-gray-600">Qty: {item.qty}</p>
                    <p className="text-gray-600">
                      Total: ₹{item.discountPrice * item.qty}
                    </p>
                    <button
                      onClick={() => handleEditClick(item)}
                      className="text-blue-500 mt-2"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => removeFromCartHandler(item)}
                      className="text-red-500 mt-2 ml-2"
                    >
                      REMOVE
                    </button>
                    <p className="text-gray-600">Sold by: {item.shop.name}</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  Delivery Fee: ₹
                  {calculateDeliveryFee(sellerAmounts[item.shopId].total)}
                </p>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-1/3 bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Price Details ({cart.length} Items)
            </h2>
            <div className="flex justify-between mb-2">
              <p>Total Product Price</p>
              <p>₹{totalProductPrice}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p>Overall Product Discount</p>
              <p>-₹{OverallProductDiscount}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p>Total Delivery Fee</p>
              <p>₹{totalDeliveryFee}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p>GST ({gstTax.toFixed(2)}%)</p>
              <p>₹{gstAmount}</p>
            </div>
            <div className="flex justify-between font-bold border-t pt-4 mt-4">
              <p>Overall Product Price</p>
              <p>₹{OverallProductPrice}</p>
            </div>
            <button
              onClick={handleContinue}
              className={`${styles.wideButton} mt-4`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-6 bg-yellow-100 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            Suggestions to avoid Delivery Fee
          </h3>
          {suggestions.map((suggestion) => (
            <div key={suggestion.shopId} className="mb-4">
              <p className="text-gray-800">
                Add products worth ₹{suggestion.remainingAmount} more from{" "}
                {suggestion.shopName} to avoid the delivery fee.
              </p>
            </div>
          ))}
        </div>
      )}

      {isEditSidebarOpen && (
        <div className="fixed inset-0 flex items-center justify-end z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative bg-white w-full md:w-1/3 h-full shadow-xl p-6">
            <RxCross1
              size={25}
              className="cursor-pointer absolute top-4 right-4"
              onClick={() => setIsEditSidebarOpen(false)}
            />
            <h2 className="text-2xl font-bold mb-6">Edit Item</h2>
            {selectedItem && (
              <>
                <div className="flex items-center mb-4">
                  <img
                    src={`${selectedItem?.images[0]?.url}`}
                    alt=""
                    className="w-20 h-20 rounded-lg mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedItem.name}
                    </h3>
                    <p className="text-gray-600">
                      ₹{selectedItem.discountPrice}
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <label className={`${styles.formLabel}`}>Size</label>
                  <select
                    value={size}
                    onChange={handleSizeChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Size</option>
                    {availableSizes.map((sizeOption) => (
                      <option key={sizeOption} value={sizeOption}>
                        {sizeOption}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className={`${styles.formLabel}`}>Quantity</label>
                  <div className="flex items-center mt-1">
                    <button
                      onClick={() => handleQuantityChange("decrease")}
                      className="px-2 py-0.5 border border-gray-300 rounded-lg"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="mx-2 w-20 text-center border-t border-b border-gray-300"
                    />
                    <button
                      onClick={() => handleQuantityChange("increase")}
                      className="px-2 py-0.5 border border-gray-300 rounded-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-lg font-semibold">Total Price</p>
                  <p className="text-lg font-semibold">
                    ₹{selectedItem.discountPrice * quantity}
                  </p>
                </div>
                <button
                  onClick={handleUpdateItem}
                  className={`${styles.wideButton}`}
                >
                  Update Item
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
