import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../Assets/CottonStyle.png";
import { logoutAdmin } from "../../redux/actions/admin";
import NotificationIcon from "../../components/NotificationIcon";
import { NotificationProvider } from "../../context/NotificationContext";
import { FiLogOut } from "react-icons/fi";

const AdminHeader = () => {
  const { admin } = useSelector((state) => state.admin);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      dispatch(logoutAdmin());
      navigate("/admin-login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
          <div className="flex items-center mr-4">
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
            <NotificationIcon />
            <Link to="/admin-profile">
              <img
                src={`${admin?.avatar?.url}`}
                alt="avatar"
                className="w-[50px] h-[50px] rounded-full object-cover"
              />
            </Link>
          </div>
          <button onClick={handleLogout} className="flex items-center ">
            <FiLogOut size={30} color="crimson" />
          </button>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default AdminHeader;
