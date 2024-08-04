const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated } = require("../middleware/auth");
const cloudinary = require("cloudinary");
const ReturnRequest = require("../model/returnRequest");
const Shop = require("../model/shop");
const Admin = require("../model/admin");
const sendNotification = require("../utils/notification");
const sendMail = require("../utils/sendMail");
const {
  generateEmailTemplate,
  getReturnRequestEmailTemplate,
} = require("../utils/emailTemplates");

// Create return or exchange request
router.post(
  "/create-return-request",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { orderId, productId, shopId, reason, requestType, images } =
      req.body;
    if (
      !orderId ||
      !productId ||
      !shopId ||
      !reason ||
      !requestType ||
      !images
    ) {
      return next(new ErrorHandler("All fields are required", 400));
    }
    // Upload images to Cloudinary
    let imageFiles = Array.isArray(images) ? images : [images];
    const imagesLinks = await Promise.all(
      imageFiles.map(async (image) => {
        const result = await cloudinary.v2.uploader.upload(image, {
          folder: "return_requests",
        });
        return {
          public_id: result.public_id,
          url: result.secure_url,
        };
      })
    );
    // Create return request
    await ReturnRequest.create({
      orderId,
      productId,
      shopId,
      reason,
      requestType,
      images: imagesLinks,
    });
    // Notification for Seller
    const seller = await Shop.findById(shopId);
    if (!seller) {
      return next(new ErrorHandler("Seller not found", 404));
    }
    const bodyContent = getReturnRequestEmailTemplate(
      orderId,
      productId,
      reason,
      requestType
    );
    const sellerEmailContent = generateEmailTemplate({
      recipientName: seller.name,
      bodyContent,
    });
    await sendMail({
      email: seller.email,
      subject: "Return/Exchange Request Notification",
      html: sellerEmailContent,
    });
    // Notification for Admin
    const adminEmailContent = generateEmailTemplate({
      recipientName: "Admin",
      bodyContent,
    });
    const admin = await Admin.findOne();
    await sendMail({
      email: admin.email,
      subject: "Return/Exchange Request Notification",
      html: adminEmailContent,
    });
    await sendNotification(
      "return_request",
      `Return/exchange request for Order ID: ${orderId}, Product ID: ${productId}`,
      admin._id,
      null
    );
    res.status(201).json({
      success: true,
      message: "Return/exchange request created successfully.",
    });
  })
);

module.exports = router;
