const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");
const Order = require("../model/order");
const Product = require("../model/product");
const { isAdmin, isAuthenticated, isSeller } = require("../middleware/auth");
const ReturnRequest = require("../model/returnRequest");
const Admin = require("../model/admin");
const Shop = require("../model/shop");
const {
  getReturnRequestEmailTemplate,
  generateEmailTemplate,
} = require("../utils/emailTemplates");
const sendNotification = require("../utils/notification");
const sendMail = require("../utils/sendMail");

// Route to create a return request
router.post(
  "/create-return-request",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const productsWithImages = [];
    // Iterate over the products and handle images for each
    for (let product of req.body.products) {
      let imagesLinks = [];
      if (product.images && product.images.length > 0) {
        for (let i = 0; i < product.images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(
            product.images[i],
            {
              folder: "products",
            }
          );
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      }

      productsWithImages.push({
        ...product,
        images: imagesLinks,
        coupon: product.coupon || {},
      });
    }

    // Create the return request with products and their images
    const returnRequestData = {
      orderId: req.body.orderId,
      shopId: req.body.shopId,
      userId: req.user._id,
      product: productsWithImages,
    };

    const returnRequest = await ReturnRequest.create(returnRequestData);

    // Update the order status and attach return request details
    const order = await Order.findById(req.body.orderId);
    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    order.status = "Processing return request";
    order.returnOrExchange = {
      returnRequestId: returnRequest._id,
      requestType: req.body.products[0].requestType,
    };

    await order.save();

    // Send notification and email to the admin
    const admin = await Admin.findOne();
    const adminEmailTemplate = getReturnRequestEmailTemplate(
      req.body.orderId,
      req.body.shopId,
      req.user._id
    );

    const adminHtmlContent = generateEmailTemplate({
      recipientName: "Admin",
      bodyContent: adminEmailTemplate,
    });

    try {
      await sendNotification(
        "return-request",
        `New return request created for Order ID: ${req.body.orderId}`,
        admin._id,
        null
      );

      await sendMail({
        email: admin.email,
        subject: "New Return Request",
        html: adminHtmlContent,
      });
    } catch (mailError) {
      console.error("Error notifying admin:", mailError);
    }

    // Send notification and email to the corresponding seller
    const shop = await Shop.findById(req.body.shopId);
    const sellerNotificationContent = `New return request created for Order ID: ${req.body.orderId}`;
    const sellerHtmlContent = generateEmailTemplate({
      recipientName: shop.name,
      bodyContent: adminEmailTemplate,
    });

    try {
      await sendNotification(
        "return-request",
        sellerNotificationContent,
        null,
        shop._id
      );

      await sendMail({
        email: shop.email,
        subject: "New Return Request",
        html: sellerHtmlContent,
      });
    } catch (mailError) {
      console.error("Error notifying seller:", mailError);
    }

    res.status(201).json({
      success: true,
      returnRequest,
    });
  })
);

// Route to check product availability
router.post(
  "/check-product-availability",
  catchAsyncErrors(async (req, res, next) => {
    const { productId } = req.body;

    // Check if the product exists in the database
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found. Please select the return option to get a refund.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product is available for exchange.",
    });
  })
);

router.get(
  "/get-all-return-requests",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const returnRequests = await ReturnRequest.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      returnRequests,
    });
  })
);

router.get(
  "/get-return-request/:id",
  catchAsyncErrors(async (req, res, next) => {
    const returnRequestId = req.params.id;
    const returnRequest = await ReturnRequest.findById(returnRequestId);

    if (!returnRequest) {
      return res.status(404).json({
        success: false,
        message: "Return request not found",
      });
    }

    const order = await Order.findById(returnRequest.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Send both the return request and order status
    res.status(200).json({
      success: true,
      returnRequest,
      orderStatus: order.status,
    });
  })
);

router.get(
  "/get-all-return-requests-of-shop",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const shopId = req.seller._id;
    const returnRequests = await ReturnRequest.find({ shopId });
    res.status(200).json({
      success: true,
      returnRequests,
    });
  })
);

router.put(
  "/update-return-request-status/:id",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const { status } = req.body;

    const returnRequest = await ReturnRequest.findById(req.params.id);

    if (!returnRequest) {
      return next(new ErrorHandler("Return Request not found", 404));
    }

    returnRequest.status = status;
    await returnRequest.save();

    res.status(200).json({
      success: true,
      message: "Return Request status updated successfully",
    });
  })
);

module.exports = router;
