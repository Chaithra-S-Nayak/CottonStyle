const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");
const ReturnRequest = require("../model/returnRequest");
const Shop = require("../model/shop");
const sendNotification = require("../utils/notification");
const sendMail = require("../utils/sendMail");

// Create return or exchange request
router.post(
  "/create-return-request",
  catchAsyncErrors(async (req, res, next) => {
    try {
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
      let imageFiles = [];

      if (typeof images === "string") {
        imageFiles.push(images);
      } else {
        imageFiles = images;
      }

      const imagesLinks = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const result = await cloudinary.v2.uploader.upload(imageFiles[i], {
          folder: "return_requests",
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      // Create return request
      const returnRequest = await ReturnRequest.create({
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

      const sellerHtmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0;">
          <div style="max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
            <div style="text-align: center; padding: 10px; background-color: #f4f4f4; border-bottom: 1px solid #ccc;">
              <div style="font-size: 20px; font-weight: 300; margin: 0;">CottonStyle</div>
            </div>
            <p>Hello ${seller.name},</p>
            <p>A return/exchange request has been made for the following order:</p>
            <p>Order ID: ${orderId}</p>
            <p>Product ID: ${productId}</p>
            <p>Reason: ${reason}</p>
            <p>Request Type: ${requestType}</p>
            <div style="text-align: center; padding: 10px; background-color: #f4f4f4; border-top: 1px solid #ccc; font-size: 12px; color: #999;">
              <p>&copy; 2024 CottonStyle. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendMail({
        email: seller.email,
        subject: "Return/Exchange Request Notification",
        message: `A return/exchange request has been made for Order ID: ${orderId}, Product ID: ${productId}`,
        html: sellerHtmlContent,
      });

      // Notification for Admin
      const adminHtmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0;">
          <div style="max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
            <div style="text-align: center; padding: 10px; background-color: #f4f4f4; border-bottom: 1px solid #ccc;">
              <div style="font-size: 20px; font-weight: 300; margin: 0;">CottonStyle</div>
            </div>
            <p>Hello Admin,</p>
            <p>A return/exchange request has been made for the following order:</p>
            <p>Order ID: ${orderId}</p>
            <p>Product ID: ${productId}</p>
            <p>Reason: ${reason}</p>
            <p>Request Type: ${requestType}</p>
            <div style="text-align: center; padding: 10px; background-color: #f4f4f4; border-top: 1px solid #ccc; font-size: 12px; color: #999;">
              <p>&copy; 2024 CottonStyle. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendMail({
        email: process.env.ADMIN_EMAIL,
        subject: "Return/Exchange Request Notification",
        message: `A return/exchange request has been made for Order ID: ${orderId}, Product ID: ${productId}`,
        html: adminHtmlContent,
      });

      await sendNotification(
        "return_request",
        `Return/exchange request for Order ID: ${orderId}, Product ID: ${productId}`,
        process.env.ADMIN_ID,
        null
      );

      res.status(201).json({
        success: true,
        message: "Return/exchange request created successfully.",
      });
    } catch (error) {
      console.error("Error creating return/exchange request:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
