const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Wishlist = require("../model/wishlist");

// Helper function to find a wishlist item
const findWishlistItem = (wishlist, productId) => {
  return wishlist.orderItems.some(
    (item) => item.product.toString() === productId
  );
};

// Create or update wishlist
router.post(
  "/create-wishlist",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { user, orderItems } = req.body;
    const productId = orderItems[0].product;
    let wishlist = await Wishlist.findOne({ user });
    if (wishlist) {
      if (findWishlistItem(wishlist, productId)) {
        return next(new ErrorHandler("Product already added in Wishlist", 404));
      }
      wishlist.orderItems.push(orderItems[0]);
    } else {
      wishlist = new Wishlist({ user, orderItems });
    }
    await wishlist.save();
    res.status(200).json({ success: true });
  })
);

// Remove item from wishlist
router.put(
  "/delete-wishlist",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { productId } = req.body;
    const userId = req.user.id;
    const result = await Wishlist.updateOne(
      { user: userId },
      { $pull: { orderItems: { product: productId } } }
    );
    if (result.modifiedCount === 0) {
      return next(new ErrorHandler("Product not found in the wishlist", 404));
    }
    res.status(200).json({ success: true });
  })
);

// Get wishlist
router.get(
  "/get-wishlist",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id;
    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "orderItems.product"
    );
    res.status(200).json({ success: true, wishlist });
  })
);

module.exports = router;
