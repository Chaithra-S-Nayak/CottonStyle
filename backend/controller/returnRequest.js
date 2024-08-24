const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");
const Order = require("../model/order");
const ReturnRequest = require("../model/returnRequest");

router.post(
  "/create-return-request",
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

module.exports = router;
