import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useOnClickOutside } from "usehooks-ts";
import styles from "../../styles/styles";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import Navbar from "./Navbar";
import { useSelector, useDispatch } from "react-redux";
import Wishlist from "../Wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";
import logo from "../../Assets/TshirtGalaxy.png";
import { getWishlist } from "../../redux/actions/wishlist";

const Header = ({ activeHeading }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim()) {
      const filteredProducts =
        allProducts &&
        allProducts.filter((product) =>
          product.name.toLowerCase().includes(term.toLowerCase())
        );
      setSearchData(filteredProducts);
      setDropdownVisible(true);
    } else {
      setSearchData(null);
      setDropdownVisible(false);
    }
  };

  const handleClickOutside = () => {
    setDropdownVisible(false); // Hide dropdown on outside click
  };

  useOnClickOutside(dropdownRef, handleClickOutside);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 95) {
        setActive(true);
      } else {
        setActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (openWishlist) {
      dispatch(getWishlist());
    }
  }, [openWishlist, dispatch]);

  return (
    <>
      {/* Desktop Header */}
      <div className={`${styles.section}`}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          <div className="mr-2">
            <Link to="/">
              <img src={logo} alt="Logo" className="w-auto h-16" />
            </Link>
          </div>
          {/* search box */}
          <div className="w-[50%] relative mr-2" ref={dropdownRef}>
            <input
              type="text"
              placeholder="Search Product"
              value={searchTerm}
              onChange={handleSearchChange}
              className={`${styles.formInput}`}
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-2 top-1.5 cursor-pointer"
            />
            {dropdownVisible && searchData && searchData.length !== 0 ? (
              <div className="absolute min-h-[30vh] max-h-[60vh] overflow-y-scroll border bg-slate-50 shadow-sm-2 z-[9] p-4">
                {searchData &&
                  searchData.map((i, index) => {
                    return (
                      <Link to={`/product/${i._id}`} key={index}>
                        <div className="w-full flex items-start-py-3 m-2">
                          <img
                            src={`${i.images[0]?.url}`}
                            alt=""
                            className="w-[40px] h-[40px] mr-[10px]"
                          />
                          <h1>{i.name}</h1>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            ) : null}
          </div>

          <button className={`${styles.simpleButton} mr-2`}>
            <Link to={`${isSeller ? "/dashboard" : "/shop-create"}`}>
              {isSeller ? "Seller Dashboard" : "Become Seller"}
            </Link>
          </button>
        </div>
      </div>
      <div
        className={`${
          active
            ? `shadow-sm fixed top-0 left-0 z-10  bg-${styles.primaryColor} transition-all duration-300`
            : `bg-${styles.primaryColor}`
        } transition hidden 800px:flex items-center justify-between w-full h-[70px]`}
      >
        <div
          className={`${styles.section} relative ${styles.normalFlex} justify-between`}
        >
          {/* navitems */}
          <div className={`${styles.normalFlex}`}>
            <Navbar active={activeHeading} />
          </div>

          <div className="flex">
            <div className={`${styles.normalFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenWishlist(true)}
              >
                <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {wishlist?.orderItems?.length || 0}
                </span>
              </div>
            </div>

            <div className={`${styles.normalFlex}`}>
              <Link to="/cart">
                <div className="relative cursor-pointer mr-[15px]">
                  <AiOutlineShoppingCart
                    size={30}
                    color="rgb(255 255 255 / 83%)"
                  />
                  <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                    {cart && cart.length}
                  </span>
                </div>
              </Link>
            </div>

            <div className={`${styles.normalFlex}`}>
              <div className="relative cursor-pointer mr-[15px]">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <img
                      src={`${user?.avatar?.url}`}
                      className="w-[35px] h-[35px] rounded-full"
                      alt=""
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                  </Link>
                )}
              </div>
            </div>

            {/* wishlist popup */}
            {openWishlist ? (
              <Wishlist setOpenWishlist={setOpenWishlist} />
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div
        className={`${
          active
            ? "shadow-sm fixed top-0 left-0 z-10 bg-[#fff] transition-all duration-300"
            : "bg-[#fff] transition-all duration-300"
        } w-full h-[60px] z-50 top-0 left-0 flex items-center justify-between 800px:hidden`}
      >
        <div className="flex items-center w-full px-4">
          <div className="flex-grow text-center">
            <Link to="/">
              <img src={logo} alt="Logo" className="w-auto h-12" />
            </Link>
          </div>

          {/* Menu Icon */}
          <div onClick={() => setOpen(!open)}>
            {open ? <RxCross1 size={30} /> : <BiMenuAltLeft size={30} />}
          </div>
        </div>

        {/* Navbar */}
        {open ? (
          <div className="fixed w-full bg-[#fff] z-10 top-0 left-0 min-h-full flex flex-col justify-between">
            <div>
              <div className="relative flex justify-end items-center mt-4 mr-4 cursor-pointer">
                {open ? (
                  <RxCross1 size={30} onClick={() => setOpen(!open)} />
                ) : (
                  <BiMenuAltLeft size={30} onClick={() => setOpen(!open)} />
                )}
              </div>

              <div className="my-8 w-[92%] m-auto h-[40px] relative">
                <input
                  type="text"
                  placeholder="Search Product"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className={`${styles.formInput}`}
                />
                <AiOutlineSearch
                  size={30}
                  className="absolute right-2 top-1.5 cursor-pointer"
                />
                {dropdownVisible && searchData && searchData.length !== 0 ? (
                  <div className="absolute min-h-[30vh] max-h-[60vh] overflow-y-scroll bg-slate-50 shadow-sm-2 z-[9] p-4">
                    {searchData &&
                      searchData.map((i, index) => {
                        return (
                          <Link to={`/product/${i._id}`} key={index}>
                            <div className="w-full flex items-start-py-3 m-2">
                              <img
                                src={`${i.images[0]?.url}`}
                                alt=""
                                className="w-[40px] h-[40px] mr-[10px]"
                              />
                              <h1>{i.name}</h1>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                ) : null}
              </div>
              <Navbar active={activeHeading} />
              <div className="px-4">
                <button className={`${styles.simpleButton} mb-4`}>
                  <Link to={`${isSeller ? "/dashboard" : "/shop-create"}`}>
                    <h1 className="text-[#fff] flex items-center">
                      {isSeller ? "Seller Dashboard" : "Become Seller"}
                      <IoIosArrowForward className="ml-1" />
                    </h1>
                  </Link>
                </button>

                <div className="flex gap-3">
                  {/* Wishlist Icon */}
                  <div
                    className="relative mr-[15px] cursor-pointer"
                    onClick={() => setOpenWishlist(true)}
                  >
                    <AiOutlineHeart size={30} />
                    <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 text-white font-mono text-[12px] leading-tight text-center">
                      {wishlist?.orderItems?.length || 0}
                    </span>
                  </div>

                  {/* Wishlist Popup */}
                  {openWishlist && (
                    <Wishlist setOpenWishlist={setOpenWishlist} />
                  )}

                  {/* Cart Icon */}
                  <Link to="/cart">
                    <div className="relative mr-[20px]">
                      <AiOutlineShoppingCart size={30} />
                      <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 text-white font-mono text-[12px] leading-tight text-center">
                        {cart && cart.length}
                      </span>
                    </div>
                  </Link>

                  {/* User Icon */}
                  <div className="relative mr-[10px]">
                    {isAuthenticated ? (
                      <Link to="/profile">
                        <img
                          src={`${user?.avatar?.url}`}
                          className="w-[35px] h-[35px] rounded-full"
                          alt=""
                        />
                      </Link>
                    ) : (
                      <Link to="/login">
                        <CgProfile size={30} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Header;
