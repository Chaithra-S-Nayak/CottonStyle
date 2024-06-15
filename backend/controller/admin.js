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

router.get("/load", isAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

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

    const AdminLoginHtmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0;">
      <div style="max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
        <div style="text-align: center; padding: 10px; background-color: #f4f4f4; border-bottom: 1px solid #ccc;">
          <div style="font-size: 20px; font-weight: 300; margin: 0;">CottonStyle</div>
        </div>
        <p>Hello ${admin.name},</p>
        <p>We received a request to log into your admin account. Please use the OTP below to proceed with the login:</p>
        <p style="font-size: 20px; font-weight: 300; margin: 20px 0;">${otp}</p>
        <p>The OTP will expire in 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <div style="text-align: center; padding: 10px; background-color: #f4f4f4; border-top: 1px solid #ccc; font-size: 12px; color: #999;">
          <p>&copy; 2024 CottonStyle. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    try {
      await sendMail({
        email: admin.email,
        subject: "Admin Login OTP",
        message: `Your OTP for admin login is: ${otp}. It will expire in 5 minutes.`,
        html: AdminLoginHtmlContent,
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

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0;">
      <div style="max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
        <div style="text-align: center; padding: 10px; background-color: #f4f4f4; border-bottom: 1px solid #ccc;">
          <div style="font-size: 20px; font-weight: 300; margin: 0;">CottonStyle</div>
        </div>
        <p>Hello ${admin.name},</p>
        <p>We received a request to reset your password. Please use the OTP below to reset your password:</p>
        <p style="font-size: 20px; font-weight: 300; margin: 20px 0;">${otp}</p>
        <p>The OTP will expire in 5 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <div style="text-align: center; padding: 10px; background-color: #f4f4f4; border-top: 1px solid #ccc; font-size: 12px; color: #999;">
          <p>&copy; 2024 CottonStyle. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    try {
      await sendMail({
        email: admin.email,
        subject: "Password Reset OTP",
        message: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`,
        html: htmlContent,
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
  "/admin-verify-otp",
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

router.put(
  "/admin-reset-password",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return next(
        new ErrorHandler("New password and confirm password do not match", 400)
      );
    }

    const admin = await Admin.findById(req.admin.id).select("+password");

    if (!admin) {
      return next(new ErrorHandler("Admin not found", 404));
    }

    const isPasswordValid = await admin.comparePassword(oldPassword);

    if (!isPasswordValid) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ success: "Password changed successfully" });
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
    const { email, name, password, phoneNumber, avatar } = req.body;
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return next(new ErrorHandler("Admin not found", 404));
    }

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

// update admin password
router.put(
  "/change-admin-password",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const admin = await Admin.findById(req.admin.id).select("+password");

      const isPasswordMatched = await admin.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("Password doesn't matched with each other!", 400)
        );
      }
      admin.password = req.body.newPassword;

      await admin.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
