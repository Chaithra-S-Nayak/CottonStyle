const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const Shop = require("../model/shop");
const Product = require("../model/product");
const { isSeller, isAdmin } = require("../middleware/auth");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendShopToken = require("../utils/shopToken");
const sendNotification = require("../utils/notification");
require("dotenv").config();
const crypto = require("crypto");
const {
  generateEmailTemplate,
  getActivationEmailTemplate,
  getAdminNotificationEmailTemplate,
  getOtpEmailTemplate,
  getShopDeletionEmailTemplate,
} = require("../utils/emailTemplates");

// Create shop
router.post(
  "/create-shop",
  catchAsyncErrors(async (req, res, next) => {
    const { email, avatar, name, password, address, phoneNumber, zipCode } =
      req.body;

    // Check if the seller already exists
    const existingSeller = await Shop.findOne({ email });
    if (existingSeller) {
      console.error("User already exists with email:", email);
      return next(new ErrorHandler("User already exists", 400));
    }

    // Upload avatar to Cloudinary if provided
    let sellerAvatar;
    if (avatar) {
      try {
        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatars",
        });
        sellerAvatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      } catch (error) {
        return next(new ErrorHandler("Avatar upload failed", 500));
      }
    } else {
      sellerAvatar = {
        public_id: "default_avatar_id",
        url: "https://res.cloudinary.com/dqyauy2y8/image/upload/v1721471562/avatars/default_eyjfy4.jpg",
      };
    }

    // Create the seller object
    const seller = {
      name,
      email,
      password,
      avatar: sellerAvatar,
      address,
      phoneNumber,
      zipCode,
    };
    const activationToken = createActivationToken(seller);
    const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;

    // Send activation email
    const bodyContent = getActivationEmailTemplate(activationUrl);
    const htmlContent = generateEmailTemplate({
      recipientName: name,
      bodyContent,
    });
    try {
      await sendMail({
        email: seller.email,
        subject: "Activate your Shop",
        html: htmlContent,
      });
      res.status(201).json({
        success: true,
        message: `Please check your email: ${seller.email} to activate your shop!`,
      });
    } catch (error) {
      return next(new ErrorHandler("Email sending failed", 500));
    }
  })
);

// Create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// Activate shop
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    const { activation_token } = req.body;

    // Verify the activation token
    let newSellerData;
    try {
      newSellerData = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );
    } catch (error) {
      return next(new ErrorHandler("Token expired or invalid", 400));
    }

    // Check if a seller with the same email already exists
    const existingSeller = await Shop.findOne({ email: newSellerData.email });
    if (existingSeller) {
      return next(new ErrorHandler("Seller already exists", 400));
    }

    // Create new seller
    let seller;
    try {
      seller = await Shop.create(newSellerData);
    } catch (error) {
      return next(new ErrorHandler("Error creating seller", 500));
    }

    // Notify admin
    const adminBodyContent = getAdminNotificationEmailTemplate(
      seller.name,
      seller.email,
      seller.phoneNumber
    );
    const adminHtmlContent = generateEmailTemplate({
      recipientName: "Admin",
      bodyContent: adminBodyContent,
    });
    try {
      await sendNotification(
        "seller_activation",
        `New seller activated with email: ${seller.email}`,
        process.env.ADMIN_ID,
        null
      );
      await sendMail({
        email: process.env.ADMIN_EMAIL,
        subject: "New Seller Activation",
        html: adminHtmlContent,
      });
    } catch (error) {
      return next(new ErrorHandler("Error notifying admin", 500));
    }

    sendShopToken(seller, 201, res);
  })
);

// Login shop
router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await Shop.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("User doesn't exist!", 400));
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new ErrorHandler("Invalid credentials!", 400));
    }
    sendShopToken(user, 201, res);
  })
);

// Generate OTP
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit random number
};

// Seller Forgot Password
router.post(
  "/seller-forgot-password",
  catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;
    const seller = await Shop.findOne({ email });
    if (!seller) {
      return next(new ErrorHandler("Seller not found", 404));
    }
    const otp = generateOtp();
    seller.otp = otp;
    seller.otpExpiry = Date.now() + 300000; // OTP expires in 5 minutes
    await seller.save();
    const bodyContent = getOtpEmailTemplate(otp);
    const htmlContent = generateEmailTemplate({
      recipientName: seller.name,
      bodyContent,
    });
    try {
      await sendMail({
        email: seller.email,
        subject: "Password Reset OTP",
        html: htmlContent,
      });
      res.status(200).json({
        success: true,
        message: "OTP sent to email",
      });
    } catch (error) {
      seller.otp = undefined;
      seller.otpExpiry = undefined;
      await seller.save();
      return next(new ErrorHandler("Error sending OTP email", 500));
    }
  })
);

// Verify OTP
router.post(
  "/seller-verify-otp",
  catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;
    const seller = await Shop.findOne({ email }).select("+otp +otpExpiry");
    if (seller.otp === otp && seller.otpExpiry > Date.now()) {
      res.status(200).json({
        success: true,
        message: "OTP is valid. You can now reset your password.",
      });
    } else {
      return next(new ErrorHandler("Invalid or expired OTP", 400));
    }
  })
);

// Reset Password after verifying otp
router.put(
  "/seller-reset-password",
  catchAsyncErrors(async (req, res, next) => {
    const { email, newPassword } = req.body;
    const seller = await Shop.findOne({ email }).select("+password");
    seller.password = newPassword;
    await seller.save();
    sendShopToken(seller, 201, res);
  })
);

// Load Shop
router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const seller = await Shop.findById(req.seller._id);
    res.status(200).json({
      success: true,
      seller,
    });
  })
);

// log out
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    res.cookie("seller_token", null, {
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

// get shop info
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    const shop = await Shop.findById(req.params.id);
    res.status(201).json({
      success: true,
      shop,
    });
  })
);

//Update Shop profile picture
router.put(
  "/update-shop-avatar",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    let existsSeller = await Shop.findById(req.seller._id);
    const imageId = existsSeller.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
    });
    existsSeller.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
    await existsSeller.save();
    res.status(200).json({
      success: true,
      seller: existsSeller,
    });
  })
);

//Update Seller info
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const { name, description, address, phoneNumber, email, zipCode } =
      req.body;
    const shop = await Shop.findOne(req.seller._id);
    shop.name = name;
    shop.description = description;
    shop.address = address;
    shop.phoneNumber = phoneNumber;
    shop.email = email;
    shop.zipCode = zipCode;
    await shop.save();
    res.status(201).json({
      success: true,
      shop,
    });
  })
);

// update seller password
router.put(
  "/change-seller-password",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const seller = await Shop.findById(req.seller.id).select("+password");
    const isPasswordMatched = await seller.comparePassword(
      req.body.oldPassword
    );
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect!", 400));
    }
    seller.password = req.body.newPassword;
    await seller.save();
    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  })
);

// Get all sellers (Admin)
router.get(
  "/admin-all-sellers",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const sellers = await Shop.find().sort({
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      sellers,
    });
  })
);

// Delete Shop (Admin)
router.delete(
  "/delete-seller/:id",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const seller = await Shop.findById(req.params.id);
    if (!seller) {
      return next(new ErrorHandler("Seller not found", 404));
    }
    // Delete all products associated with the seller
    await Product.deleteMany({ shopId: req.params.id });
    await Shop.findByIdAndDelete(req.params.id);
    const bodyContent = getShopDeletionEmailTemplate(process.env.ADMIN_EMAIL);
    const htmlContent = generateEmailTemplate({
      recipientName: seller.name,
      bodyContent,
    });
    try {
      await sendMail({
        email: seller.email,
        subject: "Account Deleted",
        html: htmlContent,
      });
      res.status(200).json({
        success: true,
        message: "Account deleted successfully",
      });
    } catch (error) {
      return next(
        new ErrorHandler("Error sending account deletion email", 500)
      );
    }
  })
);

// update seller withdraw method
router.post(
  "/add-payment-methods",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const { withdrawMethod } = req.body;
    const seller = await Shop.findById(req.seller._id);
    seller.withdrawMethod = withdrawMethod;
    await seller.save();
    res.status(201).json({
      success: true,
      seller,
    });
  })
);

// delete seller withdraw merthod
router.delete(
  "/delete-withdraw-method/",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const seller = await Shop.findById(req.seller._id);
    seller.withdrawMethod = null;
    await seller.save();
    res.status(201).json({
      success: true,
      seller,
    });
  })
);

module.exports = router;
