import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BiMenuAltLeft } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import logo from "../../Assets/TshirtGalaxy.png";
import NotificationIcon from "../../components/NotificationIcon";
import { NotificationProvider } from "../../context/NotificationContext";
import { FiLogOut } from "react-icons/fi";
import { useOnClickOutside } from "usehooks-ts";
import { logoutAdmin } from "../../redux/actions/admin";
import styles from "../../styles/styles";

const AdminHeader = () => {
  const { admin } = useSelector((state) => state.admin);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState(false);
  const dropdownRef = useRef(null);

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
    <NotificationProvider context="admin">
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
        <div className={`${styles.noramlFlex}`}>
          <div className="hidden 800px:flex items-center mr-4">
            <Link to="/admin/dashboard">
              <span
                className={`text-md mx-3 cursor-pointer ${
                  isActive("/admin/dashboard") ? "text-[green]" : "text-[#555]"
                }`}
              >
                Dashboard
              </span>
            </Link>
            <Link to="/admin-products">
              <span
                className={`text-md mx-3 cursor-pointer ${
                  isActive("/admin-products") ? "text-[green]" : "text-[#555]"
                }`}
              >
                All Products
              </span>
            </Link>
            <Link to="/admin-users">
              <span
                className={`text-md mx-3 cursor-pointer ${
                  isActive("/admin-users") ? "text-[green]" : "text-[#555]"
                }`}
              >
                All Users
              </span>
            </Link>
            <Link to="/admin-withdraw-request">
              <span
                className={`text-md mx-3 cursor-pointer ${
                  isActive("/admin-withdraw-request")
                    ? "text-[green]"
                    : "text-[#555]"
                }`}
              >
                Withdraw Request
              </span>
            </Link>
            <Link to="/admin-options">
              <span
                className={`text-md mx-3 cursor-pointer ${
                  isActive("/admin-options") ? "text-[green]" : "text-[#555]"
                }`}
              >
                Platform Configuration
              </span>
            </Link>
          </div>
          <NotificationIcon />
          <Link to="/admin-profile" className={`${styles.noramlFlex}`}>
            <img
              src={admin?.avatar?.url}
              alt="avatar"
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
          </Link>
          <div className="hidden 800px:flex items-center mr-4">
            {/* Logout Button for Desktop View */}
            <button
              onClick={handleLogout}
              className="flex items-center ml-4 text-red-500"
            >
              <FiLogOut size={30} />
            </button>
          </div>
          {/* Mobile Menu Icon */}
          <div className="800px:hidden ml-2" onClick={toggleMenu}>
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
              <Link to="/admin/dashboard" className="my-2" onClick={toggleMenu}>
                <span
                  className={`text-md cursor-pointer ${
                    isActive("/admin/dashboard")
                      ? "text-[green]"
                      : "text-[#555]"
                  }`}
                >
                  Dashboard
                </span>
              </Link>
              <Link to="/admin-products" className="my-2" onClick={toggleMenu}>
                <span
                  className={`text-md cursor-pointer ${
                    isActive("/admin-products") ? "text-[green]" : "text-[#555]"
                  }`}
                >
                  All Products
                </span>
              </Link>
              <Link to="/admin-users" className="my-2" onClick={toggleMenu}>
                <span
                  className={`text-md cursor-pointer ${
                    isActive("/admin-users") ? "text-[green]" : "text-[#555]"
                  }`}
                >
                  All Users
                </span>
              </Link>
              <Link
                to="/admin-withdraw-request"
                className="my-2"
                onClick={toggleMenu}
              >
                <span
                  className={`text-md cursor-pointer ${
                    isActive("/admin-withdraw-request")
                      ? "text-[green]"
                      : "text-[#555]"
                  }`}
                >
                  Withdraw Request
                </span>
              </Link>
              <Link to="/admin-options" className="my-2" onClick={toggleMenu}>
                <span
                  className={`text-md cursor-pointer ${
                    isActive("/admin-options") ? "text-[green]" : "text-[#555]"
                  }`}
                >
                  Platform Configuration
                </span>
              </Link>
              {/* Logout Button for Mobile View */}
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="flex items-center mt-4 text-red-500"
              >
                <FiLogOut size={30} />
                <span className="ml-2 text-md">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationProvider>
  );
};

export default AdminHeader;
