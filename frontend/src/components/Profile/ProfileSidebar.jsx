import React from "react";
import { AiOutlineLogin } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { MdOutlineTrackChanges } from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate();
  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  return (
    <div className="w-full border bg-white rounded-[10px] p-4 pt-8">
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(1)}
      >
        <RxPerson size={20} color={active === 1 ? "green" : ""} />
        <span
          className={`pl-3 ${
            active === 1 ? "text-[green]" : ""
          } 800px:block hidden`}
        >
          Profile
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(2)}
      >
        <HiOutlineShoppingBag size={20} color={active === 2 ? "green" : ""} />
        <span
          className={`pl-3 ${
            active === 2 ? "text-[green]" : ""
          } 800px:block hidden`}
        >
          Orders
        </span>
      </div>
      {/* <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(3)}
      >
        <HiOutlineReceiptRefund size={20} color={active === 3 ? "green" : ""} />
        <span
          className={`pl-3 ${
            active === 3 ? "text-[green]" : ""
          } 800px:block hidden`}
        >
          Refunds
        </span>
      </div> */}
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(4)}
      >
        <MdOutlineTrackChanges size={20} color={active === 4 ? "green" : ""} />
        <span
          className={`pl-3 ${
            active === 4 ? "text-[green]" : ""
          } 800px:block hidden`}
        >
          Track Order
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(5)}
      >
        <RiLockPasswordLine size={20} color={active === 5 ? "green" : ""} />
        <span
          className={`pl-3 ${
            active === 5 ? "text-[green]" : ""
          } 800px:block hidden`}
        >
          Change Password
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(6)}
      >
        <TbAddressBook size={20} color={active === 6 ? "green" : ""} />
        <span
          className={`pl-3 ${
            active === 6 ? "text-[green]" : ""
          } 800px:block hidden`}
        >
          Address
        </span>
      </div>
      <div
        className="single_item flex items-center cursor-pointer w-full mb-8"
        onClick={logoutHandler}
      >
        <AiOutlineLogin size={20} color={active === 7 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active === 7 ? "text-[red]" : ""
          } 800px:block hidden`}
        >
          Log out
        </span>
      </div>
    </div>
  );
};

export default ProfileSidebar;
