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
const eventRoutes = require("./controller/event");
const couponRoutes = require("./controller/coupounCode");
const paymentRoutes = require("./controller/payment");
const orderRoutes = require("./controller/order");
const conversationRoutes = require("./controller/conversation");
const messageRoutes = require("./controller/message");
const withdrawRoutes = require("./controller/withdraw");
const adminOptionsRoutes = require("./controller/adminOptions");
const notificationRoutes = require("./controller/notification");

// Route Middleware
app.use("/api/v2/user", userRoutes);
app.use("/api/v2/admin", adminRoutes);
app.use("/api/v2/conversation", conversationRoutes);
app.use("/api/v2/message", messageRoutes);
app.use("/api/v2/order", orderRoutes);
app.use("/api/v2/shop", shopRoutes);
app.use("/api/v2/product", productRoutes);
app.use("/api/v2/event", eventRoutes);
app.use("/api/v2/coupon", couponRoutes);
app.use("/api/v2/payment", paymentRoutes);
app.use("/api/v2/withdraw", withdrawRoutes);
app.use("/api/v2/adminOptions", adminOptionsRoutes);
app.use("/api/v2/notifications", notificationRoutes);

// Error handling middleware
app.use(ErrorHandler);

// Export Express app
module.exports = app;
