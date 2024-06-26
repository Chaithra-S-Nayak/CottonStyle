const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop");
const Admin = require("../model/admin");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);

  next();
});

exports.isSeller = catchAsyncErrors(async (req, res, next) => {
  const { seller_token } = req.cookies;
  if (!seller_token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);

  req.seller = await Shop.findById(decoded.id);

  next();
});

exports.isAdmin = catchAsyncErrors(async (req, res, next) => {
  const { admin_token } = req.cookies;

  if (!admin_token) {
    return next(new ErrorHandler("Unauthorized access", 401));
  }

  try {
    const decoded = jwt.verify(admin_token, process.env.JWT_SECRET_KEY);
    req.admin = await Admin.findById(decoded.id);

    if (!req.admin) {
      return next(new ErrorHandler("Admin not found", 404));
    }

    next();
  } catch (error) {
    return next(new ErrorHandler("Unauthorized access", 401));
  }
});
