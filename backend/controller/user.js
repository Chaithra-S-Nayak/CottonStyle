const express = require("express");
const User = require("../model/user");
const router = express.Router();
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const crypto = require("crypto");
require("dotenv").config();
const {
  generateEmailTemplate,
  getActivationEmailTemplate,
  getOtpEmailTemplate,
  getAccountDeletionEmailTemplate,
} = require("../utils/emailTemplates");

// Create user
router.post(
  "/create-user",
  catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, avatar } = req.body;
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }
    if (avatar) {
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });
      userAvatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    } else {
      userAvatar = {
        public_id: "default_avatar_id",
        url: "https://res.cloudinary.com/dqyauy2y8/image/upload/v1721471562/avatars/default_eyjfy4.jpg",
      };
    }
    const user = {
      name: name,
      email: email,
      password: password,
      avatar: userAvatar,
    };
    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;
    const bodyContent = getActivationEmailTemplate(activationUrl);
    const htmlContent = generateEmailTemplate({
      recipientName: name,
      bodyContent,
    });
    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        html: htmlContent,
      });
      res.status(201).json({
        success: true,
        message: `Please check your email: ${user.email} to activate your account!`,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// Activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    const { activation_token } = req.body;
    const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
    if (!newUser) {
      return next(new ErrorHandler("Invalid token", 400));
    }
    const { name, email, password, avatar } = newUser;
    let user = await User.findOne({ email });

    if (user) {
      return next(new ErrorHandler("User already exists", 400));
    }
    user = await User.create({
      name,
      email,
      avatar,
      password,
    });
    sendToken(user, 201, res);
  })
);

// Login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("User doesn't exist!", 400));
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new ErrorHandler("Invalid credentials!", 400));
    }
    sendToken(user, 201, res);
  })
);

// Generate OTP
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit random number
};

// User Forgot password
router.post(
  "/user-forgot-password",
  catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = Date.now() + 300000; // OTP expires in 5 minutes
    await user.save();
    const bodyContent = getOtpEmailTemplate(otp);
    const htmlContent = generateEmailTemplate({
      recipientName: user.name,
      bodyContent,
    });
    await sendMail({
      email: user.email,
      subject: "Password Reset OTP",
      html: htmlContent,
    });
    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  })
);

// Verify OTP
router.post(
  "/user-verify-otp",
  catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email }).select("+otp +otpExpiry");
    if (user.otp === otp && user.otpExpiry > Date.now()) {
      res.status(200).json({
        success: true,
        message: "OTP is valid. You can now reset your password.",
      });
    } else {
      return next(new ErrorHandler("Invalid or expired OTP", 400));
    }
  })
);

// Reset Password Endpoint
router.post(
  "/user-reset-password",
  catchAsyncErrors(async (req, res, next) => {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email }).select("+otp +otpExpiry");
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    sendToken(user, 201, res);
  })
);

// Load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  })
);

// Logout user
router.get(
  "/logout",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(201).json({
      success: true,
      message: "Log out successful!",
    });
  })
);

// Update user info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { email, phoneNumber, name } = req.body;
    const user = await User.findOne({ email });
    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber;
    await user.save();
    res.status(201).json({
      success: true,
      user,
    });
  })
);

// Update user avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    let existsUser = await User.findById(req.user.id);
    if (req.body.avatar !== "") {
      const imageId = existsUser.avatar.public_id;
      await cloudinary.v2.uploader.destroy(imageId);
      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
      });
      existsUser.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    await existsUser.save();
    res.status(200).json({
      success: true,
      user: existsUser,
    });
  })
);

// Update user addresses
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const sameTypeAddress = user.addresses.find(
      (address) => address.addressType === req.body.addressType
    );
    if (sameTypeAddress) {
      return next(
        new ErrorHandler(`${req.body.addressType} address already exists`)
      );
    }
    user.addresses.push(req.body);
    await user.save();
    res.status(200).json({
      success: true,
      user,
    });
  })
);

// Delete user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const userId = req.user._id;
    const addressId = req.params.id;
    await User.updateOne(
      { _id: userId },
      { $pull: { addresses: { _id: addressId } } }
    );
    const user = await User.findById(userId);
    res.status(200).json({ success: true, user });
  })
);

// Change user password
router.put(
  "/change-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect!", 400));
    }
    user.password = req.body.newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  })
);

// All users (Admin)
router.get(
  "/admin-all-users",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const users = await User.find().sort({
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      users,
    });
  })
);

// Delete user (Admin)
router.delete(
  "/delete-user/:id",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorHandler("User is not found with this id", 400));
    }
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    await User.findByIdAndDelete(req.params.id);
    const bodyContent = getAccountDeletionEmailTemplate(
      process.env.ADMIN_EMAIL
    );
    const htmlContent = generateEmailTemplate({
      recipientName: user.name,
      bodyContent,
    });
    await sendMail({
      email: user.email,
      subject: "Account Deleted",
      html: htmlContent,
    });
    res.status(201).json({
      success: true,
      message: "User deleted successfully!",
    });
  })
);

module.exports = router;
