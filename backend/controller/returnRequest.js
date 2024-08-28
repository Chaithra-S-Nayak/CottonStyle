const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");
const Order = require("../model/order");
const Product = require("../model/product");
const { isAdmin, isAuthenticated } = require("../middleware/auth");
const ReturnRequest = require("../model/returnRequest");

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
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const returnRequest = await ReturnRequest.findById(req.params.id);

    if (!returnRequest) {
      return next(new ErrorHandler("Return Request not found", 404));
    }

    res.status(200).json({
      success: true,
      returnRequest,
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
