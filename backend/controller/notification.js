const express = require("express");
const router = express.Router();
const Notification = require("../model/notification");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");

router.get(
  "/",
  isAuthenticated,
  isSeller, 
  catchAsyncErrors(async (req, res, next) => {
    const { context } = req.query; // 'context' will be 'seller' or 'admin'
    let notifications = [];

    if (context === "seller" && req.seller) {
      // Fetch notifications for seller
      notifications = await Notification.find({ shopId: req.seller._id });
      console.log(
        "Fetched Notifications for Shop:",
        req.seller._id,
        notifications
      );
    } else if (context === "admin" && req.user) {
      // Fetch notifications for admin/user
      notifications = await Notification.find({ userId: req.user._id });
      console.log(
        "Fetched Notifications for User:",
        req.user._id,
        notifications
      );
    } else {
      return next(
        new ErrorHandler("Invalid context or authentication failed", 400)
      );
    }

    res.status(200).json({
      success: true,
      notifications,
    });
  })
);

router.put(
  "/:id/mark-as-read",
  isAuthenticated,
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const { context } = req.query; // 'context' will be 'seller' or 'admin'
    let notification;

    if (context === "seller" && req.seller) {
      notification = await Notification.findOne({
        _id: req.params.id,
        shopId: req.seller._id,
      });
    } else if (context === "admin" && req.user) {
      notification = await Notification.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });
    }

    if (!notification) {
      return next(new ErrorHandler("Notification not found", 404));
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      notification,
    });
  })
);

module.exports = router;

router.put(
  "/:id/mark-as-read",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return next(new ErrorHandler("Notification not found", 404));
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      notification,
    });
  })
);

module.exports = router;
