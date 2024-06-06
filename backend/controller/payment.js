const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post(
  "/process",
  catchAsyncErrors(async (req, res, next) => {
    const { amount, user, shippingAddress } = req.body;

    const myPayment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "inr",
      description: "Payment for your order", // Dynamic description based on the order
      metadata: {
        company: "CottonStyle",
      },
      shipping: {
        name: user.name, // Include the customer's name dynamically
        address: {
          line1: shippingAddress.address1, // Include the billing address dynamically
          city: shippingAddress.city,
          postal_code: shippingAddress.zipcode,
          country: shippingAddress.country, // India (IN)
        },
      },
    });

    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  })
);



router.get(
  "/stripe/apikey",
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
  })
);


// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Razorpay order creation
router.post("/create/orderId", catchAsyncErrors(async (req, res) => {
  try {
    const options = {
      amount: req.body.amount, // amount in the smallest currency unit
      currency: "INR",
      receipt: "receipt#" + Math.random(), // Generate a random receipt number
    };
    const order = await razorpay.orders.create(options);
    if (!order) return res.status(500).send("Some error occurred");
    res.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    res.status(500).send(error);
  }
}));

// Payment verification
router.post("/verify", (req, res) => {
  const secret = process.env.RAZORPAY_SECRET;

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(`${req.body.razorpay_order_id}|${req.body.razorpay_payment_id}`);
  const digest = shasum.digest("hex");

  if (digest === req.body.razorpay_signature) {
    res.json({ signatureIsValid: "true" });
  } else {
    res.json({ signatureIsValid: "false" });
  }
});
module.exports = router;
