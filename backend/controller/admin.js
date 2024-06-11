const express = require("express");
const router = express.Router();
const Admin = require("../model/admin");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { isAdmin } = require("../middleware/auth");
const cloudinary = require("cloudinary");
const sendAdminToken = require("../utils/sendAdminToken");

// Generate OTP
const generateOtp = () => {
  const otp = crypto.randomInt(100000, 999999).toString();
  return otp;
};

// Admin login endpoint
router.post(
  "/login-admin",
  catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide all fields!", 400));
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return next(new ErrorHandler("Admin doesn't exist!", 400));
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return next(new ErrorHandler("Invalid credentials!", 400));
    }

    const otp = generateOtp();
    admin.otp = otp;
    admin.otpExpiry = Date.now() + 300000; // OTP expires in 5 minutes
    await admin.save();

    try {
      await sendMail({
        email: admin.email,
        subject: "Admin Login OTP",
        message: `Your OTP for admin login is: ${otp}. It will expire in 5 minutes.`,
      });
      res.status(200).json({
        success: true,
        message: "OTP sent to registered email",
      });
    } catch (error) {
      admin.otp = undefined;
      admin.otpExpiry = undefined;
      await admin.save();
      return next(new ErrorHandler("Error sending OTP email", 500));
    }
  })
);

// Verify OTP endpoint
router.post(
  "/verify-admin-otp",
  catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;

    let admin = await Admin.findOne({ email }).select("+otp +otpExpiry");

    if (!admin) {
      return next(new ErrorHandler("Admin not found", 404));
    }

    if (admin.otp === otp && admin.otpExpiry > Date.now()) {
      admin.otp = undefined;
      admin.otpExpiry = undefined;
      await admin.save();

      sendAdminToken(admin, 200, res);
    } else {
      return next(new ErrorHandler("Invalid or expired OTP", 400));
    }
  })
);

// Forgot password endpoint
router.post(
  "/forgot-password",
  catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return next(new ErrorHandler("Admin not found", 404));
    }

    const otp = generateOtp();
    admin.otp = otp;
    admin.otpExpiry = Date.now() + 300000; // OTP expires in 5 minutes
    await admin.save();

    try {
      await sendMail({
        email: admin.email,
        subject: "Password Reset OTP",
        message: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`,
      });
      res.status(200).json({
        success: true,
        message: "OTP sent to email",
      });
    } catch (error) {
      admin.otp = undefined;
      admin.otpExpiry = undefined;
      await admin.save();
      return next(new ErrorHandler("Error sending OTP email", 500));
    }
  })
);

// Verify forgot password OTP endpoint
router.post(
  "/verify-forgot-password-otp",
  catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;

    const admin = await Admin.findOne({ email }).select("+otp +otpExpiry");

    if (!admin) {
      return next(new ErrorHandler("Admin not found", 404));
    }

    if (admin.otp === otp && admin.otpExpiry > Date.now()) {
      res.status(200).json({
        success: true,
        message: "OTP is valid. You can now reset your password.",
      });
    } else {
      return next(new ErrorHandler("Invalid or expired OTP", 400));
    }
  })
);

// Reset password endpoint
router.post(
  "/reset-password",
  catchAsyncErrors(async (req, res, next) => {
    const { email, newPassword } = req.body;
    const admin = await Admin.findOne({ email }).select("+otp +otpExpiry");

    if (!admin) {
      return next(new ErrorHandler("Admin not found", 404));
    }

    admin.password = newPassword;
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  })
);

// Logout admin
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    res.cookie("admin_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  })
);

// Update admin info
router.put(
  "/update-admin-info",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const { email, name } = req.body;

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return next(new ErrorHandler("Admin not found", 404));
    }

    admin.name = name;
    admin.email = email;

    await admin.save();

    res.status(200).json({
      success: true,
      admin,
    });
  })
);

// Update admin avatar
router.put(
  "/update-avatar",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const { avatar } = req.body;

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return next(new ErrorHandler("Admin not found", 404));
    }

    if (avatar !== "") {
      const imageId = admin.avatar.public_id;
      await cloudinary.v2.uploader.destroy(imageId);

      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
      });

      admin.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    await admin.save();

    res.status(200).json({
      success: true,
      admin,
    });
  })
);

module.exports = router;
