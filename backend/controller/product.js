const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");

// Create a new product
router.post(
  "/create-product",
  catchAsyncErrors(async (req, res, next) => {
    const shopId = req.body.shopId;
    console.log(req);
    const shop = await Shop.findById(shopId);
    if (!shop) {
      console.error("Shop not found:", shopId); // Debug log
      return next(new ErrorHandler("Shop Id is invalid!", 400));
    }
    let images = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images); // If a single image, convert it to an array
    } else if (Array.isArray(req.body.images)) {
      images = req.body.images; // If multiple images, use them as is
    }
    const imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    const productData = { ...req.body, images: imagesLinks, shop };
    const product = await Product.create(productData);
    res.status(201).json({
      success: true,
      product,
    });
  })
);

// Update product
router.put(
  "/update-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorHandler("Product not found with this ID", 404));
    }
    const {
      name,
      description,
      fabric,
      color,
      originalPrice,
      discountPrice,
      stock,
      availableSizes,
      newImages, // New images to be uploaded
      oldImages, // Old images that were retained
    } = req.body;
    // Only update the images if new images are provided
    if (newImages && newImages.length > 0) {
      // First upload the new images to Cloudinary
      const imagesLinks = [];
      for (let i = 0; i < newImages.length; i++) {
        const result = await cloudinary.v2.uploader.upload(newImages[i], {
          folder: "products",
        });
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      // Combine old images that were retained with the newly uploaded images
      product.images = [...oldImages, ...imagesLinks];
    } else {
      product.images = oldImages; // If no new images, keep the old images as is
    }
    if (name) product.name = name;
    if (description) product.description = description;
    if (fabric) product.fabric = fabric;
    if (color) product.color = color;
    if (originalPrice) product.originalPrice = originalPrice;
    if (discountPrice) product.discountPrice = discountPrice;
    if (stock) product.stock = stock;
    if (availableSizes) product.availableSizes = availableSizes;
    await product.save();
    res.status(200).json({
      success: true,
      product,
    });
  })
);

// Get product details
router.get(
  "/get-product/:id",
  catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("Product not found with this ID", 404));
    }
    res.status(200).json({
      success: true,
      product,
    });
  })
);

// Get all products of a shop
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find({ shopId: req.params.id });
    res.status(200).json({
      success: true,
      products,
    });
  })
);

// Delete product of a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("Product not found with this ID", 404));
    }
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
    await product.deleteOne();
    res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
    });
  })
);

// Get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      products,
    });
  })
);

// Review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { user, rating, comment, productId, orderId } = req.body;
    const product = await Product.findById(productId);
    const review = {
      user,
      rating,
      comment,
      productId,
    };
    product.reviews.push(review);
    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
    product.ratings = avg / product.reviews.length;
    await product.save({ validateBeforeSave: false });
    // Update the order to mark the product as reviewed
    await Order.findByIdAndUpdate(
      orderId,
      { $set: { "cart.$[elem].isReviewed": true } },
      { arrayFilters: [{ "elem._id": productId }], new: true }
    );
    res.status(200).json({
      success: true,
      message: "Reviewed successfully!",
    });
  })
);

// All products (Admin)
router.get(
  "/admin-all-products",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      products,
    });
  })
);

module.exports = router;
