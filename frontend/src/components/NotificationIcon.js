import React, { useState } from "react";
import { FiBell } from "react-icons/fi";
import { useNotifications } from "../context/NotificationContext";
import NotificationDropdown from "./NotificationDropdown";

const NotificationIcon = () => {
  const { unreadCount } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleIconClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="relative">
      <div className="mx-5 cursor-pointer" onClick={handleIconClick}>
        <FiBell size={30} />
        {unreadCount > 0 && (
          <span className="mx-5 absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
            {unreadCount}
          </span>
        )}
      </div>
      {showDropdown && <NotificationDropdown />}
    </div>
  );
};

export default NotificationIcon;
