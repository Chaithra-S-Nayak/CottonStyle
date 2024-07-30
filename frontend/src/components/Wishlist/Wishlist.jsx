import React from "react";
import { RxCross1 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs";
import styles from "../../styles/styles";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { deleteWishlistItem } from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { Link } from "react-router-dom";

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
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
        {wishlist && wishlist.orderItems && wishlist.orderItems.length === 0 ? (
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
              <div className={`${styles.noramlFlex} p-4`}>
                <AiOutlineHeart size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {wishlist &&
                    wishlist.orderItems &&
                    wishlist.orderItems.length}{" "}
                  items
                </h5>
              </div>

              {/* Wishlist Single Items */}
              <br />
              <div className="w-full border-t">
                {wishlist &&
                  wishlist.orderItems &&
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
      <div className="w-full 800px:flex items-center justify-between">
        <div className="flex items-center">
          <RxCross1
            className="cursor-pointer 800px:mb-['unset'] 800px:ml-['unset'] mb-2 ml-2"
            onClick={() => removeFromWishlistHandler(data.product._id)}
          />
          <img
            src={`${data.product.images[0]?.url}`}
            alt=""
            className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
          />
          <div className="pl-[5px]">
            <Link
              to={`/product/${data.product._id}`}
              className="text-blue-500 hover:underline"
            >
              <h1>{data.product.name}</h1>
            </Link>
            <h4 className="pt-3 800px:pt-[3px] text-[15px] font-Roboto">
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
