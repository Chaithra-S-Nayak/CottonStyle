// Import required modules
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const ErrorHandler = require("./middleware/error");

// Create Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/test", (req, res) => {
  res.send("Hi there!");
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(cookieParser());

// Configuration
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// Import routes
const userRoutes = require("./controller/user");
const shopRoutes = require("./controller/shop");
const adminRoutes = require("./controller/admin");
const productRoutes = require("./controller/product");
const couponRoutes = require("./controller/couponCode");
const paymentRoutes = require("./controller/payment");
const orderRoutes = require("./controller/order");
const returnRequestRoutes = require("./controller/returnRequest");
const withdrawRoutes = require("./controller/withdraw");
const adminOptionsRoutes = require("./controller/adminOptions");
const notificationRoutes = require("./controller/notification");
const wishlistRoutes = require("./controller/wishlist");

// Route Middleware
app.use("/api/v2/user", userRoutes);
app.use("/api/v2/admin", adminRoutes);
app.use("/api/v2/order", orderRoutes);
app.use("/api/v2/returnRequest", returnRequestRoutes);
app.use("/api/v2/shop", shopRoutes);
app.use("/api/v2/product", productRoutes);
app.use("/api/v2/coupon", couponRoutes);
app.use("/api/v2/payment", paymentRoutes);
app.use("/api/v2/withdraw", withdrawRoutes);
app.use("/api/v2/adminOptions", adminOptionsRoutes);
app.use("/api/v2/notifications", notificationRoutes);
app.use("/api/v2/wishlist", wishlistRoutes);

// Error handling middleware
app.use(ErrorHandler);

// Export Express app
module.exports = app;
