import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../../../Assets/CottonStyle.png";
import NotificationIcon from "../../../components/NotificationIcon";
import { NotificationProvider } from "../../../context/NotificationContext";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <NotificationProvider context="seller">
      <div className="w-full h-[70px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
        <div>
          <Link to="/">
            <img src={logo} alt="Logo" className="w-auto h-16" />
          </Link>
        </div>
        <div className="flex items-center">
          <div className="800px:hidden flex items-center">
            <button onClick={toggleMenu} className="text-2xl">
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          <div className="hidden 800px:flex items-center mr-4">
            <Link to="/dashboard" className="800px:block hidden">
              <span
                className={`text-md mx-3 cursor-pointer ${
                  isActive("/dashboard") ? "text-[green]" : "text-[#555]"
                }`}
              >
                Dashboard
              </span>
            </Link>
            <Link to="/dashboard-coupons" className="800px:block hidden">
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
            <Link to="/dashboard-products" className="800px:block hidden">
              <span
                className={`text-md mx-3 cursor-pointer ${
                  isActive("/dashboard-products")
                    ? "text-[green]"
                    : "text-[#555]"
                }`}
              >
                All Products
              </span>
            </Link>
            <Link to="/dashboard-create-product" className="800px:block hidden">
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
            <Link to="/dashboard-orders" className="800px:block hidden">
              <span
                className={`text-md mx-3 cursor-pointer ${
                  isActive("/dashboard-orders") ? "text-[green]" : "text-[#555]"
                }`}
              >
                All Orders
              </span>
            </Link>
            <Link to="/dashboard-refunds" className="800px:block hidden">
              <span
                className={`text-md mx-3 cursor-pointer ${
                  isActive("/dashboard-refunds")
                    ? "text-[green]"
                    : "text-[#555]"
                }`}
              >
                Refunds
              </span>
            </Link>
            <Link to="/update-shop" className="800px:block hidden">
              <span
                className={`text-md mx-3 cursor-pointer ${
                  isActive("/update-shop") ? "text-[green]" : "text-[#555]"
                }`}
              >
                Update Shop
              </span>
            </Link>
            <Link to="/seller-change-password" className="800px:block hidden">
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
          <Link to={`/shop/${seller._id}`} className="flex items-center">
            <img
              src={`${seller.avatar?.url}`}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
          </Link>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      {isMenuOpen && (
        <div className="fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0">
          <div className="fixed w-[70%] bg-[#fff] h-screen top-0 left-0 z-10 overflow-y-scroll">
            <div className="w-full flex justify-between items-center p-4">
              <FaTimes
                size={30}
                className="text-[#000]"
                onClick={() => setIsMenuOpen(false)}
              />
            </div>
            <div className="flex flex-col items-start p-4">
              <Link to="/dashboard" className="my-2">
                <span
                  className={`text-md cursor-pointer ${
                    isActive("/dashboard") ? "text-[green]" : "text-[#555]"
                  }`}
                >
                  Dashboard
                </span>
              </Link>
              <Link to="/dashboard-coupons" className="my-2">
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
              <Link to="/dashboard-products" className="my-2">
                <span
                  className={`text-md cursor-pointer ${
                    isActive("/dashboard-products")
                      ? "text-[green]"
                      : "text-[#555]"
                  }`}
                >
                  All Products
                </span>
              </Link>
              <Link to="/dashboard-create-product" className="my-2">
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
              <Link to="/dashboard-orders" className="my-2">
                <span
                  className={`text-md cursor-pointer ${
                    isActive("/dashboard-orders")
                      ? "text-[green]"
                      : "text-[#555]"
                  }`}
                >
                  All Orders
                </span>
              </Link>
              <Link to="/dashboard-refunds" className="my-2">
                <span
                  className={`text-md cursor-pointer ${
                    isActive("/dashboard-refunds")
                      ? "text-[green]"
                      : "text-[#555]"
                  }`}
                >
                  Refunds
                </span>
              </Link>
              <Link to="/update-shop" className="my-2">
                <span
                  className={`text-md cursor-pointer ${
                    isActive("/update-shop") ? "text-[green]" : "text-[#555]"
                  }`}
                >
                  Update Shop
                </span>
              </Link>
              <Link to="/seller-change-password" className="my-2">
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
