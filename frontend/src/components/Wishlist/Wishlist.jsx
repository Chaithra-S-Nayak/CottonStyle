import React from "react";
import { RxCross1 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs";
import styles from "../../styles/styles";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { deleteWishlistItem } from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist, loading } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (productId) => {
    dispatch(deleteWishlistItem(productId));
  };

  const addToCartHandler = (data) => {
    const newData = { ...data, qty: 1 };
    dispatch(addTocart(newData));
    setOpenWishlist(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[90%] overflow-y-scroll 800px:w-[30%] bg-white flex flex-col justify-between shadow-sm">
        {loading ? (
          <Loader />
        ) : (
          <>
            {wishlist &&
            wishlist.orderItems &&
            wishlist.orderItems.length === 0 ? (
              <div className="w-full h-screen flex items-center justify-center">
                <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
                  <RxCross1
                    size={25}
                    className="cursor-pointer"
                    onClick={() => setOpenWishlist(false)}
                  />
                </div>
                <h5>Wishlist Items is empty!</h5>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex w-full justify-end pt-5 pr-5">
                    <RxCross1
                      size={25}
                      className="cursor-pointer"
                      onClick={() => setOpenWishlist(false)}
                    />
                  </div>
                  {/* Item length */}
                  <div className={`${styles.normalFlex} p-4`}>
                    <AiOutlineHeart size={25} />
                    <h5 className="pl-2 text-[20px] font-[500]">
                      {wishlist.orderItems?.length || 0} items
                    </h5>
                  </div>

                  {/* Wishlist Single Items */}
                  <br />
                  <div className="w-full border-t">
                    {wishlist.orderItems &&
                      wishlist.orderItems.map((item, index) => (
                        <WishlistItem
                          key={index}
                          data={item}
                          removeFromWishlistHandler={removeFromWishlistHandler}
                          addToCartHandler={addToCartHandler}
                        />
                      ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const WishlistItem = ({
  data,
  removeFromWishlistHandler,
  addToCartHandler,
}) => {
  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center justify-between">
        <div className={`${styles.normalFlex}`}>
          <RxCross1
            className="cursor-pointer mb-2 ml-2"
            onClick={() => removeFromWishlistHandler(data.product._id)}
          />
          <img
            src={`${data.product.images[0]?.url}`}
            alt=""
            className="w-[80px] h-[80px] ml-2 mr-2 rounded-[5px]"
          />
          <div className="pl-[5px] flex-1">
            <Link
              to={`/product/${data.product._id}`}
              className="text-blue-500 hover:underline"
            >
              <h1 className="text-sm md:text-base">{data.product.name}</h1>
            </Link>
            <h4 className="pt-1 text-[15px] font-Roboto">
              ₹{data.product.discountPrice}
            </h4>
          </div>
        </div>
        <div className="mr-2">
          <BsCartPlus
            size={20}
            className="cursor-pointer"
            title="Add to cart"
            onClick={() => addToCartHandler(data.product)}
          />
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
