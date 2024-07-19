const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");
const CouponCode = require("../model/couponCode");

// Create Coupon Code
router.post(
  "/create-coupon-code",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const isCouponCodeExists = await CouponCode.find({ name: req.body.name });
    if (isCouponCodeExists.length !== 0) {
      return next(new ErrorHandler("Coupon code already exists!", 400));
    }
    const couponCode = await CouponCode.create(req.body);
    res.status(201).json({
      success: true,
      couponCode,
    });
  })
);

// Get all coupons of a shop
router.get(
  "/get-coupon/:id",
  catchAsyncErrors(async (req, res, next) => {
    const couponCodes = await CouponCode.find({ shopId: req.params.id });
    res.status(200).json({
      success: true,
      couponCodes,
    });
  })
);

// Delete Coupon Code of a shop
router.delete(
  "/delete-coupon/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    await CouponCode.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Coupon code deleted successfully!",
    });
  })
);

// Get Coupon Code value by its name
router.post(
  "/get-coupon-value",
  catchAsyncErrors(async (req, res, next) => {
    const { name, cart } = req.body;
    const couponCode = await CouponCode.findOne({ name });
    if (!couponCode) {
      return res.status(404).json({
        success: false,
        message: "Coupon code doesn't exist!",
      });
    }
    const shopId = couponCode.shopId;
    const couponCodeValue = couponCode.value;
    const minAmount = couponCode.minAmount;
    const maxAmount = couponCode.maxAmount;
    // Filter items that belong to the specified shop
    const isCouponValid = cart.filter((item) => item.shopId === shopId);
    if (isCouponValid.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is not valid for this shop",
      });
    }
    // Calculate the total price of items from the specified shop
    const totalPrice = isCouponValid.reduce(
      (acc, item) => acc + item.qty * item.discountPrice,
      0
    );
    if (totalPrice < minAmount || totalPrice > maxAmount) {
      return res.status(400).json({
        success: false,
        message: `Coupon code is not valid for this amount. Total price should be between ${minAmount} and ${maxAmount}`,
      });
    }
    // Calculate the discount based on the eligible price
    const couponDiscount = (totalPrice * couponCodeValue) / 100;
    res.status(200).json({
      success: true,
      couponCode: {
        name: couponCode.name,
        value: couponCodeValue,
        shopId: couponCode.shopId,
        discount: couponDiscount.toFixed(2),
      },
    });
  })
);

module.exports = router;
