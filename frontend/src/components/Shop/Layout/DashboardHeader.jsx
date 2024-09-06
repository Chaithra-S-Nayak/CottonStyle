import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { BiMenuAltLeft } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import logo from "../../../Assets/TshirtGalaxy.png";
import NotificationIcon from "../../../components/NotificationIcon";
import { NotificationProvider } from "../../../context/NotificationContext";
import { useOnClickOutside } from "usehooks-ts";
import styles from "../../../styles/styles";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = () => {
    setIsMenuOpen(false);
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

  return (
    <NotificationProvider context="seller">
      <div
        className={`${
          active
            ? "shadow-sm fixed top-0 left-0 z-10 bg-white transition-all duration-300"
            : "bg-white"
        } transition flex items-center justify-between w-full h-[70px] px-4`}
      >
        <Link to="/">
          <img src={logo} alt="Logo" className="w-auto h-16" />
        </Link>

        <div className={`${styles.normalFlex}`}>
          <div className="hidden 1000px:flex items-center mr-4">
            {/* Links for larger screens */}
            <Link to="/dashboard">
              <span
                className={`text-md mx-3 cursor-pointer ${
                  isActive("/dashboard") ? "text-[green]" : "text-[#555]"
                }`}
              >
                Dashboard
              </span>
            </Link>
            {/* Additional Links */}
            <Link to="/dashboard-coupons">
              <span
                className={`text-md mx-3 cursor-pointer ${
                  isActive("/dashboard-coupons")
                    ? "text-[green]"
                    : "text-[#555]"
                }`}
              >
                Coupon Codes
              </span>
            </Link>
            <Link to="/dashboard-create-product">
              <span
                className={`text-md mx-3 cursor-pointer ${
                  isActive("/dashboard-create-product")
                    ? "text-[green]"
                    : "text-[#555]"
                }`}
              >
                Create Product
              </span>
            </Link>
            <Link to="/dashboard-refunds">
              <span
                className={`text-md mx-3 cursor-pointer ${
                  isActive("/dashboard-refunds")
                    ? "text-[green]"
                    : "text-[#555]"
                }`}
              >
                Return Requests
              </span>
            </Link>
            <Link to="/seller-change-password">
              <span
                className={`text-md mx-3 cursor-pointer ${
                  isActive("/seller-change-password")
                    ? "text-[green]"
                    : "text-[#555]"
                }`}
              >
                Change Password
              </span>
            </Link>
          </div>
          <NotificationIcon />
          <Link to={`/shop/${seller._id}`} className={`${styles.normalFlex}`}>
            <img
              src={seller.avatar?.url}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
          </Link>
          {/* BiMenuAltLeft icon for mobile screens */}
          <div className="1000px:hidden ml-4" onClick={toggleMenu}>
            <BiMenuAltLeft size={30} />
          </div>
        </div>
      </div>
      {/* Mobile Menu Sidebar */}
      {isMenuOpen && (
        <div className="fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0">
          <div
            className="fixed w-[70%] bg-white h-screen top-0 left-0 z-10 overflow-y-scroll"
            ref={dropdownRef}
          >
            <div className="w-full flex justify-between items-center p-4">
              <RxCross1
                size={30}
                className="text-[#000]"
                onClick={toggleMenu}
              />
            </div>
            <div className="flex flex-col items-start p-4">
              {/* Links for mobile screens */}
              <Link to="/dashboard" className="my-2" onClick={toggleMenu}>
                <span
                  className={`text-md cursor-pointer ${
                    isActive("/dashboard") ? "text-[green]" : "text-[#555]"
                  }`}
                >
                  Dashboard
                </span>
              </Link>
              {/* Additional Links */}
              <Link
                to="/dashboard-coupons"
                className="my-2"
                onClick={toggleMenu}
              >
                <span
                  className={`text-md cursor-pointer ${
                    isActive("/dashboard-coupons")
                      ? "text-[green]"
                      : "text-[#555]"
                  }`}
                >
                  Coupon Codes
                </span>
              </Link>
              <Link
                to="/dashboard-create-product"
                className="my-2"
                onClick={toggleMenu}
              >
                <span
                  className={`text-md cursor-pointer ${
                    isActive("/dashboard-create-product")
                      ? "text-[green]"
                      : "text-[#555]"
                  }`}
                >
                  Create Product
                </span>
              </Link>
              <Link
                to="/dashboard-refunds"
                className="my-2"
                onClick={toggleMenu}
              >
                <span
                  className={`text-md cursor-pointer ${
                    isActive("/dashboard-refunds")
                      ? "text-[green]"
                      : "text-[#555]"
                  }`}
                >
                  Return Requests
                </span>
              </Link>
              <Link
                to="/seller-change-password"
                className="my-2"
                onClick={toggleMenu}
              >
                <span
                  className={`text-md cursor-pointer ${
                    isActive("/seller-change-password")
                      ? "text-[green]"
                      : "text-[#555]"
                  }`}
                >
                  Change Password
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </NotificationProvider>
  );
};

export default DashboardHeader;
