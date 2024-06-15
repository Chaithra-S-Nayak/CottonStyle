const express = require("express");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const Shop = require("../model/shop");
const { isSeller, isAdmin } = require("../middleware/auth");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendShopToken = require("../utils/shopToken");
const sendNotification = require("../utils/notification");
require("dotenv").config();
const crypto = require("crypto");

// create shop
router.post(
  "/create-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email } = req.body;
      console.log("Creating new shop with email:", email);

      const sellerEmail = await Shop.findOne({ email });
      if (sellerEmail) {
        console.error("User already exists with email:", email);
        return next(new ErrorHandler("User already exists", 400));
      }

      let sellerAvatar = {
        public_id: "default_avatar_id",
        url: "https://res.cloudinary.com/dqyauy2y8/image/upload/v1714366014/avatars/crwcaulv68csvcqlbidq.png",
      };

      if (req.body.avatar) {
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
        });

        sellerAvatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      const seller = {
        name: req.body.name,
        email: email,
        password: req.body.password,
        avatar: sellerAvatar,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        zipCode: req.body.zipCode,
      };

      const activationToken = createActivationToken(seller);
      const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;

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
            <p>Hello ${seller.name},</p>
            <p>Thank you for registering with CottonStyle! Please click the button below to activate your shop:</p>
            <a href="${activationUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Activate Shop</a>
            <p>If you did not sign up for this shop, you can ignore this email.</p>
            <div style="text-align: center; padding: 10px; background-color: #f4f4f4; border-top: 1px solid #ccc; font-size: 12px; color: #999;">
              <p>&copy; 2024 CottonStyle. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      try {
        await sendMail({
          email: seller.email,
          subject: "Activate your Shop",
          message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
          html: htmlContent,
        });
        console.log(`Activation email sent to ${seller.email}`);

        res.status(201).json({
          success: true,
          message: `Please check your email: ${seller.email} to activate your shop!`,
        });
      } catch (error) {
        console.error("Error sending emails:", error);
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error) {
      console.error("Error creating shop:", error);
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newSeller = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newSeller) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password, avatar, zipCode, address, phoneNumber } =
        newSeller;

      let seller = await Shop.findOne({ email });

      if (seller) {
        return next(new ErrorHandler("User already exists", 400));
      }

      seller = await Shop.create({
        name,
        email,
        avatar,
        password,
        zipCode,
        address,
        phoneNumber,
      });

      const adminHtmlContent = `
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
            <p>Hello Admin,</p>
            <p>A new seller has activated their account with the following details:</p>
            <p>Name: ${seller.name}</p>
            <p>Email: ${seller.email}</p>
            <p>Phone Number: ${seller.phoneNumber}</p>
            <div style="text-align: center; padding: 10px; background-color: #f4f4f4; border-top: 1px solid #ccc; font-size: 12px; color: #999;">
              <p>&copy; 2024 CottonStyle. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

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
          message: `New seller activated with email: ${seller.email}`,
          html: adminHtmlContent,
        });
        console.log(
          `Admin notification email sent to ${process.env.ADMIN_EMAIL}`
        );
      } catch (error) {
        console.error("Error sending admin notification:", error);
        return next(new ErrorHandler(error.message, 500));
      }

      sendShopToken(seller, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// login shop
router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await Shop.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      sendShopToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Generate OTP
const generateOtp = () => {
  const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit random number
  return otp.toString();
};

// Send OTP Endpoint
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

    console.log("Generated OTP:", otp, "for email:", email);

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
        <p>Hello ${seller.name},</p>
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
        email: seller.email,
        subject: "Password Reset OTP",
        message: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`,
        html: htmlContent,
      });
      res.status(200).json({
        success: true,
        message: "OTP sent to email",
      });
    } catch (error) {
      seller.otp = undefined;
      seller.otpExpiry = undefined;
      await user.save();
      return next(new ErrorHandler("Error sending OTP email", 500));
    }
  })
);

//verify-otp
router.post(
  "/seller-verify-otp",
  catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;

    const seller = await Shop.findOne({ email }).select("+otp +otpExpiry");

    if (!seller) {
      return next(new ErrorHandler("Seller not found", 404));
    }

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

// Reset Password Endpoint
router.post(
  "/seller-reset-password",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, newPassword } = req.body;
      const seller = await Shop.findOne({ email }).select("+otp +otpExpiry");

      if (!seller) {
        return next(new ErrorHandler("Seller not found", 404));
      }

      // Hash the new password before saving
      seller.password = newPassword;
      seller.otp = undefined;
      seller.otpExpiry = undefined;
      await seller.save();

      res.status(200).json({
        success: true,
        message: "Password has been reset successfully",
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      return next(new ErrorHandler("Internal Server Error", 500));
    }
  })
);

// load shop
router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out from shop
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
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
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get shop info
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update shop profile picture
router.put(
  "/update-shop-avatar",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
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
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller info
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, description, address, phoneNumber, zipCode } = req.body;

      const shop = await Shop.findOne(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("User not found", 400));
      }

      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.zipCode = zipCode;

      await shop.save();

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller password
router.put(
  "/change-seller-password",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller.id).select("+password");

      const isPasswordMatched = await seller.comparePassword(
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
      seller.password = req.body.newPassword;

      await seller.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all sellers --- for admin
router.get(
  "/admin-all-sellers",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sellers = await Shop.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller ---admin
router.delete(
  "/delete-seller/:id",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.params.id);

      if (!seller) {
        return next(
          new ErrorHandler("Seller is not available with this id", 400)
        );
      }

      await Shop.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Seller deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller withdraw methods --- sellers
router.put(
  "/update-payment-methods",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { withdrawMethod } = req.body;

      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        withdrawMethod,
      });

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller withdraw merthods --- only seller
router.delete(
  "/delete-withdraw-method/",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("Seller not found with this id", 400));
      }

      seller.withdrawMethod = null;

      await seller.save();

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
