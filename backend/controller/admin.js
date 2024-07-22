const express = require("express");
const router = express.Router();
const Admin = require("../model/admin");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");
const { isAdmin } = require("../middleware/auth");
const cloudinary = require("cloudinary");
const sendAdminToken = require("../utils/sendAdminToken");
const {
  generateEmailTemplate,
  getOtpEmailTemplate,
  getAdminLoginOtpEmailTemplate,
} = require("../utils/emailTemplates");

// Load Admin profile
router.get(
  "/load",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const admin = await Admin.findById(req.admin.id);
    res.status(200).json({ admin });
  })
);

// Generate OTP
const generateOtp = () => crypto.randomInt(100000, 999999).toString();

// Send OTP Email
// Common function to send an OTP email to the admin for both login and password reset processes.
const sendOtpEmail = async (admin, subject, bodyContent, next) => {
  const htmlContent = generateEmailTemplate({
    recipientName: admin.name,
    bodyContent,
  });
  try {
    await sendMail({
      email: admin.email,
      subject,
      html: htmlContent,
    });
  } catch (error) {
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    await admin.save();
    return next(new ErrorHandler("Error sending OTP email", 500));
  }
};

// Admin login
router.post(
  "/login-admin",
  catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin || !(await admin.comparePassword(password))) {
      return next(new ErrorHandler("Invalid credentials!", 400));
    }
    const otp = generateOtp();
    admin.otp = otp;
    admin.otpExpiry = Date.now() + 300000; // OTP expires in 5 minutes
    await admin.save();
    await sendOtpEmail(
      admin,
      "Admin Login OTP",
      getAdminLoginOtpEmailTemplate(otp),
      next
    );
    res.status(200).json({
      success: true,
      message: "OTP sent to registered email",
    });
  })
);

// Verify OTP
const verifyOtp = async (email, otp, next) => {
  const admin = await Admin.findOne({ email }).select("+otp +otpExpiry");
  if (admin.otp !== otp || admin.otpExpiry <= Date.now()) {
    return next(new ErrorHandler("Invalid or expired OTP", 400));
  }
  admin.otp = undefined;
  admin.otpExpiry = undefined;
  await admin.save();
  return admin;
};

// Verify OTP (for admin login and send token upon success)
router.post(
  "/verify-admin-otp",
  catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;
    const admin = await verifyOtp(email, otp, next);
    if (admin) {
      sendAdminToken(admin, 200, res);
    }
  })
);

// Forgot password
router.post(
  "/admin-forgot-password",
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
    await sendOtpEmail(
      admin,
      "Password Reset OTP",
      getOtpEmailTemplate(otp),
      next
    );
    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  })
);

// Reset password
router.put(
  "/admin-reset-password",
  catchAsyncErrors(async (req, res, next) => {
    const { email, newPassword } = req.body;
    const admin = await Admin.findOne({ email }).select("+otp +otpExpiry");
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

// Logout Admin
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

// Update Admin info
router.put(
  "/update-admin-info",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const { email, name, password, phoneNumber, avatar } = req.body;
    const admin = await Admin.findById(req.admin.id);
    if (email) admin.email = email;
    if (name) admin.name = name;
    if (phoneNumber) admin.phoneNumber = phoneNumber;
    if (password) admin.password = password;
    if (avatar) {
      if (admin.avatar && admin.avatar.public_id) {
        await cloudinary.uploader.destroy(admin.avatar.public_id);
      }
      const result = await cloudinary.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });
      admin.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }
    await admin.save();
    res.status(200).json({
      success: true,
      admin,
    });
  })
);

// Change Admin password
router.put(
  "/change-admin-password",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.id).select("+password");
    if (!(await admin.comparePassword(oldPassword))) {
      return next(new ErrorHandler("Old password is incorrect!", 400));
    }
    admin.password = newPassword;
    await admin.save();
    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  })
);

module.exports = router;
