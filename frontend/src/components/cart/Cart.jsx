import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTocart, removeFromCart } from "../../redux/actions/cart";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const quantityChangeHandler = (data) => {
    dispatch(addTocart(data));
  };

  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setQuantity(item.qty);
    setSize(item.size || ""); // assuming item has a size property
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

  // Function to calculate total product price
  const totalProductPrice = cart.reduce(
    (acc, item) => {
      console.log("Item used in totalProductPrice calculation:", item);
      return acc + item.discountPrice * item.qty;
    },
    0
  );

  // Function to calculate total discount
  const totalDiscount = cart.reduce(
    (acc, item) =>
      acc +
      (item.originalPrice ? (item.originalPrice - item.discountPrice) * item.qty : 0),
    0
  );

  // Function to calculate additional fees
  const additionalFees = cart.reduce((acc, item) => acc + item.deliveryFee, 0);

  // Function to calculate order total
  const orderTotal = totalProductPrice - totalDiscount + additionalFees;

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row">
        {/* Product Details */}
        <div className="w-full lg:w-2/3 bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Product Details</h2>
          {/* Iterate through cart items */}
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-4 mb-4"
            >
              <div className="flex items-center">
                <button
                  onClick={() => handleEditClick(item)}
                  className="text-blue-500 mt-2"
                >
                  EDIT
                </button>
                <img
                  src={`${item?.images[0]?.url}`}
                  alt=""
                  className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">{item.name}</h4>
                  <p className="text-gray-600">₹{item.discountPrice}</p>
                  <p className="text-gray-600">Qty: {item.qty}</p>
                  <button
                    onClick={() => removeFromCartHandler(item)}
                    className="text-red-500 mt-2"
                  >
                    REMOVE
                  </button>
                  <p className="text-gray-600">Sold by: {item.shop.name}</p>
                </div>
              </div>
              <p className="text-gray-600">Delivery Fee: ₹{item.deliveryFee}</p>
            </div>
          ))}
        </div>
        {/* Price Details */}
        <div className="w-full lg:w-1/3 bg-white p-5 rounded-lg shadow-md mt-6 lg:mt-0 lg:ml-6">
          <h2 className="text-2xl font-bold mb-4">Price Details ({cart.length} Items)</h2>
          {/* Display price details */}
          <div className="flex justify-between mb-2">
            <p>Total Product Price</p>
            <p>₹{totalProductPrice}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p>Total Discounts</p>
            <p>-₹{totalDiscount}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p>Additional Fees</p>
            <p>₹{additionalFees}</p>
          </div>
          <div className="flex justify-between font-bold border-t pt-4 mt-4">
            <p>Order Total</p>
            <p>₹{orderTotal}</p>
          </div>
          <Link to="/checkout">
                <button className="mt-6 w-full bg-[#243450] text-white py-2 rounded">
            Continue
          </button>
              </Link>
          
        </div>
      </div>
      {/* Edit Sidebar */}
      {isEditSidebarOpen && (
        <div className="fixed inset-0 flex items-center justify-end z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative bg-white w-full md:w-1/3 h-full shadow-xl p-6">
            <button
              className="absolute top-4 right-4 text-gray-600"
              onClick={() => setIsEditSidebarOpen(false)}
            >
              &times;
            </button>
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
                    <h3 className="text-lg font-semibold">{selectedItem.name}</h3>
                    <p className="text-gray-600">₹{selectedItem.discountPrice}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Size
                  </label>
                  <select
                    value={size}
                    onChange={handleSizeChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Size</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
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
                  <p className="text-lg font-semibold">₹{selectedItem.discountPrice * quantity}</p>
                </div>
                <button
                  onClick={handleUpdateItem}
                  className="w-full bg-[#243450] text-white py-2 rounded-lg"
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
