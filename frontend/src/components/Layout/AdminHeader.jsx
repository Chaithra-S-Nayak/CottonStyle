import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../Assets/CottonStyle.png";
import { logoutAdmin } from "../../redux/actions/admin";
import NotificationIcon from "../../components/NotificationIcon";
import { NotificationProvider } from "../../context/NotificationContext";
import { FiLogOut } from "react-icons/fi";
import { FaBars, FaTimes } from "react-icons/fa";

const AdminHeader = () => {
  const { admin } = useSelector((state) => state.admin);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      dispatch(logoutAdmin());
      navigate("/admin-login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <NotificationProvider context="admin">
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
            <Link to="/admin/dashboard" className="800px:block hidden">
              <span
                className={`text-lg mx-5 cursor-pointer ${
                  isActive("/admin/dashboard") ? "text-[green]" : "text-[#555]"
                }`}
              >
                Dashboard
              </span>
            </Link>
            <Link to="/admin-products" className="800px:block hidden">
              <span
                className={`text-lg mx-5 cursor-pointer ${
                  isActive("/admin-products") ? "text-[green]" : "text-[#555]"
                }`}
              >
                All Products
              </span>
            </Link>
            <Link to="/admin-orders" className="800px:block hidden">
              <span
                className={`text-lg mx-5 cursor-pointer ${
                  isActive("/admin-orders") ? "text-[green]" : "text-[#555]"
                }`}
              >
                All Orders
              </span>
            </Link>
            <Link to="/admin-sellers" className="800px:block hidden">
              <span
                className={`text-lg mx-5 cursor-pointer ${
                  isActive("/admin-sellers") ? "text-[green]" : "text-[#555]"
                }`}
              >
                All Sellers
              </span>
            </Link>
            <Link to="/admin-users" className="800px:block hidden">
              <span
                className={`text-lg mx-5 cursor-pointer ${
                  isActive("/admin-users") ? "text-[green]" : "text-[#555]"
                }`}
              >
                All Users
              </span>
            </Link>
            <Link to="/admin-withdraw-request" className="800px:block hidden">
              <span
                className={`text-lg mx-5 cursor-pointer ${
                  isActive("/admin-withdraw-request")
                    ? "text-[green]"
                    : "text-[#555]"
                }`}
              >
                Withdraw Request
              </span>
            </Link>

            <Link to="/admin-options" className="800px:block hidden">
              <span
                className={`text-lg mx-5 cursor-pointer ${
                  isActive("/admin-options") ? "text-[green]" : "text-[#555]"
                }`}
              >
                Platform Configuration
              </span>
            </Link>
          </div>
          <NotificationIcon />
          <Link to="/admin-profile" className="flex items-center">
            <img
              src={`${admin?.avatar?.url}`}
              alt="avatar"
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
          </Link>
          <button onClick={handleLogout} className="flex items-center ml-4">
            <FiLogOut size={30} color="crimson" />
          </button>
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
              <Link
                to="/admin/dashboard"
                className="my-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span
                  className={`text-lg cursor-pointer ${
                    isActive("/admin/dashboard")
                      ? "text-[green]"
                      : "text-[#555]"
                  }`}
                >
                  Dashboard
                </span>
              </Link>
              <Link
                to="/admin-products"
                className="my-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span
                  className={`text-lg cursor-pointer ${
                    isActive("/admin-products") ? "text-[green]" : "text-[#555]"
                  }`}
                >
                  All Products
                </span>
              </Link>
              <Link
                to="/admin-orders"
                className="my-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span
                  className={`text-lg cursor-pointer ${
                    isActive("/admin-orders") ? "text-[green]" : "text-[#555]"
                  }`}
                >
                  All Orders
                </span>
              </Link>
              <Link
                to="/admin-sellers"
                className="my-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span
                  className={`text-lg cursor-pointer ${
                    isActive("/admin-sellers") ? "text-[green]" : "text-[#555]"
                  }`}
                >
                  All Sellers
                </span>
              </Link>
              <Link
                to="/admin-users"
                className="my-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span
                  className={`text-lg cursor-pointer ${
                    isActive("/admin-users") ? "text-[green]" : "text-[#555]"
                  }`}
                >
                  All Users
                </span>
              </Link>
              <Link
                to="/admin-withdraw-request"
                className="my-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span
                  className={`text-lg cursor-pointer ${
                    isActive("/admin-withdraw-request")
                      ? "text-[green]"
                      : "text-[#555]"
                  }`}
                >
                  Withdraw Request
                </span>
              </Link>
              <Link
                to="/admin-options"
                className="my-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span
                  className={`text-lg cursor-pointer ${
                    isActive("/admin-options") ? "text-[green]" : "text-[#555]"
                  }`}
                >
                  Platform Configuration
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </NotificationProvider>
  );
};

export default AdminHeader;
