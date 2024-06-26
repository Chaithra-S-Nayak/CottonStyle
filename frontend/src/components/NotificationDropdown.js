import React from "react";
import { useNotifications } from "../context/NotificationContext";

const NotificationDropdown = () => {
  const { notifications, markAsRead } = useNotifications();

  // Sort notifications so that unread ones appear first
  const sortedNotifications = [...notifications].sort(
    (a, b) => a.isRead - b.isRead
  );

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50">
      <div className="p-4">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <ul className="max-h-64 overflow-y-auto">
          {sortedNotifications.length === 0 && <li>No notifications!</li>}
          {sortedNotifications.map((notification) => (
            <li
              key={notification._id}
              className={`p-2 ${
                notification.isRead ? "text-gray-500" : "font-bold"
              }`}
            >
              <p>{notification.message}</p>
              {!notification.isRead && (
                <button
                  onClick={() => markAsRead(notification._id)}
                  className="text-blue-500 text-sm"
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationDropdown;
