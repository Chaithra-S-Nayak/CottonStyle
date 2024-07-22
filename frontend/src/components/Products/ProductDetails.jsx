import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAdminOptions } from "../../redux/actions/adminOptions";
import { getAllProductsShop } from "../../redux/actions/product";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Ratings";

const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { products } = useSelector((state) => state.products);
  const { adminOptions } = useSelector((state) => state.adminOptions);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(data && data?.shop._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data, wishlist, dispatch]);

  useEffect(() => {
    dispatch(fetchAdminOptions());
  }, [dispatch]);

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.warning("Product stock limited!");
      } else if (!selectedSize) {
        toast.info("Please select a size!");
      } else if (count > data.stock) {
        toast.warning("Selected quantity exceeds available stock!");
      } else {
        const cartData = { ...data, qty: count, size: selectedSize };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg = totalRatings / totalReviewsLength || 0;

  const averageRating = avg.toFixed(2);

  return (
    <div className="bg-white p-4">
      {data ? (
        <div className="flex flex-col lg:flex-row w-full lg:w-4/5 mx-auto gap-6">
          {/* Left side - Product images */}
          <div className="lg:w-1/2 lg:pr-20">
            <img
              src={data.images[select]?.url}
              alt=""
              className="w-full h-auto"
            />
            <div className="flex gap-2 mt-2">
              {data.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt=""
                  className={`w-20 h-20 object-cover cursor-pointer ${
                    select === index && "border-2 border-gray-500"
                  }`}
                  onClick={() => setSelect(index)}
                />
              ))}
            </div>
          </div>

          {/* Right side - Product details */}
          <div className="lg:w-1/2 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{data.name}</h1>
              <div className="py-4 flex items-center justify-between">
                <div className="flex items-baseline space-x-2">
                  <h2 className="text-[32px] font-normal text-gray-600">
                    ₹
                    {data.originalPrice === 0
                      ? data.originalPrice
                      : data.discountPrice}
                  </h2>
                  {data.originalPrice !== 0 && (
                    <h2 className="text-xl text-gray-500 line-through">
                      ₹{data.originalPrice}
                    </h2>
                  )}
                </div>
              </div>
              <div className="flex items-center ">
                <div className="bg-green-500  p-1 rounded-lg">
                  <span className=" font-bold text-white ">
                    {data.ratings}★
                  </span>
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  {data.reviews.length} Reviews | {data.sold_out} sold |{" "}
                  {data.stock} stock
                </span>
              </div>
              {data.stock < 1 && (
                <div className="text-red-500 mt-2">Out of Stock</div>
              )}
            </div>
            <div className="mt-4">
              <div className="space-y-2">
                <label className="block text-gray-700">Select Size</label>
                <div className="grid grid-cols-8 gap-2">
                  {data.availableSizes.map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSizeSelection(size)}
                      className={`px-2 py-1 border rounded text-gray-700 ${
                        selectedSize === size ? "bg-gray-300" : ""
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center mt-4">
              <button
                className="px-4 py-2 bg-[#243450] text-white rounded-l"
                onClick={decrementCount}
                disabled={data.stock < 1}
              >
                -
              </button>
              <span className="px-4 py-2 bg-gray-200 text-gray-800">
                {count}
              </span>
              <button
                className="px-4 py-2 bg-[#243450] text-white rounded-r"
                onClick={incrementCount}
                disabled={data.stock < 1}
              >
                +
              </button>
              <button
                className="mx-4 px-4 py-2 bg-[#243450] text-white rounded w-1/2"
                onClick={() => addToCartHandler(data._id)}
                disabled={data.stock < 1}
              >
                Add to Cart
                <AiOutlineShoppingCart className="inline-block ml-2" />
              </button>
              <button
                onClick={() =>
                  click
                    ? removeFromWishlistHandler(data)
                    : addToWishlistHandler(data)
                }
              >
                {click ? (
                  <AiFillHeart size={30} className="text-red-500" />
                ) : (
                  <AiOutlineHeart size={30} className="text-gray-500" />
                )}
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Product Details</h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {data.description}
                </p>
                <p className="text-gray-600 whitespace-pre-line mt-2">
                  Fabric : {data.fabric}
                </p>
                <p className="text-gray-600 whitespace-pre-line">
                  Color : {data.color}
                </p>
                {adminOptions.sizeChart &&
                  adminOptions.sizeChart.length > 0 && (
                    <div className="mt-2 text-gray-600">
                      <p>Sizes :</p>
                      <ul>
                        {adminOptions.sizeChart.map((size, idx) => (
                          <li key={idx}>
                            {size.size} (Chest Size: {size.chestSize} in, Waist
                            Size:
                            {size.waistSize} in, Length Size: {size.lengthSize}
                            in)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>

              <div>
                <h2 className="text-lg font-semibold">Seller Information</h2>
                <div className="flex items-center">
                  <img
                    src={data.shop.avatar.url}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-3">
                    <h4 className="font-medium">{data.shop.name}</h4>
                    <p className="text-sm text-gray-500">
                      ({averageRating}/5) Ratings
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-gray-600">{data.shop.description}</p>
                <button
                  onClick={() => navigate(`/shop/preview/${data?.shop._id}`)}
                  className="mt-4 px-4 py-2 bg-[#243450] text-white rounded"
                >
                  Visit Shop to get Coupons
                </button>
              </div>

              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">
                    Product Ratings & Reviews
                  </h2>
                </div>

                <div>
                  {data &&
                    data.reviews.map((item, index) => (
                      <div key={index} className="w-full flex my-4">
                        <img
                          src={`${item.user.avatar?.url}`}
                          alt=""
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="ml-4">
                          <div className="flex items-center mb-1">
                            <h3 className="text-lg font-semibold">
                              {item.user.name}
                            </h3>
                            <span className="ml-2">
                              <Ratings rating={item.rating} />
                            </span>
                          </div>
                          <p className="text-gray-700">{item.comment}</p>
                        </div>
                      </div>
                    ))}

                  {data && data.reviews.length === 0 && (
                    <div className="mt-4">
                      <h5>No Reviews!</h5>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetails;
