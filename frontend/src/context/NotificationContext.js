import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { server } from "../server";

const NotificationContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children, context }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(
          `${server}/notifications?context=${context}`,
          {
            withCredentials: true,
          }
        );
        // console.log("Fetched Notifications:", data.notifications);
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n) => !n.isRead).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [context]);

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${server}/notifications/${id}/mark-as-read?context=${context}`,
        null,
        {
          withCredentials: true,
        }
      );
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(unreadCount - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
