const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Razorpay order creation
router.post(
  "/create/orderId",
  catchAsyncErrors(async (req, res, next) => {
    const options = {
      amount: req.body.amount, // amount in the smallest currency unit
      currency: "INR",
      // receipt: "receipt#" + Math.random(), // Generate a random receipt number
    };
    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).json({ message: "Some error occurred" });
    }
    res.json({ orderId: order.id, amount: order.amount });
  })
);

// Payment verification
router.post(
  "/verify",
  catchAsyncErrors((req, res, next) => {
    const secret = process.env.RAZORPAY_SECRET;
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(
      `${req.body.razorpay_order_id}|${req.body.razorpay_payment_id}`
    );
    const digest = shasum.digest("hex");
    if (digest === req.body.razorpay_signature) {
      res.json({ signatureIsValid: "true" });
    } else {
      res.status(400).json({ signatureIsValid: "false" });
    }
  })
);

module.exports = router;
