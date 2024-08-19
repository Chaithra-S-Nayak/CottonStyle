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
    const { orderId, productIds, shopId, reason, requestType } = req.body;
    if (!orderId || !productIds || !shopId || !reason || !requestType) {
      return next(new ErrorHandler("All fields are required", 400));
    }
    let images = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else if (Array.isArray(req.body.images)) {
      images = req.body.images;
    }
    const imagesLinks = [];
    // Upload images to Cloudinary
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    // Create return request
    await ReturnRequest.create({
      orderId,
      productIds,
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
      productIds.join(", "),
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
      `Return/exchange request for Order ID: ${orderId}, Product IDs: ${productIds.join(
        ", "
      )}`,
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
