import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../Assets/CottonStyle.png";
import NotificationIcon from "../../../components/NotificationIcon";
import { NotificationProvider } from "../../../context/NotificationContext";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <NotificationProvider context="seller">
      <div className="w-full h-[70px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
        <div>
          <Link to="/">
            <img src={logo} alt="Logo" className="w-auto h-16" />
          </Link>
        </div>
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <Link to="/dashboard" className="800px:block hidden">
              <span
                className={`text-lg mx-5 cursor-pointer ${
                  isActive("/dashboard") ? "text-[green]" : "text-[#555]"
                }`}
              >
                Dashboard
              </span>
            </Link>
            <Link to="/dashboard-coupons" className="800px:block hidden">
              <span
                className={`text-lg mx-5 cursor-pointer ${
                  isActive("/dashboard-coupons")
                    ? "text-[green]"
                    : "text-[#555]"
                }`}
              >
                Coupon Codes
              </span>
            </Link>
            {/* <Link to="/dashboard-events" className="800px:block hidden">
              <span
                className={`text-lg mx-5 cursor-pointer ${
                  isActive("/dashboard-events") ? "text-[green]" : "text-[#555]"
                }`}
              >
                All Events
              </span>
            </Link> */}
            <Link to="/dashboard-products" className="800px:block hidden">
              <span
                className={`text-lg mx-5 cursor-pointer ${
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
                className={`text-lg mx-5 cursor-pointer ${
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
                className={`text-lg mx-5 cursor-pointer ${
                  isActive("/dashboard-orders") ? "text-[green]" : "text-[#555]"
                }`}
              >
                All Orders
              </span>
            </Link>
            <Link to="/dashboard-refunds" className="800px:block hidden">
              <span
                className={`text-lg mx-5 cursor-pointer ${
                  isActive("/dashboard-refunds") ? "text-[green]" : "text-[#555]"
                }`}
              >
                Refunds
              </span>
            </Link>
            <Link to="/update-shop" className="800px:block hidden">
              <span
                className={`text-lg mx-5 cursor-pointer ${
                  isActive("/update-shop") ? "text-[green]" : "text-[#555]"
                }`}
              >
                Update Shop
              </span>
            </Link>
            <Link to="/seller-change-password" className="800px:block hidden">
              <span
                className={`text-lg mx-5 cursor-pointer ${
                  isActive("/seller-change-password") ? "text-[green]" : "text-[#555]"
                }`}
              >
                Change Password
              </span>
            </Link>
            {/* <Link to="/dashboard-messages" className="800px:block hidden">
              <span
                className={`text-lg mx-5 cursor-pointer ${
                  isActive("/dashboard-messages")
                    ? "text-[green]"
                    : "text-[#555]"
                }`}
              >
                Shop Inbox
              </span>
            </Link> */}
            <NotificationIcon />
            <Link to={`/shop/${seller._id}`}>
              <img
                src={`${seller.avatar?.url}`}
                alt=""
                className="w-[50px] h-[50px] rounded-full object-cover"
              />
            </Link>
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default DashboardHeader;
