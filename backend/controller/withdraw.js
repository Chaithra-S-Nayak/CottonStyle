const express = require("express");
const Shop = require("../model/shop");
const Withdraw = require("../model/withdraw");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendMail = require("../utils/sendMail");
const { isSeller, isAdmin } = require("../middleware/auth");
const router = express.Router();
const {
  generateEmailTemplate,
  getWithdrawRequestEmailTemplate,
  getWithdrawConfirmationEmailTemplate,
} = require("../utils/emailTemplates");

// Create withdraw request (seller)
router.post(
  "/create-withdraw-request",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const { amount } = req.body;
    const data = {
      seller: req.seller,
      amount,
    };
    const withdrawRequestEmailContent = generateEmailTemplate({
      recipientName: req.seller.name,
      bodyContent: getWithdrawRequestEmailTemplate(amount),
    });
    await sendMail({
      email: req.seller.email,
      subject: "Withdraw Request",
      html: withdrawRequestEmailContent,
    });
    const withdraw = await Withdraw.create(data);
    const shop = await Shop.findById(req.seller._id);
    shop.availableBalance -= amount;
    await shop.save();
    res.status(201).json({
      success: true,
      withdraw,
    });
  })
);

// Get all withdraws (Admin)
router.get(
  "/get-all-withdraw-request",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const withdraws = await Withdraw.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      withdraws,
    });
  })
);

// Update withdraw request (Admin)
router.put(
  "/update-withdraw-request/:id",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const { sellerId } = req.body;
    const withdraw = await Withdraw.findByIdAndUpdate(
      req.params.id,
      {
        status: "succeeded",
        updatedAt: Date.now(),
      },
      { new: true }
    );
    const seller = await Shop.findById(sellerId);
    const transaction = {
      _id: withdraw._id,
      amount: withdraw.amount,
      updatedAt: withdraw.updatedAt,
      status: withdraw.status,
    };
    seller.transactions.push(transaction);
    await seller.save();
    const withdrawConfirmationEmailContent = generateEmailTemplate({
      recipientName: seller.name,
      bodyContent: getWithdrawConfirmationEmailTemplate(withdraw.amount),
    });
    await sendMail({
      email: seller.email,
      subject: "Payment Confirmation",
      html: withdrawConfirmationEmailContent,
    });
    res.status(200).json({
      success: true,
      withdraw,
    });
  })
);

module.exports = router;
