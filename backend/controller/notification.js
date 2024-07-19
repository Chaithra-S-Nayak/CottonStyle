const express = require("express");
const router = express.Router();
const Notification = require("../model/notification");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isSeller, isAdmin } = require("../middleware/auth");

// Get Notifications based on context
router.get(
  "/",
  catchAsyncErrors(async (req, res, next) => {
    const { context } = req.query; // 'context' will be 'seller' or 'admin'
    let notifications = [];
    if (context === "seller") {
      await new Promise((resolve, reject) => {
        isSeller(req, res, async (err) => {
          if (err) return reject(err);
          if (req.seller) {
            notifications = await Notification.find({ shopId: req.seller._id });
            resolve();
          } else {
            reject(
              new ErrorHandler("Invalid context or authentication failed", 400)
            );
          }
        });
      });
    } else if (context === "admin") {
      await new Promise((resolve, reject) => {
        isAdmin(req, res, async (err) => {
          if (err) return reject(err);
          if (req.admin) {
            notifications = await Notification.find({ adminId: req.admin._id });
            resolve();
          } else {
            reject(
              new ErrorHandler("Invalid context or authentication failed", 400)
            );
          }
        });
      });
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

// Mark notification as read based on context
router.put(
  "/:id/mark-as-read",
  catchAsyncErrors(async (req, res, next) => {
    const { context } = req.query; // 'context' will be 'seller' or 'admin'
    let notification;
    if (context === "seller") {
      await new Promise((resolve, reject) => {
        isSeller(req, res, async (err) => {
          if (err) return reject(err);
          if (req.seller) {
            notification = await Notification.findOne({
              _id: req.params.id,
              shopId: req.seller._id,
            });
            resolve();
          } else {
            reject(
              new ErrorHandler("Invalid context or authentication failed", 400)
            );
          }
        });
      });
    } else if (context === "admin") {
      await new Promise((resolve, reject) => {
        isAdmin(req, res, async (err) => {
          if (err) return reject(err);
          if (req.admin) {
            notification = await Notification.findOne({
              _id: req.params.id,
              adminId: req.admin._id,
            });
            resolve();
          } else {
            reject(
              new ErrorHandler("Invalid context or authentication failed", 400)
            );
          }
        });
      });
    } else {
      return next(
        new ErrorHandler("Invalid context or authentication failed", 400)
      );
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
