const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAdmin } = require("../middleware/auth");
const AdminOptions = require("../model/adminOptions");

// Get Admin Options
router.get(
  "/admin-options",
  catchAsyncErrors(async (req, res, next) => {
    const options = await AdminOptions.findOne();
    if (!options) {
      return res.status(404).json({
        success: false,
        error: "Admin options not found",
      });
    }
    res.status(200).json({
      success: true,
      options,
    });
  })
);

// Update Admin Options (Admin)
router.put(
  "/admin-options",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const options = await AdminOptions.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
      upsert: true,
    });
    res.status(200).json({
      success: true,
      options,
    });
  })
);

module.exports = router;
